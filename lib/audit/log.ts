import { createServiceClient } from "@/lib/supabase/server";

interface AuditEntry {
  entityType: string;
  entityId: string;
  action: string;
  changes?: { before?: unknown; after?: unknown } | null;
  userEmail: string;
}

export async function logAudit({
  entityType,
  entityId,
  action,
  changes,
  userEmail,
}: AuditEntry) {
  const supabase = await createServiceClient();
  await supabase.from("audit_log").insert({
    entity_type: entityType,
    entity_id: entityId,
    action,
    changes: changes ?? null,
    user_email: userEmail,
  });
}
