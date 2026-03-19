import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { contentId } = await request.json();

  if (!contentId) {
    return NextResponse.json({ error: "contentId required" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // Fetch the content record
  const { data: content, error } = await supabase
    .from("content")
    .select("id, title, body")
    .eq("id", contentId)
    .single();

  if (error || !content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  // TODO: Chunk text and generate embeddings via OpenAI or Anthropic
  // For now, return a placeholder
  return NextResponse.json({
    id: content.id,
    status: "embedding_pending",
    message: "Embedding pipeline will be implemented in CUR-19",
  });
}
