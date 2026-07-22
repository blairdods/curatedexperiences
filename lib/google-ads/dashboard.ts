import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
import { getGoogleAdsConnectionStatus } from "@/lib/google-ads/client";

export interface AdsCampaignSummary {
  id: string;
  name: string;
  status: string;
  channel: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionValue: number;
  ctr: number;
  cpc: number;
  cpa: number | null;
  impressionShare: number | null;
}

export interface AdsInsight {
  severity: "info" | "opportunity" | "warning";
  title: string;
  detail: string;
}

export interface SearchTermOpportunity {
  term: string;
  campaign: string;
  clicks: number;
  cost: number;
  conversions: number;
}

export interface GoogleAdsDashboardData {
  migrationReady: boolean;
  connection: ReturnType<typeof getGoogleAdsConnectionStatus>;
  currencyCode: string;
  lastSync: {
    status: string;
    completedAt: string | null;
    error: string | null;
  } | null;
  totals: {
    impressions: number;
    clicks: number;
    cost: number;
    conversions: number;
    conversionValue: number;
    ctr: number;
    cpc: number;
    cpa: number | null;
    crmLeads: number;
    qualifiedLeads: number;
    crmCpl: number | null;
  };
  campaigns: AdsCampaignSummary[];
  searchTerms: SearchTermOpportunity[];
  insights: AdsInsight[];
}

