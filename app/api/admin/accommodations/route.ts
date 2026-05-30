import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getUserRole(user.email);
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const tier = searchParams.get("tier");
  const region = searchParams.get("region");
  const q = searchParams.get("q");

  const serviceSupabase = await createServiceClient();
  let query = serviceSupabase
    .from("accommodations")
    .select("*")
    .order("name", { ascending: true });

  if (tier) query = query.eq("tier", tier);
  if (region) query = query.eq("region", region);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getUserRole(user.email);
  if (!role || !["admin", "curator"].includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();

  const allowed = [
    "slug", "name", "tier", "region", "location", "property_type", "description",
    "nightly_rate_nzd_min", "nightly_rate_nzd_max", "highlights", "images",
    "contact_name", "contact_email", "contact_phone", "website_url",
    "contracted", "notes", "active",
  ];
  const record: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) record[key] = body[key];
  }

  if (!record.name || !record.tier || !record.region) {
    return NextResponse.json({ error: "name, tier, and region are required" }, { status: 400 });
  }

  // Auto-generate slug if not provided
  if (!record.slug) {
    record.slug = (record.name as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const serviceSupabase = await createServiceClient();
  const { data, error } = await serviceSupabase
    .from("accommodations")
    .insert(record)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
