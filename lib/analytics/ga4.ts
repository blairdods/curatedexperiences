import { GoogleAuth } from "google-auth-library";
import { createServiceClient } from "@/lib/supabase/server";

// ---- Config ----

interface GoogleServiceAccount {
  client_email?: string;
  private_key?: string;
}

function getServiceAccountFromJson(): GoogleServiceAccount {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return {};

  try {
    return JSON.parse(raw) as GoogleServiceAccount;
  } catch {
    console.warn("[ga4] GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON");
    return {};
  }
}

const serviceAccount = getServiceAccountFromJson();
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "";
const GA4_CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL || serviceAccount.client_email || "";
const GA4_PRIVATE_KEY = process.env.GA4_PRIVATE_KEY || serviceAccount.private_key || "";

function isConfigured(): boolean {
  return !!(GA4_PROPERTY_ID && GA4_CLIENT_EMAIL && GA4_PRIVATE_KEY);
}

// ---- Auth (Google service account JWT → access token) ----

let _accessToken: string | null = null;
let _tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (_accessToken && Date.now() < _tokenExpiry - 60000) return _accessToken;

  const credentials = {
    client_email: GA4_CLIENT_EMAIL,
    private_key: GA4_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };

  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  _accessToken = token?.token ?? null;
  _tokenExpiry = token?.res?.data?.expiry_date ?? Date.now() + 3600000;

  if (!_accessToken) throw new Error("Failed to obtain GA4 access token");
  return _accessToken;
}

// ---- GA4 Data API (REST, no gRPC) ----

const API_BASE = "https://analyticsdata.googleapis.com/v1beta";

async function runReport(requestBody: Record<string, unknown>): Promise<Record<string, unknown>> {
  const token = await getAccessToken();
  const url = `${API_BASE}/properties/${GA4_PROPERTY_ID}:runReport`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`GA4 API error ${res.status}: ${errBody}`);
  }

  return res.json();
}

// ---- Types ----

export interface TrafficRow {
  date: string;
  source: string;
  medium: string;
  campaign: string;
  users: number;
  newUsers: number;
  sessions: number;
  engagedSessions: number;
  averageSessionDuration: number;
  engagementRate: number;
  bounceRate: number;
}

// ---- Fetch functions ----

export async function fetchDailyTraffic(daysBack: number = 7): Promise<TrafficRow[]> {
  if (!isConfigured()) return [];

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysBack + 1);
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const response = await runReport({
    dateRanges: [{ startDate: fmt(startDate), endDate: fmt(today) }],
    dimensions: [
      { name: "date" },
      { name: "sessionSource" },
      { name: "sessionMedium" },
      { name: "sessionCampaignName" },
    ],
    metrics: [
      { name: "totalUsers" },
      { name: "newUsers" },
      { name: "sessions" },
      { name: "engagedSessions" },
      { name: "averageSessionDuration" },
      { name: "engagementRate" },
      { name: "bounceRate" },
    ],
    keepEmptyRows: false,
  });

  const rows = response.rows as Array<Record<string, unknown>> | undefined;
  if (!rows) return [];

  return rows.map((row: Record<string, unknown>) => {
    const dims = (row.dimensionValues as Array<Record<string, string>>).map((d) => d.value ?? "");
    const vals = (row.metricValues as Array<Record<string, string>>).map((m) => parseFloat(m.value ?? "0"));
    return {
      date: dims[0],
      source: dims[1],
      medium: dims[2],
      campaign: dims[3],
      users: vals[0],
      newUsers: vals[1],
      sessions: vals[2],
      engagedSessions: vals[3],
      averageSessionDuration: vals[4],
      engagementRate: vals[5],
      bounceRate: vals[6],
    };
  });
}

export async function fetchConversions(
  daysBack: number = 7
): Promise<{ date: string; eventName: string; eventCount: number; uniqueUsers: number }[]> {
  if (!isConfigured()) return [];

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysBack + 1);
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const response = await runReport({
    dateRanges: [{ startDate: fmt(startDate), endDate: fmt(today) }],
    dimensions: [{ name: "date" }, { name: "eventName" }],
    metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        inListFilter: {
          values: ["form_submit", "booking_enquiry", "concierge_started", "page_view", "enquiry_submit"],
        },
      },
    },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 50,
  });

  const rows = response.rows as Array<Record<string, unknown>> | undefined;
  if (!rows) return [];

  return rows.map((row: Record<string, unknown>) => ({
    date: (row.dimensionValues as Array<Record<string, string>>)[0].value ?? "",
    eventName: (row.dimensionValues as Array<Record<string, string>>)[1].value ?? "",
    eventCount: parseInt((row.metricValues as Array<Record<string, string>>)[0].value ?? "0"),
    uniqueUsers: parseInt((row.metricValues as Array<Record<string, string>>)[1].value ?? "0"),
  }));
}

// ---- Persist to Supabase ----

export async function persistTraffic(rows: TrafficRow[]): Promise<void> {
  if (rows.length === 0) return;
  const supabase = await createServiceClient();

  for (const row of rows) {
    const { error } = await supabase.from("ga4_daily_metrics").upsert(
      {
        date: row.date,
        source: row.source || "direct",
        medium: row.medium || "(none)",
        campaign: row.campaign || "(not set)",
        users: row.users,
        new_users: row.newUsers,
        sessions: row.sessions,
        engaged_sessions: row.engagedSessions,
        engagement_rate: parseFloat((row.engagementRate * 100).toFixed(1)),
        bounce_rate: parseFloat((row.bounceRate * 100).toFixed(1)),
        avg_session_duration_seconds: parseFloat(row.averageSessionDuration.toFixed(1)),
      },
      { onConflict: "date, source, medium, campaign", ignoreDuplicates: false }
    );

    if (error) {
      console.error(`[ga4] upsert traffic ${row.date} ${row.source}: ${error.message}`);
    }
  }
}

