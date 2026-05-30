import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LeadsTrendChart } from "@/components/admin/charts/leads-trend-chart";
import { ConversionFunnel } from "@/components/admin/charts/conversion-funnel";
import { SourceBreakdown } from "@/components/admin/charts/source-breakdown";
import { RevenueChart } from "@/components/admin/charts/revenue-chart";
import { IntentDistribution } from "@/components/admin/charts/intent-distribution";
import { GeoBreakdown } from "@/components/admin/charts/geo-breakdown";
import { Ga4TrafficChart } from "@/components/admin/charts/ga4-traffic";
import { CpaWidget } from "@/components/admin/cpa-widget";

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

  const since90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const sinceYear = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();

  const [
    leadsOverTimeResult,
    revenueResult,
    allLeadsResult,
    bookingsResult,
    ga4Result,
  ] = await Promise.all([
    serviceSupabase.rpc("leads_over_time", {
      period_type: "week",
      from_date: since90,
      to_date: new Date().toISOString(),
    }),
    serviceSupabase.rpc("bookings_revenue_over_time", {
      period_type: "month",
      from_date: sinceYear,
      to_date: new Date().toISOString(),
    }),
    serviceSupabase
      .from("enquiries")
      .select("status, source, intent_score, country, created_at"),
    serviceSupabase
      .from("bookings")
      .select("total_value_usd"),
    serviceSupabase
      .from("ga4_daily_metrics")
      .select("date, sessions, users, new_users, bounce_rate, engagement_rate")
      .gte("date", since30)
      .order("date", { ascending: true }),
  ]);

  const allLeads = allLeadsResult.data ?? [];

  // Conversion funnel
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
    { range: "Cold (0-3)", count: allLeads.filter((l) => (l.intent_score ?? 0) < 4).length, color: "#9ca3af" },
    { range: "Warm (4-6)", count: allLeads.filter((l) => (l.intent_score ?? 0) >= 4 && (l.intent_score ?? 0) < 7).length, color: "#f59e0b" },
    { range: "Hot (7-10)", count: allLeads.filter((l) => (l.intent_score ?? 0) >= 7).length, color: "#dc2626" },
  ];

  // Geographic breakdown — SG / US / Other
  const geoMap = new Map<string, number>();
  allLeads.forEach((l) => {
    let market = "Other";
    if (l.country === "SG") market = "Singapore";
    else if (l.country === "US") market = "United States";
    else if (l.country) market = "Other";
    else market = "Unknown";
    geoMap.set(market, (geoMap.get(market) ?? 0) + 1);
  });
  const totalLeadsWithCountry = allLeads.filter((l) => l.country).length;
  const geoData = ["Singapore", "United States", "Other"]
    .map((market) => ({
      market,
      count: geoMap.get(market) ?? 0,
      pct: totalLeadsWithCountry > 0
        ? Math.round(((geoMap.get(market) ?? 0) / totalLeadsWithCountry) * 100)
        : 0,
    }))
    .filter((d) => d.count > 0);

  // GA4 — aggregate by date across all sources
  const ga4ByDate = new Map<string, { sessions: number; users: number }>();
  for (const row of ga4Result.data ?? []) {
    const cur = ga4ByDate.get(row.date) ?? { sessions: 0, users: 0 };
    cur.sessions += row.sessions ?? 0;
    cur.users += row.users ?? 0;
    ga4ByDate.set(row.date, cur);
  }
  const ga4TrafficData = Array.from(ga4ByDate.entries())
    .map(([date, vals]) => ({ date, ...vals }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const ga4TotalSessions = ga4TrafficData.reduce((s, r) => s + r.sessions, 0);
  const ga4TotalUsers = ga4TrafficData.reduce((s, r) => s + r.users, 0);
  const ga4Rows = ga4Result.data ?? [];
  const avgBounce = ga4Rows.length > 0
    ? (ga4Rows.reduce((s, r) => s + (r.bounce_rate ?? 0), 0) / ga4Rows.length).toFixed(0)
    : null;

  // Summary metrics
  const totalLeads = allLeads.length;
  const totalRevenue = (bookingsResult.data ?? []).reduce(
    (sum, b) => sum + Number(b.total_value_usd ?? 0), 0
  );
  const totalBookings = bookingsResult.data?.length ?? 0;
  const conversionRate = totalLeads > 0
    ? ((allLeads.filter((l) => ["deposit", "confirmed", "closed_won"].includes(l.status)).length / totalLeads) * 100).toFixed(1)
    : "0";

  // CPA markets
  const sgLeads = allLeads.filter((l) => l.country === "SG").length;
  const usLeads = allLeads.filter((l) => l.country === "US").length;
  const cpaMarkets = [
    { market: "Singapore", leads: sgLeads, spend: 0 },
    { market: "United States", leads: usLeads, spend: 0 },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy tracking-tight">Analytics</h1>
      <p className="text-sm text-foreground-muted mt-1">Pipeline performance and market metrics</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <p className="text-xs tracking-wide text-foreground-muted uppercase">Total Leads</p>
          <p className="text-3xl font-serif text-navy mt-1">{totalLeads}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <p className="text-xs tracking-wide text-foreground-muted uppercase">Total Revenue</p>
          <p className="text-3xl font-serif text-navy mt-1">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <p className="text-xs tracking-wide text-foreground-muted uppercase">Bookings</p>
          <p className="text-3xl font-serif text-navy mt-1">{totalBookings}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <p className="text-xs tracking-wide text-foreground-muted uppercase">Conversion Rate</p>
          <p className="text-3xl font-serif text-navy mt-1">{conversionRate}%</p>
        </div>
      </div>

      {/* GA4 Summary row */}
      {ga4TotalSessions > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-xl p-5 border border-warm-200">
            <p className="text-xs tracking-wide text-foreground-muted uppercase">Sessions (30d)</p>
            <p className="text-2xl font-serif text-navy mt-1">{ga4TotalSessions.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-warm-200">
            <p className="text-xs tracking-wide text-foreground-muted uppercase">Users (30d)</p>
            <p className="text-2xl font-serif text-navy mt-1">{ga4TotalUsers.toLocaleString()}</p>
          </div>
          {avgBounce && (
            <div className="bg-white rounded-xl p-5 border border-warm-200">
              <p className="text-xs tracking-wide text-foreground-muted uppercase">Avg Bounce Rate</p>
              <p className="text-2xl font-serif text-navy mt-1">{avgBounce}%</p>
            </div>
          )}
        </div>
      )}

      {/* Charts — first row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Leads Over Time */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Leads Over Time (90 days)
          </h2>
          <LeadsTrendChart data={leadsOverTimeResult.data ?? []} />
        </div>

        {/* Geographic Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Geographic Breakdown
          </h2>
          <GeoBreakdown data={geoData} />
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Revenue by Month
          </h2>
          <RevenueChart data={revenueResult.data ?? []} />
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Conversion Funnel
          </h2>
          <ConversionFunnel data={funnelData} />
        </div>

        {/* GA4 Traffic */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Website Traffic (30 days)
          </h2>
          <Ga4TrafficChart data={ga4TrafficData} />
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Lead Sources
          </h2>
          <SourceBreakdown data={sourceData} />
        </div>

        {/* CPA Widget */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Cost Per Lead by Market
          </h2>
          <CpaWidget markets={cpaMarkets} />
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
