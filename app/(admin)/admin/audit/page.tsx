import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/roles";
import { AuditLogViewer } from "@/components/admin/audit-log-viewer";

export default async function AuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/admin/login");

  try {
    await requireRole(user.email, ["admin"]);
  } catch {
    redirect("/admin");
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy tracking-tight">
        Audit Log
      </h1>
      <p className="text-sm text-foreground-muted mt-1 mb-6">
        Track all changes made across the admin dashboard.
      </p>
      <AuditLogViewer />
    </div>
  );
}
