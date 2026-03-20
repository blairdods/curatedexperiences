import { anthropic, MODELS } from "@/lib/claude/client";
import { createServiceClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/embeddings/client";

export async function POST(request: Request) {
  const { messages } = await request.json();

  if (!messages || messages.length === 0) {
    return new Response("Messages required", { status: 400 });
  }

  // Get the latest user message for RAG retrieval
  const lastUserMessage = [...messages]
    .reverse()
    .find((m: { role: string }) => m.role === "user");

  let ragContext = "";

  if (lastUserMessage) {
    try {
      const supabase = await createServiceClient();
      const queryEmbedding = await generateEmbedding(lastUserMessage.content);

      // Search both content and tours in parallel
      const [contentResult, toursResult] = await Promise.all([
        supabase.rpc("match_content", {
          query_embedding: queryEmbedding,
          match_threshold: 0.5,
          match_count: 3,
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
        ragContext += "\nRelevant journeys:\n";
        for (const tour of toursResult.data) {
          ragContext += `- ${tour.title} (${tour.regions?.join(", ")}): ${tour.tagline}`;
          if (tour.duration_days) ragContext += ` | ${tour.duration_days} days`;
          if (tour.price_from_usd)
            ragContext += ` | from $${tour.price_from_usd.toLocaleString()}`;
          ragContext += "\n";
        }
      }
    } catch {
      // RAG retrieval failed — continue without context
    }
  }

  const systemPrompt = `You are a Curated Experiences travel concierge — a warm, knowledgeable guide
to luxury New Zealand travel. You speak with authority about NZ destinations, experiences, and logistics.
You are helpful, never pushy, and always prioritise the traveller's interests.

${ragContext}

Key guidelines:
- Be warm and conversational, not corporate
- Offer specific, knowledgeable recommendations based on the context provided
- When appropriate, suggest booking a call with our team
- Never fabricate details about tours or pricing — only reference what you know from the context above
- If you don't have specific information, say so honestly and offer to connect them with a curator`;

  const stream = await anthropic.messages.stream({
    model: MODELS.concierge,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  return new Response(stream.toReadableStream(), {
    headers: { "Content-Type": "text/event-stream" },
  });
}
