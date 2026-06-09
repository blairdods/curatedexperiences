import { GoogleAuth } from "google-auth-library";
import { createServiceClient } from "@/lib/supabase/server";

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
    console.warn("[search-console] GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON");
    return {};
  }
}

const serviceAccount = getServiceAccountFromJson();
const GSC_SITE_URL = process.env.GSC_SITE_URL || "";
const GSC_CLIENT_EMAIL = process.env.GSC_CLIENT_EMAIL || serviceAccount.client_email || "";
const GSC_PRIVATE_KEY = process.env.GSC_PRIVATE_KEY || serviceAccount.private_key || "";

const TARGET_QUERIES = [
  "luxury new zealand travel",
  "bespoke new zealand tours",
  "new zealand luxury holiday",
  "fiordland luxury lodge",
  "new zealand wine tour",
  "curated experiences new zealand",
];

const QUERY_REGEX = TARGET_QUERIES.map((q) =>
  q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
).join("|");

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

function isConfigured(): boolean {
  return !!(GSC_SITE_URL && GSC_CLIENT_EMAIL && GSC_PRIVATE_KEY);
}

async function getAccessToken(): Promise<string> {
  const auth = new GoogleAuth({
    credentials: {
      client_email: GSC_CLIENT_EMAIL,
      private_key: GSC_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: [SCOPE],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token || "";
}

export interface SearchAnalyticsRow {
  query: string;
  page: string;
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
}

async function callSearchAnalytics(body: Record<string, unknown>): Promise<SearchAnalyticsRow[]> {
  const token = await getAccessToken();

  const response = await fetch(
    `https://searchconsole.googleapis.com/v1/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Search Console API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  if (!data.rows) return [];

  return data.rows.map((row: { keys: string[]; impressions: number; clicks: number; ctr: number; position: number }) => ({
    query: row.keys[0] ?? "",
    page: row.keys[1] ?? "",
    date: row.keys[2] ?? "",
    impressions: row.impressions ?? 0,
    clicks: row.clicks ?? 0,
    ctr: row.ctr ?? 0,
    avgPosition: row.position ?? 0,
  }));
}

export async function fetchDailyByQuery(daysBack: number = 7): Promise<SearchAnalyticsRow[]> {
  if (!isConfigured()) return [];

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysBack + 1);
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  return callSearchAnalytics({
    startDate: fmt(startDate),
    endDate: fmt(today),
    dimensions: ["query", "page", "date"],
    dimensionFilterGroups: [
      {
        filters: [
          {
            dimension: "query",
            operator: "includingRegex",
            expression: QUERY_REGEX,
          },
        ],
      },
    ],
    rowLimit: 25000,
  });
}

export async function fetchQuerySummary(daysBack: number = 7): Promise<SearchAnalyticsRow[]> {
  if (!isConfigured()) return [];

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysBack + 1);
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const rows = await callSearchAnalytics({
    startDate: fmt(startDate),
    endDate: fmt(today),
    dimensions: ["query"],
    dimensionFilterGroups: [
      {
        filters: [
          {
            dimension: "query",
            operator: "includingRegex",
            expression: QUERY_REGEX,
          },
        ],
      },
    ],
    rowLimit: 100,
  });

  return rows.map((r) => ({ ...r, page: "(overall)", date: "" }));
}

export async function persistRows(rows: SearchAnalyticsRow[]): Promise<void> {
  if (rows.length === 0) return;

  const supabase = await createServiceClient();

  for (const row of rows) {
    const { error } = await supabase.from("search_console_metrics").upsert(
      {
        date: row.date,
        query: row.query,
        page: row.page,
        impressions: row.impressions,
        clicks: row.clicks,
        ctr: parseFloat((row.ctr * 100).toFixed(1)),
        avg_position: parseFloat(row.avgPosition.toFixed(1)),
      },
      {
        onConflict: "date, query, page",
        ignoreDuplicates: false,
      }
    );

    if (error) {
      console.error(`[gsc] upsert error: ${error.message} (date=${row.date} query=${row.query} page=${row.page})`);
    }
  }
}

async function ensureTables(): Promise<string | null> {
  const supabase = await createServiceClient();
  const { error } = await supabase.from("search_console_metrics").select("id").limit(1);
  if (error?.message?.includes("does not exist")) {
    return "search_console_metrics table does not exist. Run the migration SQL from supabase/migrations/00020_ga4_analytics.sql.";
  }
  return null;
}

export async function syncAll(daysBack: number = 7): Promise<{
  status: string;
  dailyRows?: number;
  summaryRows?: number;
  error?: string;
  configNote?: string;
  migrationNote?: string;
}> {
  if (!isConfigured()) {
    return {
      status: "skipped",
      configNote: "Search Console not configured. Set GSC_SITE_URL, GSC_CLIENT_EMAIL, and GSC_PRIVATE_KEY in env.",
    };
  }

  const migrationNote = await ensureTables();
  if (migrationNote) {
    return { status: "skipped", migrationNote };
  }

  try {
    const [daily, summary] = await Promise.all([
      fetchDailyByQuery(daysBack),
      fetchQuerySummary(daysBack),
    ]);

    await Promise.all([
      persistRows(daily),
      persistRows(summary),
    ]);

    return {
      status: "ok",
      dailyRows: daily.length,
      summaryRows: summary.length,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[gsc] sync failed: ${message}`);
    return { status: "error", error: message };
  }
}

export async function queryTargetQueryPerformance(
  daysBack: number = 7
): Promise<{ query: string; impressions: number; clicks: number; ctr: number; avgPosition: number }[]> {
  const supabase = await createServiceClient();
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const sinceStr = since.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("search_console_metrics")
    .select("query, impressions, clicks, ctr, avg_position")
    .eq("page", "(overall)")
    .gte("date", sinceStr);

  if (error || !data) return [];

  const map = new Map<string, { impressions: number; clicks: number; ctrs: number[]; positions: number[] }>();
  for (const row of data) {
    const cur = map.get(row.query) ?? { impressions: 0, clicks: 0, ctrs: [], positions: [] };
    cur.impressions += row.impressions ?? 0;
    cur.clicks += row.clicks ?? 0;
    if (row.ctr != null) cur.ctrs.push(row.ctr);
    if (row.avg_position != null) cur.positions.push(row.avg_position);
    map.set(row.query, cur);
  }

  return Array.from(map.entries())
    .map(([query, vals]) => ({
      query,
      impressions: vals.impressions,
      clicks: vals.clicks,
      ctr: vals.ctrs.length > 0 ? parseFloat((vals.ctrs.reduce((a, b) => a + b, 0) / vals.ctrs.length).toFixed(1)) : 0,
      avgPosition: vals.positions.length > 0
        ? parseFloat((vals.positions.reduce((a, b) => a + b, 0) / vals.positions.length).toFixed(1))
        : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions);
}

export async function queryTopPages(
  daysBack: number = 7
): Promise<{ page: string; query: string; impressions: number; clicks: number }[]> {
  const supabase = await createServiceClient();
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const sinceStr = since.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("search_console_metrics")
    .select("page, query, impressions, clicks")
    .neq("page", "(overall)")
    .neq("page", "")
    .gte("date", sinceStr)
    .order("impressions", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data;
}

export async function queryDailyTrend(
  daysBack: number = 7
): Promise<{ date: string; impressions: number; clicks: number; ctr: number; avgPosition: number }[]> {
  const supabase = await createServiceClient();
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const sinceStr = since.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("search_console_metrics")
    .select("date, impressions, clicks, ctr, avg_position")
    .eq("page", "(overall)")
    .gte("date", sinceStr)
    .order("date", { ascending: true });

  if (error || !data) return [];

  const map = new Map<string, { impressions: number; clicks: number; ctrs: number[]; positions: number[] }>();
  for (const row of data) {
    const cur = map.get(row.date) ?? { impressions: 0, clicks: 0, ctrs: [], positions: [] };
    cur.impressions += row.impressions ?? 0;
    cur.clicks += row.clicks ?? 0;
    if (row.ctr != null) cur.ctrs.push(row.ctr);
    if (row.avg_position != null) cur.positions.push(row.avg_position);
    map.set(row.date, cur);
  }

  return Array.from(map.entries())
    .map(([date, vals]) => ({
      date,
      impressions: vals.impressions,
      clicks: vals.clicks,
      ctr: vals.ctrs.length > 0 ? parseFloat((vals.ctrs.reduce((a, b) => a + b, 0) / vals.ctrs.length).toFixed(1)) : 0,
      avgPosition: vals.positions.length > 0
        ? parseFloat((vals.positions.reduce((a, b) => a + b, 0) / vals.positions.length).toFixed(1))
        : 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
