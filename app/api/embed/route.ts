import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/embeddings/client";
import { chunkText, prepareContentForEmbedding } from "@/lib/embeddings/chunk";

export async function POST(request: Request) {
  const { contentId, table = "content" } = await request.json();

  if (!contentId) {
    return NextResponse.json({ error: "contentId required" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  if (table === "tours") {
    const { data: tour, error } = await supabase
      .from("tours")
      .select("id, title, tagline, highlights, regions, experience_tags")
      .eq("id", contentId)
      .single();

    if (error || !tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Build a rich text representation for embedding
    const parts = [
      tour.title,
      tour.tagline,
      tour.highlights?.join(". "),
      tour.regions?.join(", "),
      tour.experience_tags?.join(", "),
    ].filter(Boolean);

    const embedding = await generateEmbedding(parts.join("\n\n"));

    const { error: updateError } = await supabase
      .from("tours")
      .update({ embedding })
      .eq("id", contentId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ id: contentId, status: "embedded" });
  }

  // Default: content table
  const { data: content, error } = await supabase
    .from("content")
    .select("id, title, body, type")
    .eq("id", contentId)
    .single();

  if (error || !content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  const text = prepareContentForEmbedding(
    content.title ?? "",
    content.body ?? "",
    content.type ?? undefined
  );

  // For short content, embed directly. For long content, embed the full
  // prepared text (the RPC handles retrieval at the record level).
  const chunks = chunkText(text);
  // Use the first chunk as the representative embedding.
  // Future: store per-chunk embeddings in a separate table for finer retrieval.
  const embedding = await generateEmbedding(
    chunks.length === 1 ? chunks[0].text : text.slice(0, 4000)
  );

  const { error: updateError } = await supabase
    .from("content")
    .update({ embedding })
    .eq("id", contentId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    id: contentId,
    status: "embedded",
    chunks: chunks.length,
  });
}
