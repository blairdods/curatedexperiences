import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LeadsTable } from "@/components/admin/leads-table";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const serviceSupabase = await createServiceClient();
  const { data: leads } = await serviceSupabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy tracking-tight">Leads</h1>
      <p className="text-sm text-foreground-muted mt-1">
        {leads?.length ?? 0} total leads
      </p>
      <div className="mt-6">
        <LeadsTable leads={leads ?? []} />
      </div>
    </div>
  );
}
