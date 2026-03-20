import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/embeddings/client";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "5");
  const threshold = parseFloat(
    request.nextUrl.searchParams.get("threshold") ?? "0.5"
  );
  const table = request.nextUrl.searchParams.get("table") ?? "content";

  if (!query) {
    return NextResponse.json(
      { error: "q parameter required" },
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();
  const queryEmbedding = await generateEmbedding(query);

  const rpcName = table === "tours" ? "match_tours" : "match_content";

  const { data, error } = await supabase.rpc(rpcName, {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ results: data });
}
