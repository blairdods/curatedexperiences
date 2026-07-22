import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getUserRole(user.email);
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    status?: "approved" | "rejected";
  };
  if (!body.status || !["approved", "rejected"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { id } = await params;
  const service = await createServiceClient();
  const update =
    body.status === "approved"
      ? {
          status: body.status,
          approved_by_email: user.email,
          approved_at: new Date().toISOString(),
        }
      : {
          status: body.status,
          approved_by_email: null,
          approved_at: null,
        };
  const { data, error } = await service
    .from("google_ads_ad_drafts")
    .update(update)
    .eq("id", id)
    .neq("status", "published")
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await service.from("audit_log").insert({
    entity_type: "google_ads_ad_draft",
    entity_id: id,
    action: body.status,
    changes: { status: body.status },
    user_email: user.email,
  });

  return NextResponse.json({ draft: data });
}
