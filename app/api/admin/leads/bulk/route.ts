import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import { logAudit } from "@/lib/audit/log";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = user.email ? await getUserRole(user.email) : null;
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { ids, action, value } = body as {
    ids: string[];
    action: "status" | "assign" | "delete";
    value?: string;
  };

  if (!ids?.length || !action) {
    return NextResponse.json({ error: "ids and action required" }, { status: 400 });
  }

  const serviceSupabase = await createServiceClient();
  let updated = 0;

  for (const id of ids) {
    if (action === "status" && value) {
      await serviceSupabase.from("enquiries").update({ status: value }).eq("id", id);
      await serviceSupabase.from("lead_activities").insert({
        enquiry_id: id,
        type: "status_change",
        description: `Bulk status change to ${value.replace(/_/g, " ")}`,
        created_by: user.email,
      });
    } else if (action === "assign") {
      await serviceSupabase
        .from("enquiries")
        .update({ assigned_to: value || null })
        .eq("id", id);
      await serviceSupabase.from("lead_activities").insert({
        enquiry_id: id,
        type: "assignment",
        description: value ? `Bulk assigned to ${value}` : "Bulk unassigned",
        created_by: user.email,
      });
    } else if (action === "delete") {
      await serviceSupabase.from("enquiries").delete().eq("id", id);
    }

    await logAudit({
      entityType: "lead",
      entityId: id,
      action: action === "delete" ? "deleted" : "updated",
      changes: { after: { [action]: value } },
      userEmail: user.email,
    });

    updated++;
  }

  return NextResponse.json({ updated });
}
