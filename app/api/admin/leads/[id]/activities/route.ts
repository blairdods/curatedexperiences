import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const serviceSupabase = await createServiceClient();
  const { data, error } = await serviceSupabase
    .from("lead_activities")
    .select("*")
    .eq("enquiry_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { type, description, metadata } = body;

  if (!type || !description) {
    return NextResponse.json({ error: "type and description required" }, { status: 400 });
  }

  const serviceSupabase = await createServiceClient();
  const { data, error } = await serviceSupabase
    .from("lead_activities")
    .insert({
      enquiry_id: id,
      type,
      description,
      metadata: metadata ?? null,
      created_by: user.email,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
