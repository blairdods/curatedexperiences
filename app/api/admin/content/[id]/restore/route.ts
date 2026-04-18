import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { logAudit } from "@/lib/audit/log";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await requireRole(user.email, ["admin", "curator"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { versionId } = body;

  if (!versionId) {
    return NextResponse.json({ error: "versionId required" }, { status: 400 });
  }

  const serviceSupabase = await createServiceClient();

  // Get current content
  const { data: current } = await serviceSupabase
    .from("content")
    .select("*")
    .eq("id", id)
    .single();

  if (!current) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  // Get the version to restore
  const { data: version } = await serviceSupabase
    .from("content_versions")
    .select("*")
    .eq("id", versionId)
    .single();

  if (!version) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  // Get max version number
  const { data: maxVersion } = await serviceSupabase
    .from("content_versions")
    .select("version")
    .eq("content_id", id)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  const nextVersion = (maxVersion?.version ?? 0) + 1;

  // Save current state as a new version before restoring
  await serviceSupabase.from("content_versions").insert({
    content_id: id,
    version: nextVersion,
    title: current.title,
    body: current.body,
    type: current.type,
    region_tags: current.region_tags,
    status: current.status,
    created_by: user.email,
    change_note: `Snapshot before restoring to version ${version.version}`,
  });

  // Overwrite content with version data
  const { error } = await serviceSupabase
    .from("content")
    .update({
      title: version.title,
      body: version.body,
      type: version.type,
      region_tags: version.region_tags,
      status: version.status,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAudit({
    entityType: "content",
    entityId: id,
    action: "restored",
    changes: { before: { version: nextVersion }, after: { version: version.version } },
    userEmail: user.email,
  });

  return NextResponse.json({ success: true, restoredVersion: version.version });
}