function numeric(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getGoogleAdsDashboardData(
  daysBack = 30
): Promise<GoogleAdsDashboardData> {
  const connection = getGoogleAdsConnectionStatus();
  const emptyTotals: GoogleAdsDashboardData["totals"] = {
    impressions: 0,
    clicks: 0,
    cost: 0,
    conversions: 0,
    conversionValue: 0,
    ctr: 0,
    cpc: 0,
    cpa: null,
    crmLeads: 0,
    qualifiedLeads: 0,
    crmCpl: null,
  };
  const supabase = await createServiceClient();
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - Math.min(Math.max(daysBack, 1), 90) + 1);
  const sinceDate = since.toISOString().slice(0, 10);

  const { error: migrationError } = await supabase
    .from("google_ads_campaign_daily")
    .select("id")
    .limit(1);
  if (migrationError) {
    return {
      migrationReady: false,
      connection,
      currencyCode: "NZD",
      lastSync: null,
      totals: emptyTotals,
      campaigns: [],
      searchTerms: [],
      insights: [
        {
          severity: "warning",
          title: "Database migration required",
          detail: "Run supabase/migrations/00035_google_ads.sql before the first sync.",
        },
      ],
    };
  }

  const [campaignResult, searchTermResult, syncResult, leadsResult] =
    await Promise.all([
      supabase
        .from("google_ads_campaign_daily")
        .select("*")
        .gte("date", sinceDate),
      supabase
        .from("google_ads_search_term_daily")
        .select("search_term, campaign_name, clicks, cost_micros, conversions")
        .gte("date", sinceDate)
        .order("cost_micros", { ascending: false })
        .limit(500),
      supabase
        .from("google_ads_sync_runs")
        .select("status, completed_at, error")
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("enquiries")
        .select("intent_score")
        .eq("source", "google_ads")
        .gte("created_at", `${sinceDate}T00:00:00.000Z`),
    ]);

  const campaignMap = new Map<
    string,
    AdsCampaignSummary & { impressionShareWeight: number }
  >();
  for (const row of campaignResult.data ?? []) {
    const id = String(row.campaign_id);
    const current = campaignMap.get(id) ?? {
      id,
      name: row.campaign_name ?? "Unnamed campaign",
      status: row.campaign_status ?? "UNKNOWN",
      channel: row.channel_type ?? "UNKNOWN",
      impressions: 0,
      clicks: 0,
      cost: 0,
      conversions: 0,
      conversionValue: 0,
      ctr: 0,
      cpc: 0,
      cpa: null,
      impressionShare: null,
      impressionShareWeight: 0,
    };
    const impressions = numeric(row.impressions);
    const impressionShare = numeric(row.search_impression_share);
    current.impressions += impressions;
    current.clicks += numeric(row.clicks);
    current.cost += numeric(row.cost_micros) / 1_000_000;
    current.conversions += numeric(row.conversions);
    current.conversionValue += numeric(row.conversion_value);
    if (impressionShare > 0 && impressions > 0) {
      current.impressionShare =
        (current.impressionShare ?? 0) + impressionShare * impressions;
      current.impressionShareWeight += impressions;
    }
    campaignMap.set(id, current);
  }

  const campaigns = Array.from(campaignMap.values())
    .map(({ impressionShareWeight, ...campaign }) => ({
      ...campaign,
      ctr:
        campaign.impressions > 0
          ? (campaign.clicks / campaign.impressions) * 100
          : 0,
      cpc: campaign.clicks > 0 ? campaign.cost / campaign.clicks : 0,
      cpa:
        campaign.conversions > 0
          ? campaign.cost / campaign.conversions
          : null,
      impressionShare:
        impressionShareWeight > 0 && campaign.impressionShare != null
          ? (campaign.impressionShare / impressionShareWeight) * 100
          : null,
    }))
    .sort((a, b) => b.cost - a.cost);

  const termMap = new Map<string, SearchTermOpportunity>();
  for (const row of searchTermResult.data ?? []) {
    const term = row.search_term ?? "";
    const campaign = row.campaign_name ?? "Unknown campaign";
    const key = `${campaign}\u0000${term}`;
    const current = termMap.get(key) ?? {
      term,
      campaign,
      clicks: 0,
      cost: 0,
      conversions: 0,
    };
    current.clicks += numeric(row.clicks);
    current.cost += numeric(row.cost_micros) / 1_000_000;
    current.conversions += numeric(row.conversions);
    termMap.set(key, current);
  }
  const searchTerms = Array.from(termMap.values())
    .filter((term) => term.cost > 0)
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 20);

  const totals = campaigns.reduce(
    (result, campaign) => {
      result.impressions += campaign.impressions;
      result.clicks += campaign.clicks;
      result.cost += campaign.cost;
      result.conversions += campaign.conversions;
      result.conversionValue += campaign.conversionValue;
      return result;
    },
    { ...emptyTotals }
  );
  totals.ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
  totals.cpc = totals.clicks > 0 ? totals.cost / totals.clicks : 0;
  totals.cpa = totals.conversions > 0 ? totals.cost / totals.conversions : null;
  totals.crmLeads = leadsResult.data?.length ?? 0;
  totals.qualifiedLeads =
    leadsResult.data?.filter((lead) => numeric(lead.intent_score) >= 7).length ?? 0;
  totals.crmCpl = totals.crmLeads > 0 ? totals.cost / totals.crmLeads : null;

  const insights: AdsInsight[] = [];
  if (!connection.configured) {
    insights.push({
      severity: "warning",
      title: "Google Ads is not connected",
      detail: "Add the customer ID, developer token, and service-account access to enable reporting.",
    });
  } else if (campaigns.length === 0) {
    insights.push({
      severity: "info",
      title: "No synced campaign data",
      detail: "Run the first sync after the account grants the service account access.",
    });
  }

  for (const campaign of campaigns) {
    if (campaign.impressions >= 200 && campaign.ctr < 3) {
      insights.push({
        severity: "opportunity",
        title: `Improve relevance in ${campaign.name}`,
        detail: `${campaign.ctr.toFixed(1)}% CTR across ${campaign.impressions.toLocaleString()} impressions is below the 3% launch threshold.`,
      });
    }
    if (campaign.cost >= 100 && campaign.conversions === 0) {
      insights.push({
        severity: "warning",
        title: `Review spend in ${campaign.name}`,
        detail: `${campaign.cost.toFixed(0)} spent without a recorded primary conversion in this period.`,
      });
    }
  }

  const wastedTerms = searchTerms.filter(
    (term) => term.cost >= 20 && term.conversions === 0
  );
  if (wastedTerms.length > 0) {
    insights.push({
      severity: "opportunity",
      title: "Review negative-keyword candidates",
      detail: `${wastedTerms.length} search terms spent at least 20 without a conversion. Review them before adding exclusions.`,
    });
  }
  if (totals.conversions > 0 && totals.crmLeads === 0) {
    insights.push({
      severity: "warning",
      title: "Ads and CRM conversions do not reconcile",
      detail: "Google Ads reports conversions but no attributed CRM leads were found. Check conversion actions and click-ID capture.",
    });
  }

  const currencyCode =
    campaignResult.data?.find((row) => row.currency_code)?.currency_code ?? "NZD";

  return {
    migrationReady: true,
    connection,
    currencyCode,
    lastSync: syncResult.data
      ? {
          status: syncResult.data.status,
          completedAt: syncResult.data.completed_at,
          error: syncResult.data.error,
        }
      : null,
    totals,
    campaigns,
    searchTerms,
    insights: insights.slice(0, 10),
  };
}
