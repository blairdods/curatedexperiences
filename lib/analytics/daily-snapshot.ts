import { createServiceClient } from "@/lib/supabase/server";

interface DailySnapshot {
  date: string;
  leads: {
    total: number;
    bySource: Record<string, number>;
    hotLeads: number;
    avgIntent: number;
    statusTransitions: {
      toProposalSent: number;
      toDeposit: number;
      toConfirmed: number;
      toClosedWon: number;
    };
  };
  bookings: {
    total: number;
    totalValueUsd: number;
  };
  agents: {
    spendLast24h: number;
    mtdSpend: number;
  };
}

interface Anomaly {
  metric: string;
  value: number | string;
  baseline: number | string;
  deviation: string;
  severity: "info" | "warning" | "critical";
  detail: string;
}

function fmtDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

export async function generateDailySnapshot(): Promise<{
  snapshot: DailySnapshot;
  anomalies: Anomaly[];
}> {
  const supabase = await createServiceClient();
  const anomalies: Anomaly[] = [];
  const now = new Date();
  const today = fmtDate(now);
  const last24h = hoursAgo(24);
  const last7d = hoursAgo(24 * 7);

  const { data: last24Leads, error: leads24Err } = await supabase
    .from("enquiries")
    .select("id, source, intent_score, status, last_contact_at, created_at")
    .gte("created_at", last24h);

  if (leads24Err) throw new Error(`leads 24h query: ${leads24Err.message}`);
  const leads24 = last24Leads ?? [];

  const bySource: Record<string, number> = {};
  let hotLeads = 0;
  let intentSum = 0;
  let intentCount = 0;
  for (const lead of leads24) {
    const src = lead.source || "unknown";
    bySource[src] = (bySource[src] || 0) + 1;
    if ((lead.intent_score ?? 0) >= 7) hotLeads++;
    if (lead.intent_score != null) {
      intentSum += lead.intent_score;
      intentCount++;
    }
  }

  const { data: statusChanges, error: statusErr } = await supabase
    .from("lead_activities")
    .select("metadata")
    .eq("type", "status_change")
    .gte("created_at", last24h);

  if (statusErr) throw new Error(`status change query: ${statusErr.message}`);

  let toProposalSent = 0;
  let toDeposit = 0;
  let toConfirmed = 0;
  let toClosedWon = 0;

  for (const act of statusChanges ?? []) {
    const to = act.metadata?.to ?? "";
    if (to === "proposal_sent") toProposalSent++;
    if (to === "deposit") toDeposit++;
    if (to === "confirmed") toConfirmed++;
    if (to === "closed_won") toClosedWon++;
  }

  const avgIntent = intentCount > 0 ? parseFloat((intentSum / intentCount).toFixed(1)) : 0;

  const { data: last7Leads, error: leads7Err } = await supabase
    .from("enquiries")
    .select("id, source, intent_score, status, created_at")
    .gte("created_at", last7d)
    .lt("created_at", last24h);

  if (leads7Err) throw new Error(`leads 7d query: ${leads7Err.message}`);
  const leads7 = last7Leads ?? [];

  const leads7Days = leads7.length > 0 ? Math.max(Math.ceil(leads7.length / 6), 1) : 1;
  const leads7DailyAvg = parseFloat((leads7.length / leads7Days).toFixed(1));
  const leads24Count = leads24.length;

  const leadsPercentDiff =
    leads7DailyAvg > 0
      ? ((leads24Count - leads7DailyAvg) / leads7DailyAvg) * 100
      : 0;

  if (Math.abs(leadsPercentDiff) > 30) {
    anomalies.push({
      metric: "new_leads",
      value: leads24Count,
      baseline: leads7DailyAvg,
      deviation: `${leadsPercentDiff > 0 ? "+" : ""}${leadsPercentDiff.toFixed(0)}%`,
      severity: Math.abs(leadsPercentDiff) > 50 ? "critical" : "warning",
      detail: `New leads in last 24h: ${leads24Count} vs 7-day avg ${leads7DailyAvg}/day (${leadsPercentDiff > 0 ? "+" : ""}${leadsPercentDiff.toFixed(0)}%)`,
    });
  }

  const intent7Sum = leads7.reduce((s, l) => s + (l.intent_score ?? 0), 0);
  const intent7Count = leads7.filter((l) => l.intent_score != null).length;
  const avgIntent7 = intent7Count > 0 ? intent7Sum / intent7Count : 0;

  if (intentCount > 0 && intent7Count > 0 && Math.abs(avgIntent - avgIntent7) > 1.5) {
    anomalies.push({
      metric: "avg_intent_score",
      value: avgIntent,
      baseline: parseFloat(avgIntent7.toFixed(1)),
      deviation: `${(avgIntent - avgIntent7) > 0 ? "+" : ""}${(avgIntent - avgIntent7).toFixed(1)} pts`,
      severity: "warning",
      detail: `Average intent score shifted from ${avgIntent7.toFixed(1)} to ${avgIntent} (${(avgIntent - avgIntent7) > 0 ? "+" : ""}${(avgIntent - avgIntent7).toFixed(1)} pts)`,
    });
  }

  const { data: statusChanges7d, error: status7Err } = await supabase
    .from("lead_activities")
    .select("metadata")
    .eq("type", "status_change")
    .gte("created_at", last7d)
    .lt("created_at", last24h);

  if (status7Err) throw new Error(`status change 7d query: ${status7Err.message}`);

  const proposals24Count = statusChanges?.filter((a) => a.metadata?.to === "proposal_sent").length ?? 0;
  const proposals7Count = (statusChanges7d ?? []).filter((a) => a.metadata?.to === "proposal_sent").length;
  const proposals7Days = statusChanges7d && statusChanges7d.length > 0 ? Math.max(Math.ceil((statusChanges7d ?? []).length / 6), 1) : 1;
  const proposals7DailyAvg = proposals7Count / proposals7Days;

  if (proposals7DailyAvg > 0 && Math.abs(proposals24Count - proposals7DailyAvg) / proposals7DailyAvg * 100 > 20) {
    const deviationPct = ((proposals24Count - proposals7DailyAvg) / proposals7DailyAvg * 100);
    anomalies.push({
      metric: "lead_to_proposal_conversion",
      value: proposals24Count,
      baseline: parseFloat(proposals7DailyAvg.toFixed(1)),
      deviation: `${deviationPct > 0 ? "+" : ""}${deviationPct.toFixed(0)}%`,
      severity: "warning",
      detail: `Proposal conversions: ${proposals24Count} in last 24h vs 7-day avg ${proposals7DailyAvg.toFixed(1)}/day (${deviationPct > 0 ? "+" : ""}${deviationPct.toFixed(0)}%)`,
    });
  }

  const { data: last24Bookings, error: bookings24Err } = await supabase
    .from("bookings")
    .select("id, total_value_usd, status, created_at")
    .gte("created_at", last24h);

  if (bookings24Err) throw new Error(`bookings 24h query: ${bookings24Err.message}`);
  const bookings24 = last24Bookings ?? [];
  const bookingValueSum = bookings24.reduce((s, b) => s + (b.total_value_usd ?? 0), 0);

  const { data: agentSpend24, error: spend24Err } = await supabase
    .from("agent_outputs")
    .select("cost_usd")
    .gte("created_at", last24h);

  if (spend24Err) throw new Error(`agent spend 24h query: ${spend24Err.message}`);
  const spend24Sum = (agentSpend24 ?? []).reduce((s, r) => s + (r.cost_usd ?? 0), 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data: mtdSpendData, error: mtdSpendErr } = await supabase
    .from("agent_outputs")
    .select("agent_name, cost_usd")
    .gte("created_at", monthStart);

  if (mtdSpendErr) throw new Error(`mtd spend query: ${mtdSpendErr.message}`);
  const mtdRows = mtdSpendData ?? [];

  const mtdByAgent: Record<string, number> = {};
  let mtdTotal = 0;
  for (const r of mtdRows) {
    const cost = r.cost_usd ?? 0;
    mtdTotal += cost;
    if (r.agent_name) {
      mtdByAgent[r.agent_name] = (mtdByAgent[r.agent_name] || 0) + cost;
    }
  }

  const snapshot: DailySnapshot = {
    date: today,
    leads: {
      total: leads24Count,
      bySource,
      hotLeads,
      avgIntent,
      statusTransitions: {
        toProposalSent,
        toDeposit,
        toConfirmed,
        toClosedWon,
      },
    },
    bookings: {
      total: bookings24.length,
      totalValueUsd: parseFloat(bookingValueSum.toFixed(2)),
    },
    agents: {
      spendLast24h: parseFloat(spend24Sum.toFixed(2)),
      mtdSpend: parseFloat(mtdTotal.toFixed(2)),
    },
  };

  return { snapshot, anomalies };
}

