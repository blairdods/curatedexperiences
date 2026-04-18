import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LeadsTable } from "@/components/admin/leads-table";
import { LeadFilters } from "@/components/admin/lead-filters";
import { ExportButton } from "@/components/admin/export-button";
import { Suspense } from "react";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; score?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const params = await searchParams;
  const serviceSupabase = await createServiceClient();

  let query = serviceSupabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply filters
  if (params.status) {
    query = query.eq("status", params.status);
  }

  if (params.score === "hot") {
    query = query.gte("intent_score", 7);
  } else if (params.score === "warm") {
    query = query.gte("intent_score", 4).lt("intent_score", 7);
  } else if (params.score === "cold") {
    query = query.lt("intent_score", 4);
  }

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,email.ilike.%${params.q}%`);
  }

  const { data: leads } = await query;

  // Get total count for display
  const { count: totalCount } = await serviceSupabase
    .from("enquiries")
    .select("id", { count: "exact", head: true });

  const isFiltered = !!(params.q || params.status || params.score);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-navy tracking-tight">Leads</h1>
          <p className="text-sm text-foreground-muted mt-1">
            {isFiltered
              ? `${leads?.length ?? 0} of ${totalCount ?? 0} leads`
              : `${totalCount ?? 0} total leads`}
          </p>
        </div>
        <ExportButton endpoint="/api/admin/export/leads" label="Export CSV" />
      </div>

      <div className="mt-6 mb-4">
        <Suspense>
          <LeadFilters />
        </Suspense>
      </div>

      <LeadsTable leads={leads ?? []} />
    </div>
  );
}
