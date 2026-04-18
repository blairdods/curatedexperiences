import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { logAudit } from "@/lib/audit/log";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await requireRole(user.email, ["admin"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const serviceSupabase = await createServiceClient();
  const { data, error } = await serviceSupabase
    .from("user_roles")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await requireRole(user.email, ["admin"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { email, role, display_name } = body;

  if (!email || !role) {
    return NextResponse.json({ error: "email and role are required" }, { status: 400 });
  }

  const serviceSupabase = await createServiceClient();
  const { data, error } = await serviceSupabase
    .from("user_roles")
    .insert({ email, role, display_name: display_name || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    entityType: "user_role",
    entityId: data.id,
    action: "created",
    changes: { after: { email, role, display_name } },
    userEmail: user.email,
  });

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await requireRole(user.email, ["admin"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { id, role, display_name } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const serviceSupabase = await createServiceClient();

  const { data: before } = await serviceSupabase
    .from("user_roles")
    .select("*")
    .eq("id", id)
    .single();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (role) updates.role = role;
  if (display_name !== undefined) updates.display_name = display_name;

  const { data, error } = await serviceSupabase
    .from("user_roles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    entityType: "user_role",
    entityId: id,
    action: "updated",
    changes: { before, after: data },
    userEmail: user.email,
  });

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await requireRole(user.email, ["admin"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const serviceSupabase = await createServiceClient();

  const { data: before } = await serviceSupabase
    .from("user_roles")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await serviceSupabase
    .from("user_roles")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    entityType: "user_role",
    entityId: id,
    action: "deleted",
    changes: { before },
    userEmail: user.email,
  });

  return NextResponse.json({ success: true });
}
