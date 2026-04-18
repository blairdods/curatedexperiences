import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LeadsTrendChart } from "@/components/admin/charts/leads-trend-chart";
import { ConversionFunnel } from "@/components/admin/charts/conversion-funnel";
import { SourceBreakdown } from "@/components/admin/charts/source-breakdown";
import { RevenueChart } from "@/components/admin/charts/revenue-chart";
import { IntentDistribution } from "@/components/admin/charts/intent-distribution";

const FUNNEL_STAGES = [
  "new",
  "nurturing",
  "proposal_sent",
  "deposit",
  "confirmed",
  "closed_won",
  "closed_lost",
];

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const serviceSupabase = await createServiceClient();

  // Fetch all data in parallel
  const [
    leadsOverTimeResult,
    revenueResult,
    allLeadsResult,
    bookingsResult,
  ] = await Promise.all([
    serviceSupabase.rpc("leads_over_time", {
      period_type: "week",
      from_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      to_date: new Date().toISOString(),
    }),
    serviceSupabase.rpc("bookings_revenue_over_time", {
      period_type: "month",
      from_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      to_date: new Date().toISOString(),
    }),
    serviceSupabase
      .from("enquiries")
      .select("status, source, intent_score"),
    serviceSupabase
      .from("bookings")
      .select("total_value_usd"),
  ]);

  const allLeads = allLeadsResult.data ?? [];

  // Conversion funnel data
  const funnelData = FUNNEL_STAGES.map((stage) => ({
    stage,
    count: allLeads.filter((l) => l.status === stage).length,
  }));

  // Source breakdown
  const sourceMap = new Map<string, number>();
  allLeads.forEach((l) => {
    const source = l.source || "Unknown";
    sourceMap.set(source, (sourceMap.get(source) ?? 0) + 1);
  });
  const sourceData = Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  // Intent score distribution
  const intentBuckets = [
    {
      range: "Cold (0-3)",
      count: allLeads.filter((l) => (l.intent_score ?? 0) < 4).length,
      color: "#9ca3af",
    },
    {
      range: "Warm (4-6)",
      count: allLeads.filter(
        (l) => (l.intent_score ?? 0) >= 4 && (l.intent_score ?? 0) < 7
      ).length,
      color: "#f59e0b",
    },
    {
      range: "Hot (7-10)",
      count: allLeads.filter((l) => (l.intent_score ?? 0) >= 7).length,
      color: "#dc2626",
    },
  ];

  // Summary metrics
  const totalLeads = allLeads.length;
  const totalRevenue = (bookingsResult.data ?? []).reduce(
    (sum, b) => sum + Number(b.total_value_usd ?? 0),
    0
  );
  const totalBookings = bookingsResult.data?.length ?? 0;
  const conversionRate =
    totalLeads > 0
      ? (
          (allLeads.filter((l) =>
            ["deposit", "confirmed", "closed_won"].includes(l.status)
          ).length /
            totalLeads) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy tracking-tight">
        Analytics
      </h1>
      <p className="text-sm text-foreground-muted mt-1">
        Pipeline performance and metrics
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <p className="text-xs tracking-wide text-foreground-muted uppercase">
            Total Leads
          </p>
          <p className="text-3xl font-serif text-navy mt-1">{totalLeads}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <p className="text-xs tracking-wide text-foreground-muted uppercase">
            Total Revenue
          </p>
          <p className="text-3xl font-serif text-navy mt-1">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <p className="text-xs tracking-wide text-foreground-muted uppercase">
            Bookings
          </p>
          <p className="text-3xl font-serif text-navy mt-1">{totalBookings}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <p className="text-xs tracking-wide text-foreground-muted uppercase">
            Conversion Rate
          </p>
          <p className="text-3xl font-serif text-navy mt-1">
            {conversionRate}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Leads Over Time */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Leads Over Time (90 days)
          </h2>
          <LeadsTrendChart data={leadsOverTimeResult.data ?? []} />
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Conversion Funnel
          </h2>
          <ConversionFunnel data={funnelData} />
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Revenue by Month
          </h2>
          <RevenueChart data={revenueResult.data ?? []} />
        </div>

        {/* Source Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Lead Sources
          </h2>
          <SourceBreakdown data={sourceData} />
        </div>

        {/* Intent Distribution */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Intent Score Distribution
          </h2>
          <IntentDistribution data={intentBuckets} />
        </div>
      </div>
    </div>
  );
}
