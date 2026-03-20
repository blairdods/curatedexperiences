import { headers } from "next/headers";
import { anthropic, MODELS } from "@/lib/claude/client";
import { createServiceClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/embeddings/client";
import { buildSystemPrompt, type VisitorContext } from "@/lib/claude/system-prompt";
import { extractBrief } from "@/lib/claude/extract-brief";
import { checkRateLimit, checkSessionBudget, trackSessionTokens } from "@/lib/claude/rate-limit";
import { notifyNewLead } from "@/lib/email/notify-lead";

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

  // --- Parse request ---
  const { messages, sessionId, visitorContext } = await request.json();

  if (!messages || messages.length === 0) {
    return new Response("Messages required", { status: 400 });
  }

  // --- Session budget check ---
  const sid = sessionId ?? ip;
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
          match_count: 5,
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

  // --- Build 8-layer system prompt ---
  const vCtx: VisitorContext = {
    currentPage: visitorContext?.currentPage,
    referrer: visitorContext?.referrer,
    returningVisitor: visitorContext?.returningVisitor,
    messageCount: messages.filter(
      (m: { role: string }) => m.role === "user"
    ).length,
  };

  const systemPrompt = buildSystemPrompt(ragContext, vCtx);

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
            source: "concierge",
            status: brief.intent_score >= 7 ? "nurturing" : "new",
          })
          .select("id")
          .single();

        if (data?.id) {
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
      "X-RateLimit-Remaining": String(rateCheck.remaining),
    },
  });
}
