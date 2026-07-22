import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
import {
  configuredGoogleAdsCustomerId,
  fetchGoogleAdsAccount,
  fetchGoogleAdsAdGroups,
  fetchGoogleAdsCampaigns,
  fetchGoogleAdsConversions,
  fetchGoogleAdsSearchTerms,
  getGoogleAdsConnectionStatus,
} from "@/lib/google-ads/client";

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function text(value: unknown): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";
}

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function resourceId(value: unknown): string {
  return text(value).split("/").pop() ?? "";
}

async function upsertBatches(
  table: string,
  rows: UnknownRecord[],
  onConflict: string
) {
  if (rows.length === 0) return;
  const supabase = await createServiceClient();
  for (let index = 0; index < rows.length; index += 500) {
    const { error } = await supabase
      .from(table)
      .upsert(rows.slice(index, index + 500), { onConflict });
    if (error) throw new Error(`${table} sync failed: ${error.message}`);
  }
}

async function migrationReady(): Promise<boolean> {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from("google_ads_campaign_daily")
    .select("id")
    .limit(1);
  return !error;
}

export async function syncGoogleAds(daysBack = 7) {
  const connection = getGoogleAdsConnectionStatus();
  if (!connection.configured) {
    return {
      status: "skipped" as const,
      configNote: "Google Ads API credentials are incomplete.",
      connection,
    };
  }

  if (!(await migrationReady())) {
    return {
      status: "skipped" as const,
      migrationNote:
        "Run supabase/migrations/00035_google_ads.sql before syncing Google Ads.",
      connection,
    };
  }

  const customerId = configuredGoogleAdsCustomerId();
  const safeDaysBack = Math.min(Math.max(daysBack, 1), 90);
  const supabase = await createServiceClient();
  const { data: syncRun } = await supabase
    .from("google_ads_sync_runs")
    .insert({
      customer_id: customerId,
      status: "running",
      days_back: safeDaysBack,
    })
    .select("id")
    .single();

  try {
    const [account, campaigns, adGroups, searchTerms, conversions] =
      await Promise.all([
        fetchGoogleAdsAccount(),
        fetchGoogleAdsCampaigns(safeDaysBack),
        fetchGoogleAdsAdGroups(safeDaysBack),
        fetchGoogleAdsSearchTerms(safeDaysBack),
        fetchGoogleAdsConversions(safeDaysBack),
      ]);

    const accountRecord = record(record(account).customer);
    const currencyCode = text(accountRecord.currencyCode);
    const fetchedAt = new Date().toISOString();

    const campaignRows = campaigns.map((row) => {
      const campaign = record(row.campaign);
      const segments = record(row.segments);
      const metrics = record(row.metrics);
      const customer = record(row.customer);
      return {
        customer_id: customerId,
        date: text(segments.date),
        campaign_id: text(campaign.id),
        campaign_name: text(campaign.name),
        campaign_status: text(campaign.status),
        channel_type: text(campaign.advertisingChannelType),
        bidding_strategy_type: text(campaign.biddingStrategyType),
        currency_code: text(customer.currencyCode) || currencyCode,
        impressions: number(metrics.impressions),
        clicks: number(metrics.clicks),
        cost_micros: number(metrics.costMicros),
        conversions: number(metrics.conversions),
        conversion_value: number(metrics.conversionsValue),
        ctr: number(metrics.ctr),
        average_cpc_micros: number(metrics.averageCpc),
        cost_per_conversion_micros: number(metrics.costPerConversion),
        search_impression_share: number(metrics.searchImpressionShare),
        fetched_at: fetchedAt,
      };
    });

    const adGroupRows = adGroups.map((row) => {
      const campaign = record(row.campaign);
      const adGroup = record(row.adGroup);
      const segments = record(row.segments);
      const metrics = record(row.metrics);
      return {
        customer_id: customerId,
        date: text(segments.date),
        campaign_id: text(campaign.id),
        campaign_name: text(campaign.name),
        ad_group_id: text(adGroup.id),
        ad_group_name: text(adGroup.name),
        ad_group_status: text(adGroup.status),
        impressions: number(metrics.impressions),
        clicks: number(metrics.clicks),
        cost_micros: number(metrics.costMicros),
        conversions: number(metrics.conversions),
        conversion_value: number(metrics.conversionsValue),
        ctr: number(metrics.ctr),
        average_cpc_micros: number(metrics.averageCpc),
        fetched_at: fetchedAt,
      };
    });

    const searchTermRows = searchTerms.map((row) => {
      const campaign = record(row.campaign);
      const adGroup = record(row.adGroup);
      const searchTermView = record(row.searchTermView);
      const segments = record(row.segments);
      const keyword = record(record(segments.keyword).info);
      const metrics = record(row.metrics);
      return {
        customer_id: customerId,
        date: text(segments.date),
        campaign_id: text(campaign.id),
        campaign_name: text(campaign.name),
        ad_group_id: text(adGroup.id),
        ad_group_name: text(adGroup.name),
        search_term: text(searchTermView.searchTerm),
        keyword_text: text(keyword.text) || null,
        match_type: text(keyword.matchType) || null,
        impressions: number(metrics.impressions),
        clicks: number(metrics.clicks),
        cost_micros: number(metrics.costMicros),
        conversions: number(metrics.conversions),
        fetched_at: fetchedAt,
      };
    });

    const conversionRows = conversions.map((row) => {
      const campaign = record(row.campaign);
      const segments = record(row.segments);
      const metrics = record(row.metrics);
      return {
        customer_id: customerId,
        date: text(segments.date),
        campaign_id: text(campaign.id),
        campaign_name: text(campaign.name),
        conversion_action_id: resourceId(segments.conversionAction),
        conversion_action_name: text(segments.conversionActionName) || null,
        conversions: number(metrics.conversions),
        conversion_value: number(metrics.conversionsValue),
        all_conversions: number(metrics.allConversions),
        fetched_at: fetchedAt,
      };
    });

    await Promise.all([
      upsertBatches(
        "google_ads_campaign_daily",
        campaignRows,
        "customer_id,date,campaign_id"
      ),
      upsertBatches(
        "google_ads_ad_group_daily",
        adGroupRows,
        "customer_id,date,ad_group_id"
      ),
      upsertBatches(
        "google_ads_search_term_daily",
        searchTermRows,
        "customer_id,date,campaign_id,ad_group_id,search_term"
      ),
      upsertBatches(
        "google_ads_conversion_daily",
        conversionRows,
        "customer_id,date,campaign_id,conversion_action_id"
      ),
    ]);

    const rowCounts = {
      campaigns: campaignRows.length,
      adGroups: adGroupRows.length,
      searchTerms: searchTermRows.length,
      conversions: conversionRows.length,
    };
    if (syncRun?.id) {
      await supabase
        .from("google_ads_sync_runs")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          row_counts: {
            ...rowCounts,
            account: {
              name: text(accountRecord.descriptiveName),
              currencyCode,
              timeZone: text(accountRecord.timeZone),
            },
          },
        })
        .eq("id", syncRun.id);
    }

    return {
      status: "ok" as const,
      connection,
      account: {
        name: text(accountRecord.descriptiveName),
        currencyCode,
        timeZone: text(accountRecord.timeZone),
      },
      rowCounts,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (syncRun?.id) {
      await supabase
        .from("google_ads_sync_runs")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
          error: message.slice(0, 4000),
        })
        .eq("id", syncRun.id);
    }
    return { status: "error" as const, connection, error: message };
  }
}
