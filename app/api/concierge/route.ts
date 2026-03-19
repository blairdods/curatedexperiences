import { anthropic, MODELS } from "@/lib/claude/client";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function POST(request: Request) {
  const { messages, tourContext } = await request.json();

  // Retrieve relevant content via embeddings for RAG
  const supabase = await createServiceClient();

  // Build system prompt with injected context
  const systemPrompt = `You are a Curated Experiences travel concierge — a warm, knowledgeable guide
to luxury New Zealand travel. You speak with authority about NZ destinations, experiences, and logistics.
You are helpful, never pushy, and always prioritise the traveller's interests.

${tourContext ? `Relevant journey information:\n${tourContext}` : ""}

Key guidelines:
- Be warm and conversational, not corporate
- Offer specific, knowledgeable recommendations
- When appropriate, suggest booking a call with our team
- Never fabricate details about tours or pricing — only reference what you know`;

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
