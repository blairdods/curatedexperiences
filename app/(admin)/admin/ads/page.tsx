import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import { getGoogleAdsDashboardData } from "@/lib/google-ads/dashboard";
import {
  getAdContentSources,
  getEligibleAdAssets,
} from "@/lib/google-ads/content";
import { GoogleAdsSyncButton } from "@/components/admin/google-ads-sync-button";
import { AdDraftStudio } from "@/components/admin/ad-draft-studio";
import { AdDraftList } from "@/components/admin/ad-draft-list";

function money(value: number, currencyCode: string) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: currencyCode || "NZD",
    maximumFractionDigits: 0,
  }).format(value);
}

function metric(value: number, digits = 0) {
  return value.toLocaleString("en-NZ", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export default async function GoogleAdsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/admin/login");

  const role = await getUserRole(user.email);
  if (!role) redirect("/admin");

  const [dashboard, sources, assets] = await Promise.all([
    getGoogleAdsDashboardData(30),
    getAdContentSources(),
    getEligibleAdAssets(),
  ]);
  const service = await createServiceClient();
  const draftsResult = dashboard.migrationReady
    ? await service
        .from("google_ads_ad_drafts")
        .select("id, source_title, campaign_name, ad_group_name, final_url, headlines, descriptions, selected_asset_ids, status, rationale, created_at")
        .order("created_at", { ascending: false })
        .limit(12)
    : { data: [] };
  const drafts = draftsResult.data ?? [];
  const canDraft = role === "admin" || role === "curator";
  const canSync = role === "admin" || role === "analyst";

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl tracking-tight text-navy">Google Ads</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Account performance, CRM attribution, search-term analysis, and approval-gated creative.
          </p>
        </div>
        {canSync && (
          <GoogleAdsSyncButton
            disabled={!dashboard.connection.configured || !dashboard.migrationReady}
          />
        )}
      </header>

      <section className="rounded-xl border border-warm-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground-muted">Connection</p>
            <p className="mt-1 text-sm font-medium text-navy">
              {dashboard.connection.configured
                ? `Connected configuration · ${dashboard.connection.customerIdMasked}`
                : "Waiting for Google Ads account access"}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              dashboard.connection.configured
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            API {dashboard.connection.apiVersion}
          </span>
        </div>
        {!dashboard.connection.configured && (
          <div className="mt-4 grid gap-2 text-xs text-foreground-muted sm:grid-cols-2 lg:grid-cols-4">
            <p>{dashboard.connection.customerIdConfigured ? "✓" : "○"} Customer ID</p>
            <p>{dashboard.connection.developerTokenConfigured ? "✓" : "○"} Developer token</p>
            <p>{dashboard.connection.serviceAccountConfigured ? "✓" : "○"} Service account</p>
            <p>{dashboard.connection.loginCustomerIdConfigured ? "✓" : "○"} Manager ID, if used</p>
          </div>
        )}
        {dashboard.lastSync && (
          <p className="mt-3 text-xs text-foreground-muted">
            Last sync: {dashboard.lastSync.status}
            {dashboard.lastSync.completedAt
              ? ` · ${new Date(dashboard.lastSync.completedAt).toLocaleString("en-NZ")}`
              : ""}
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          ["Spend (30d)", money(dashboard.totals.cost, dashboard.currencyCode)],
          ["Ads conversions", metric(dashboard.totals.conversions, 1)],
          ["Attributed CRM leads", metric(dashboard.totals.crmLeads)],
          [
            "CRM cost per lead",
            dashboard.totals.crmCpl == null
              ? "—"
              : money(dashboard.totals.crmCpl, dashboard.currencyCode),
          ],
          ["Impressions", metric(dashboard.totals.impressions)],
          ["Clicks", metric(dashboard.totals.clicks)],
          ["CTR", `${metric(dashboard.totals.ctr, 1)}%`],
          ["Qualified CRM leads", metric(dashboard.totals.qualifiedLeads)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-warm-200 bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted">{label}</p>
            <p className="mt-1 font-serif text-2xl text-navy">{value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-xl border border-warm-200 bg-white p-5">
          <h2 className="font-serif text-xl text-navy">Campaign performance</h2>
          {dashboard.campaigns.length === 0 ? (
            <p className="py-10 text-center text-sm text-foreground-muted">Campaign data will appear after the first successful sync.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-warm-200 text-[10px] uppercase tracking-wide text-foreground-muted">
                  <tr>
                    <th className="pb-2 pr-4 font-medium">Campaign</th>
                    <th className="pb-2 pr-4 text-right font-medium">Spend</th>
                    <th className="pb-2 pr-4 text-right font-medium">Clicks</th>
                    <th className="pb-2 pr-4 text-right font-medium">CTR</th>
                    <th className="pb-2 text-right font-medium">CPA</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-warm-100 last:border-0">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-navy">{campaign.name}</p>
                        <p className="mt-0.5 text-[10px] text-foreground-muted">{campaign.status} · {campaign.channel}</p>
                      </td>
                      <td className="py-3 pr-4 text-right text-navy">{money(campaign.cost, dashboard.currencyCode)}</td>
                      <td className="py-3 pr-4 text-right text-navy">{metric(campaign.clicks)}</td>
                      <td className="py-3 pr-4 text-right text-navy">{metric(campaign.ctr, 1)}%</td>
                      <td className="py-3 text-right text-navy">
                        {campaign.cpa == null ? "—" : money(campaign.cpa, dashboard.currencyCode)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-warm-200 bg-white p-5">
          <h2 className="font-serif text-xl text-navy">Insights</h2>
          <div className="mt-4 space-y-3">
            {dashboard.insights.length === 0 ? (
              <p className="text-sm text-foreground-muted">No material issues detected in the current period.</p>
            ) : (
              dashboard.insights.map((insight) => (
                <div key={`${insight.title}:${insight.detail}`} className="rounded-lg bg-warm-50 p-3">
                  <p className="text-sm font-medium text-navy">{insight.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-foreground-muted">{insight.detail}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-warm-200 bg-white p-5">
        <h2 className="font-serif text-xl text-navy">Search-term review</h2>
        <p className="mt-1 text-xs text-foreground-muted">High-spend terms are surfaced for human review; no negative keywords are added automatically.</p>
        {dashboard.searchTerms.length === 0 ? (
          <p className="py-8 text-center text-sm text-foreground-muted">No search-term spend synced yet.</p>
        ) : (
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {dashboard.searchTerms.slice(0, 12).map((term) => (
              <div key={`${term.campaign}:${term.term}`} className="flex items-center justify-between gap-4 rounded-lg bg-warm-50 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-navy">{term.term}</p>
                  <p className="truncate text-[10px] text-foreground-muted">{term.campaign}</p>
                </div>
                <div className="flex-shrink-0 text-right text-xs text-navy">
                  <p>{money(term.cost, dashboard.currencyCode)}</p>
                  <p className="text-[10px] text-foreground-muted">{metric(term.conversions, 1)} conv.</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {canDraft && (
        <section className="rounded-xl border border-warm-200 bg-white p-5">
          <h2 className="font-serif text-xl text-navy">Creative workspace</h2>
          <p className="mt-1 text-xs text-foreground-muted">
            Generate review-only RSA drafts from the live site. Claims stay grounded in current content and media is restricted to durable, paid-approved sources.
          </p>
          <div className="mt-5">
            <AdDraftStudio sources={sources} assets={assets} />
          </div>
        </section>
      )}

      <section className="rounded-xl border border-warm-200 bg-white p-5">
        <h2 className="font-serif text-xl text-navy">Draft review queue</h2>
        <p className="mt-1 text-xs text-foreground-muted">Approval records intent; publishing remains disabled until the account connection and campaign launch decisions are complete.</p>
        <div className="mt-4">
          <AdDraftList drafts={drafts} canApprove={role === "admin"} />
        </div>
      </section>
    </div>
  );
}
