import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/roles";
import { BackLink } from "@/components/admin/ui/back-link";
import { EmailTemplateManager } from "@/components/admin/email-template-manager";

export default async function EmailTemplatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/admin/login");

  try {
    await requireRole(user.email, ["admin"]);
  } catch {
    redirect("/admin");
  }

  const serviceSupabase = await createServiceClient();
  const { data: templates } = await serviceSupabase
    .from("email_templates")
    .select("*")
    .order("sequence_type")
    .order("step_index", { ascending: true });

  return (
    <div>
      <BackLink href="/admin/settings" label="Back to Settings" />
      <h1 className="font-serif text-2xl text-navy tracking-tight mb-1">
        Email Templates
      </h1>
      <p className="text-sm text-foreground-muted mb-6">
        Edit nurture email sequences. Changes take effect on the next cron run.
      </p>
      <EmailTemplateManager templates={templates ?? []} />
    </div>
  );
}
