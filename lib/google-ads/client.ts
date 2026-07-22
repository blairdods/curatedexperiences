import "server-only";

import { GoogleAuth } from "google-auth-library";

const GOOGLE_ADS_API_VERSION = "v24";
const GOOGLE_ADS_API_BASE = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}`;

type GoogleAdsRow = Record<string, unknown>;

interface ServiceAccountJson {
  client_email?: string;
  private_key?: string;
}

function serviceAccountJson(): ServiceAccountJson {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ServiceAccountJson;
  } catch {
    return {};
  }
}

const sharedServiceAccount = serviceAccountJson();

function normalizedCustomerId(value?: string): string {
  return (value ?? "").replace(/-/g, "").trim();
}

function config() {
  return {
    customerId: normalizedCustomerId(process.env.GOOGLE_ADS_CUSTOMER_ID),
    loginCustomerId: normalizedCustomerId(
      process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID
    ),
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN?.trim() ?? "",
    clientEmail:
      process.env.GOOGLE_ADS_SERVICE_ACCOUNT_EMAIL?.trim() ||
      process.env.GA4_CLIENT_EMAIL?.trim() ||
      sharedServiceAccount.client_email ||
      "",
    privateKey:
      process.env.GOOGLE_ADS_PRIVATE_KEY ||
      process.env.GA4_PRIVATE_KEY ||
      sharedServiceAccount.private_key ||
      "",
  };
}

export interface GoogleAdsConnectionStatus {
  configured: boolean;
  customerIdConfigured: boolean;
  loginCustomerIdConfigured: boolean;
  developerTokenConfigured: boolean;
  serviceAccountConfigured: boolean;
  customerIdMasked: string | null;
  apiVersion: string;
}

export function getGoogleAdsConnectionStatus(): GoogleAdsConnectionStatus {
  const value = config();
  return {
    configured: Boolean(
      value.customerId &&
        value.developerToken &&
        value.clientEmail &&
        value.privateKey
    ),
    customerIdConfigured: Boolean(value.customerId),
    loginCustomerIdConfigured: Boolean(value.loginCustomerId),
    developerTokenConfigured: Boolean(value.developerToken),
    serviceAccountConfigured: Boolean(value.clientEmail && value.privateKey),
    customerIdMasked: value.customerId
      ? `••••••${value.customerId.slice(-4)}`
      : null,
    apiVersion: GOOGLE_ADS_API_VERSION,
  };
}

let cachedAccessToken: string | null = null;
let accessTokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < accessTokenExpiry - 60_000) {
    return cachedAccessToken;
  }

  const value = config();
  const auth = new GoogleAuth({
    credentials: {
      client_email: value.clientEmail,
      private_key: value.privateKey.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/adwords"],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  cachedAccessToken = token?.token ?? null;
  accessTokenExpiry = token?.res?.data?.expiry_date ?? Date.now() + 3_600_000;
  if (!cachedAccessToken) throw new Error("Unable to obtain Google Ads access token");
  return cachedAccessToken;
}

export async function runGoogleAdsQuery(query: string): Promise<GoogleAdsRow[]> {
  const value = config();
  if (!getGoogleAdsConnectionStatus().configured) {
    throw new Error("Google Ads API credentials are incomplete");
  }

  const token = await getAccessToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "developer-token": value.developerToken,
  };
  if (value.loginCustomerId) {
    headers["login-customer-id"] = value.loginCustomerId;
  }

  const response = await fetch(
    `${GOOGLE_ADS_API_BASE}/customers/${value.customerId}/googleAds:searchStream`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Google Ads API request failed (${response.status}): ${body.slice(0, 1200)}`
    );
  }

  const batches = (await response.json()) as Array<{
    results?: GoogleAdsRow[];
  }>;
  return batches.flatMap((batch) => batch.results ?? []);
}

function dateRange(daysBack: number): { start: string; end: string } {
  const safeDays = Math.min(Math.max(daysBack, 1), 90);
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - safeDays + 1);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export async function fetchGoogleAdsAccount() {
  const rows = await runGoogleAdsQuery(`
    SELECT
      customer.id,
      customer.descriptive_name,
      customer.currency_code,
      customer.time_zone
    FROM customer
    LIMIT 1
  `);
  return rows[0] ?? null;
}

export async function fetchGoogleAdsCampaigns(daysBack: number) {
  const { start, end } = dateRange(daysBack);
  return runGoogleAdsQuery(`
    SELECT
      customer.currency_code,
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign.bidding_strategy_type,
      segments.date,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.conversions_value,
      metrics.ctr,
      metrics.average_cpc,
      metrics.cost_per_conversion,
      metrics.search_impression_share
    FROM campaign
    WHERE segments.date BETWEEN '${start}' AND '${end}'
      AND campaign.status != 'REMOVED'
    ORDER BY segments.date DESC
  `);
}

export async function fetchGoogleAdsAdGroups(daysBack: number) {
  const { start, end } = dateRange(daysBack);
  return runGoogleAdsQuery(`
    SELECT
      campaign.id,
      campaign.name,
      ad_group.id,
      ad_group.name,
      ad_group.status,
      segments.date,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.conversions_value,
      metrics.ctr,
      metrics.average_cpc
    FROM ad_group
    WHERE segments.date BETWEEN '${start}' AND '${end}'
      AND campaign.status != 'REMOVED'
      AND ad_group.status != 'REMOVED'
    ORDER BY segments.date DESC
  `);
}

export async function fetchGoogleAdsSearchTerms(daysBack: number) {
  const { start, end } = dateRange(daysBack);
  return runGoogleAdsQuery(`
    SELECT
      campaign.id,
      campaign.name,
      ad_group.id,
      ad_group.name,
      search_term_view.search_term,
      segments.keyword.info.text,
      segments.keyword.info.match_type,
      segments.date,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM search_term_view
    WHERE segments.date BETWEEN '${start}' AND '${end}'
      AND campaign.status != 'REMOVED'
      AND ad_group.status != 'REMOVED'
    ORDER BY metrics.cost_micros DESC
  `);
}

export async function fetchGoogleAdsConversions(daysBack: number) {
  const { start, end } = dateRange(daysBack);
  return runGoogleAdsQuery(`
    SELECT
      campaign.id,
      campaign.name,
      segments.date,
      segments.conversion_action,
      segments.conversion_action_name,
      metrics.conversions,
      metrics.conversions_value,
      metrics.all_conversions
    FROM campaign
    WHERE segments.date BETWEEN '${start}' AND '${end}'
      AND campaign.status != 'REMOVED'
      AND metrics.all_conversions > 0
    ORDER BY segments.date DESC
  `);
}

export function configuredGoogleAdsCustomerId(): string {
  return config().customerId;
}
