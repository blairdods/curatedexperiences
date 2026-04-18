import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = user.email ? await getUserRole(user.email) : null;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(request.url);
  const entityType = url.searchParams.get("entity_type");
  const userEmail = url.searchParams.get("user_email");
  const limit = parseInt(url.searchParams.get("limit") ?? "100");

  const serviceSupabase = await createServiceClient();
  let query = serviceSupabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (entityType) query = query.eq("entity_type", entityType);
  if (userEmail) query = query.eq("user_email", userEmail);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = user.email ? await getUserRole(user.email) : null;
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { entityType, entityId, action, changes } = body;

  if (!entityType || !entityId || !action) {
    return NextResponse.json({ error: "entityType, entityId, and action required" }, { status: 400 });
  }

  const serviceSupabase = await createServiceClient();
  const { error } = await serviceSupabase.from("audit_log").insert({
    entity_type: entityType,
    entity_id: entityId,
    action,
    changes: changes ?? null,
    user_email: user.email,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
