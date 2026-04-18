import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/roles";
import { BackLink } from "@/components/admin/ui/back-link";
import { TeamManager } from "@/components/admin/team-manager";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/admin/login");

  try {
    await requireRole(user.email, ["admin"]);
  } catch {
    redirect("/admin");
  }

  const serviceSupabase = await createServiceClient();
  const { data: members } = await serviceSupabase
    .from("user_roles")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div>
      <BackLink href="/admin/settings" label="Back to Settings" />
      <h1 className="font-serif text-2xl text-navy tracking-tight mb-1">
        Team Management
      </h1>
      <p className="text-sm text-foreground-muted mb-6">
        Manage admin access. Users must log in with these email addresses.
      </p>
      <TeamManager members={members ?? []} />
    </div>
  );
}
