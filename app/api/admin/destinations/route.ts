import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const q = searchParams.get("q");

  const serviceSupabase = await createServiceClient();
  let query = serviceSupabase
    .from("destinations")
    .select("*")
    .order("region", { ascending: true })
    .order("name", { ascending: true });

  if (region) query = query.eq("region", region);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ destinations: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as Record<string, unknown>;

  if (!body.name || !body.region) {
    return NextResponse.json({ error: "Name and region are required" }, { status: 400 });
  }

  // Auto-generate slug from name if not provided
  if (!body.slug) {
    body.slug = String(body.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const serviceSupabase = await createServiceClient();
  const { data, error } = await serviceSupabase
    .from("destinations")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ destination: data }, { status: 201 });
}
