import { headers } from "next/headers";
import { anthropic, MODELS } from "@/lib/claude/client";
import { createServiceClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/embeddings/client";
import { buildSystemPrompt, type VisitorContext } from "@/lib/claude/system-prompt";
import { extractBrief } from "@/lib/claude/extract-brief";
import { checkRateLimit, checkSessionBudget, trackSessionTokens } from "@/lib/claude/rate-limit";
import { notifyNewLead } from "@/lib/email/notify-lead";
import {
  CONCIERGE_SCOPE_REFUSAL,
  MAX_CONCIERGE_REQUEST_BYTES,
  parseConciergeRequest,
} from "@/lib/claude/concierge-guardrails";
import { isConciergeRequestInScope } from "@/lib/claude/concierge-scope";
import { resolveLeadAttribution } from "@/lib/analytics/attribution";

function jsonError(message: string, status: number) {
  return Response.json({ error: "invalid_request", message }, { status });
}

function textStreamResponse(text: string, extraHeaders?: HeadersInit) {
  const payload = JSON.stringify({
    type: "content_block_delta",
    delta: { type: "text_delta", text },
  });

  return new Response(`${payload}\n`, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

export async function POST(request: Request) {
  // --- Rate limiting ---
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";

  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return new Response(
      JSON.stringify({
        error: "rate_limited",
        message:
          "You've been chatting a lot! Please try again in a little while, or reach out to our team directly.",
        retryAfterMs: rateCheck.retryAfterMs,
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // --- Parse and validate the untrusted browser request ---
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_CONCIERGE_REQUEST_BYTES) {
    return jsonError("Request body is too large", 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonError("Unable to read request body", 400);
  }
  if (new TextEncoder().encode(rawBody).byteLength > MAX_CONCIERGE_REQUEST_BYTES) {
    return jsonError("Request body is too large", 413);
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return jsonError("Request body must be valid JSON", 400);
  }

  const parsedRequest = parseConciergeRequest(parsedBody);
  if (!parsedRequest.ok) {
    return jsonError(parsedRequest.error, 400);
  }
  const { messages, sessionId, visitorContext } = parsedRequest.value;
  const leadAttribution = await resolveLeadAttribution({ source: "concierge" });

  // --- Session budget check ---
  const sid = `${ip}:${sessionId ?? "anonymous"}`;
  if (!checkSessionBudget(sid)) {
    return new Response(
      JSON.stringify({
        error: "session_budget",
        message:
          "We've had a wonderful conversation! For more detailed planning, I'd love to connect you with Tony or Liam from our team. Shall I arrange that?",
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // --- Topical guardrail ---
  // Fail closed: if the classifier is unavailable, do not send unclassified
  // visitor content to the general-purpose concierge model.
  let inScope = false;
  try {
    inScope = await isConciergeRequestInScope(messages);
  } catch (error) {
    console.error("Concierge scope classification failed:", error);
    return Response.json(
      {
        error: "guardrail_unavailable",
        message: "I’m having trouble checking that request right now. Please try again in a moment.",
      },
      { status: 503 }
    );
  }

  if (!inScope) {
    return textStreamResponse(CONCIERGE_SCOPE_REFUSAL, {
      "X-Concierge-Guardrail": "blocked",
      "X-RateLimit-Remaining": String(rateCheck.remaining),
    });
  }

  // --- RAG retrieval ---
  const lastUserMessage = [...messages]
    .reverse()
    .find((m: { role: string }) => m.role === "user");

  let ragContext = "";

  if (lastUserMessage) {
    try {
      const supabase = await createServiceClient();
      const queryEmbedding = await generateEmbedding(lastUserMessage.content);

      const [contentResult, toursResult] = await Promise.all([
        supabase.rpc("match_content", {
          query_embedding: queryEmbedding,
          match_threshold: 0.5,
          match_count: 8,
        }),
        supabase.rpc("match_tours", {
          query_embedding: queryEmbedding,
          match_threshold: 0.5,
          match_count: 3,
        }),
      ]);

      if (contentResult.data?.length) {
        ragContext += "Relevant knowledge:\n";
        for (const item of contentResult.data) {
          ragContext += `- ${item.title}: ${item.body?.slice(0, 500)}\n`;
        }
      }

      if (toursResult.data?.length) {
        ragContext += "\nAvailable journeys:\n";
        for (const tour of toursResult.data) {
          ragContext += `- ${tour.title} (${tour.regions?.join(", ")}): ${tour.tagline}`;
          if (tour.duration_days) ragContext += ` | ${tour.duration_days} days`;
          if (tour.price_from_usd)
            ragContext += ` | from USD $${tour.price_from_usd.toLocaleString()}`;
          ragContext += "\n";
        }
      }
    } catch {
      // RAG retrieval failed — continue without context
    }
  }

  // --- Load brand voice from DB (with fallback) ---
  let brandVoice: string | undefined;
  try {
    const supabaseForSettings = await createServiceClient();
    const { data: settings } = await supabaseForSettings
      .from("settings")
      .select("key, value")
      .in("key", [
        "brand_voice_persona",
        "brand_voice_tone",
        "brand_voice_vocabulary_use",
        "brand_voice_vocabulary_avoid",
        "brand_voice_rules",
      ]);

    if (settings && settings.length > 0) {
      const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
      brandVoice = [
        map.brand_voice_persona ? `## Our CE Curators\n\n${map.brand_voice_persona}` : "",
        map.brand_voice_tone ? `## Voice & Tone\n\n${map.brand_voice_tone}` : "",
        map.brand_voice_vocabulary_use ? `## Words We Use\n\n${map.brand_voice_vocabulary_use}` : "",
        map.brand_voice_vocabulary_avoid ? `## Words We Avoid\n\n${map.brand_voice_vocabulary_avoid}` : "",
        map.brand_voice_rules ? `## Rules\n\n${map.brand_voice_rules}` : "",
      ].filter(Boolean).join("\n\n---\n\n");
    }
  } catch {
    // Fall back to static brand voice
  }

  // --- Build 8-layer system prompt ---
  const vCtx: VisitorContext = {
    currentPage: visitorContext?.currentPage,
    referrer: visitorContext?.referrer,
    returningVisitor: visitorContext?.returningVisitor,
    messageCount: messages.filter(
      (m: { role: string }) => m.role === "user"
    ).length,
    customization: visitorContext?.customization,
    country: visitorContext?.country,
    conciergeVariant: visitorContext?.conciergeVariant,
  };

  const systemPrompt = buildSystemPrompt(ragContext, vCtx, brandVoice);

  // --- Stream response ---
  const stream = await anthropic.messages.stream({
    model: MODELS.concierge,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  // Collect the full response for brief extraction (non-blocking)
  const responseChunks: string[] = [];

  stream.on("text", (text) => {
    responseChunks.push(text);
  });

  stream.on("finalMessage", async (message) => {
    // Track token usage
    trackSessionTokens(
      sid,
      message.usage.input_tokens,
      message.usage.output_tokens
    );

    // Extract and save brief if present
    const fullResponse = responseChunks.join("");
    const brief = extractBrief(fullResponse);

    if (brief) {
      try {
        const supabase = await createServiceClient();
        const { data } = await supabase
          .from("enquiries")
          .insert({
            name: brief.name,
            interests: brief.interests,
            journey_type_pref: brief.journey_type_pref,
            group_size: brief.group_size,
            group_composition: brief.group_composition,
            budget_signal: brief.budget_signal,
            intent_score: brief.intent_score,
            ai_brief: brief.ai_brief,
            ...leadAttribution,
            status: "new",
            country: visitorContext?.country ?? null,
          })
          .select("id")
          .single();

        if (data?.id) {
          const hasContactInfo = !!brief.name;
          // Log activity
          supabase
            .from("lead_activities")
            .insert({
              enquiry_id: data.id,
              type: "lead_created",
              description: `Lead auto-created from concierge brief (intent: ${brief.intent_score}/10)${hasContactInfo ? "" : " — no email, set to new instead of nurturing"}`,
              metadata: {
                intent_score: brief.intent_score,
                journey_type: brief.journey_type_pref,
                has_email: false,
                status: "new",
              },
              created_by: "system",
            })
            .then(() => {}, () => {});

          // Fire-and-forget email notification
          notifyNewLead(brief, data.id).catch(() => {});
        }
      } catch (err) {
        console.error("Failed to save brief:", err);
      }
    }
  });

  return new Response(stream.toReadableStream(), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      "X-RateLimit-Remaining": String(rateCheck.remaining),
    },
  });
}