export async function saveSnapshot(snapshot: DailySnapshot): Promise<void> {
  const supabase = await createServiceClient();
  const { error } = await supabase.from("agent_outputs").insert({
    agent_name: "analytics",
    output_type: "daily_snapshot",
    content: JSON.stringify(snapshot, null, 2),
    status: "pending",
  });
  if (error) throw new Error(`save snapshot: ${error.message}`);
}

export async function saveAnomalyAlert(anomalies: Anomaly[]): Promise<void> {
  const supabase = await createServiceClient();
  const { error } = await supabase.from("agent_outputs").insert({
    agent_name: "analytics",
    output_type: "anomaly_alert",
    content: JSON.stringify(anomalies, null, 2),
    status: "pending",
  });
  if (error) throw new Error(`save anomaly alert: ${error.message}`);
}

export async function runDailySnapshot(): Promise<{
  snapshotSaved: boolean;
  anomaliesDetected: boolean;
  anomalyCount: number;
  error?: string;
}> {
  try {
    const { snapshot, anomalies } = await generateDailySnapshot();

    await saveSnapshot(snapshot);

    if (anomalies.length > 0) {
      await saveAnomalyAlert(anomalies);
    }

    return {
      snapshotSaved: true,
      anomaliesDetected: anomalies.length > 0,
      anomalyCount: anomalies.length,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[daily-snapshot] failed: ${message}`);
    return { snapshotSaved: false, anomaliesDetected: false, anomalyCount: 0, error: message };
  }
}
