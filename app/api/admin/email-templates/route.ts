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
    .from("email_templates")
    .select("*")
    .order("sequence_type")
    .order("step_index", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await requireRole(user.email, ["admin"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { id, subject, preview_text, body_html, delay_days, active } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const serviceSupabase = await createServiceClient();
  const updates: Record<string, unknown> = {
    updated_by: user.email,
    updated_at: new Date().toISOString(),
  };
  if (subject !== undefined) updates.subject = subject;
  if (preview_text !== undefined) updates.preview_text = preview_text;
  if (body_html !== undefined) updates.body_html = body_html;
  if (delay_days !== undefined) updates.delay_days = delay_days;
  if (active !== undefined) updates.active = active;

  const { data, error } = await serviceSupabase
    .from("email_templates")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    entityType: "email_template",
    entityId: id,
    action: "updated",
    changes: { after: updates },
    userEmail: user.email,
  });

  return NextResponse.json(data);
}
