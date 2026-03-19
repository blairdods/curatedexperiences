import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "5");

  if (!query) {
    return NextResponse.json({ error: "q parameter required" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // TODO: Generate embedding for query, then cosine similarity search
  // This will be fully implemented in CUR-19
  // Placeholder: return recent active content
  const { data, error } = await supabase
    .from("content")
    .select("id, type, title, body")
    .eq("status", "active")
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ results: data });
}