export async function persistConversions(
  rows: { date: string; eventName: string; eventCount: number; uniqueUsers: number }[]
): Promise<void> {
  if (rows.length === 0) return;
  const supabase = await createServiceClient();

  for (const row of rows) {
    const { error } = await supabase.from("ga4_event_goals").upsert(
      {
        date: row.date,
        event_name: row.eventName,
        event_count: row.eventCount,
        unique_users: row.uniqueUsers,
      },
      { onConflict: "date, event_name", ignoreDuplicates: false }
    );

    if (error) {
      console.error(`[ga4] upsert event ${row.date} ${row.eventName}: ${error.message}`);
    }
  }
}

// ---- Table check ----

async function ensureTables(): Promise<string | null> {
  const supabase = await createServiceClient();
  const { error } = await supabase.from("ga4_daily_metrics").select("id").limit(1);
  if (error?.message?.includes("does not exist")) {
    return (
      "ga4_daily_metrics table does not exist. Run the migration SQL from supabase/migrations/00020_ga4_analytics.sql " +
      "in the Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/bwpbvdmdwjqguiliymnq/sql/new)."
    );
  }
  return null;
}

// ---- Sync all ----

export async function syncAll(daysBack: number = 7): Promise<{
  status: string;
  trafficRows?: number;
  conversionRows?: number;
  error?: string;
  configNote?: string;
  migrationNote?: string;
}> {
  if (!isConfigured()) {
    return {
      status: "skipped",
      configNote: "GA4 not configured. Set GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, and GA4_PRIVATE_KEY in env.",
    };
  }

  const migrationNote = await ensureTables();
  if (migrationNote) {
    return { status: "skipped", migrationNote };
  }

  try {
    const [traffic, conversions] = await Promise.all([
      fetchDailyTraffic(daysBack),
      fetchConversions(daysBack),
    ]);

    await Promise.all([persistTraffic(traffic), persistConversions(conversions)]);

    return {
      status: "ok",
      trafficRows: traffic.length,
      conversionRows: conversions.length,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[ga4] sync failed:`, err);
    return { status: "error", error: message };
  }
}

// ---- Query stored data ----

export async function queryTrafficSummary(
  daysBack: number = 7
): Promise<{
  totalSessions: number;
  totalUsers: number;
  totalPageviews: number;
  avgBounceRate: number;
  bySource: { source: string; sessions: number; users: number }[];
}> {
  const supabase = await createServiceClient();
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const sinceStr = since.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("ga4_daily_metrics")
    .select("date, source, sessions, users, bounce_rate, pageviews, engagement_rate")
    .gte("date", sinceStr)
    .order("date", { ascending: false });

  if (error || !data) {
    return { totalSessions: 0, totalUsers: 0, totalPageviews: 0, avgBounceRate: 0, bySource: [] };
  }

  const totalSessions = data.reduce((s, r) => s + (r.sessions ?? 0), 0);
  const totalUsers = data.reduce((s, r) => s + (r.users ?? 0), 0);
  const totalPageviews = data.reduce((s, r) => s + (r.pageviews ?? 0), 0);
  const bounceRows = data.filter((r) => r.bounce_rate != null);
  const avgBounceRate =
    bounceRows.length > 0
      ? bounceRows.reduce((s, r) => s + r.bounce_rate!, 0) / bounceRows.length
      : 0;

  const sourceMap = new Map<string, { sessions: number; users: number }>();
  for (const row of data) {
    const key = row.source ?? "direct";
    const cur = sourceMap.get(key) ?? { sessions: 0, users: 0 };
    cur.sessions += row.sessions ?? 0;
    cur.users += row.users ?? 0;
    sourceMap.set(key, cur);
  }
  const bySource = Array.from(sourceMap.entries())
    .map(([source, vals]) => ({ source, ...vals }))
    .sort((a, b) => b.sessions - a.sessions);

  return {
    totalSessions,
    totalUsers,
    totalPageviews,
    avgBounceRate: parseFloat(avgBounceRate.toFixed(1)),
    bySource,
  };
}

export async function queryConversionSummary(
  daysBack: number = 7
): Promise<{ eventName: string; totalCount: number; uniqueUsers: number }[]> {
  const supabase = await createServiceClient();
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const sinceStr = since.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("ga4_event_goals")
    .select("event_name, event_count, unique_users")
    .gte("date", sinceStr);

  if (error || !data) return [];

  const eventMap = new Map<string, { totalCount: number; uniqueUsers: number }>();
  for (const row of data) {
    const key = row.event_name;
    const cur = eventMap.get(key) ?? { totalCount: 0, uniqueUsers: 0 };
    cur.totalCount += row.event_count ?? 0;
    cur.uniqueUsers += row.unique_users ?? 0;
    eventMap.set(key, cur);
  }

  return Array.from(eventMap.entries())
    .map(([eventName, vals]) => ({ eventName, ...vals }))
    .sort((a, b) => b.totalCount - a.totalCount);
}
