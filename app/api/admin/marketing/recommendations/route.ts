import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const serviceSupabase = await createServiceClient();
  const { data, error } = await serviceSupabase
    .from("marketing_recommendations")
    .select("*")
    .order("generated_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ recommendations: data ?? [] });
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getUserRole(user.email);
  if (!role || !["admin", "curator", "analyst"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const serviceSupabase = await createServiceClient();

  // Pull current analytics data
  const [enquiriesResult, bookingsResult] = await Promise.all([
    serviceSupabase
      .from("enquiries")
      .select("status, intent_score, country, created_at, source"),
    serviceSupabase
      .from("bookings")
      .select("status, total_value_usd, deposit_paid"),
  ]);

  const leads = enquiriesResult.data ?? [];
  const bookings = bookingsResult.data ?? [];

  // Build market stats
  const sgLeads = leads.filter((l) => l.country === "SG");
  const usLeads = leads.filter((l) => l.country === "US");
  const otherLeads = leads.filter((l) => l.country && l.country !== "SG" && l.country !== "US");

  const avgIntent = (arr: typeof leads) =>
    arr.length > 0
      ? (arr.reduce((s, l) => s + (l.intent_score ?? 0), 0) / arr.length).toFixed(1)
      : "n/a";

  const hotLeads = (arr: typeof leads) => arr.filter((l) => (l.intent_score ?? 0) >= 7).length;

  const convertedLeads = (arr: typeof leads) =>
    arr.filter((l) => ["deposit", "confirmed", "closed_won"].includes(l.status ?? "")).length;

  const dataSnapshot = {
    total_leads: leads.length,
    singapore: {
      leads: sgLeads.length,
      hot_leads: hotLeads(sgLeads),
      avg_intent: avgIntent(sgLeads),
      converted: convertedLeads(sgLeads),
      conversion_rate: sgLeads.length > 0
        ? ((convertedLeads(sgLeads) / sgLeads.length) * 100).toFixed(1) + "%"
        : "0%",
    },
    united_states: {
      leads: usLeads.length,
      hot_leads: hotLeads(usLeads),
      avg_intent: avgIntent(usLeads),
      converted: convertedLeads(usLeads),
      conversion_rate: usLeads.length > 0
        ? ((convertedLeads(usLeads) / usLeads.length) * 100).toFixed(1) + "%"
        : "0%",
    },
    other: {
      leads: otherLeads.length,
    },
    total_bookings: bookings.length,
    deposits_paid: bookings.filter((b) => b.deposit_paid).length,
    total_pipeline_usd: bookings.reduce((s, b) => s + Number(b.total_value_usd ?? 0), 0),
    lead_sources: leads.reduce((acc: Record<string, number>, l) => {
      const src = l.source ?? "unknown";
      acc[src] = (acc[src] ?? 0) + 1;
      return acc;
    }, {}),
  };

  const dataContext = JSON.stringify(dataSnapshot, null, 2);

  const prompt = `You are a marketing optimization agent for Curated Experiences, a luxury New Zealand travel company targeting high-net-worth individuals in Singapore and the United States. The business is pre-launch with an initial marketing budget of approximately NZD $2,500/month split across both markets.

Current analytics snapshot:
${dataContext}

Based on this data, generate 2-4 specific, actionable budget and campaign recommendations. Each recommendation should:
- Be specific and data-driven (cite numbers from the data where possible)
- Be realistic given this is an early-stage business with limited budget
- Account for the Singapore-first strategy (Singapore is the primary test market)
- Focus on the highest-impact changes

Return a JSON array with this exact structure:
[
  {
    "recommendation": "Short action statement (max 20 words)",
    "rationale": "1-2 sentence explanation citing specific data points from the snapshot",
    "action_type": "reallocate_budget|increase_spend|decrease_spend|pause_campaign|other",
    "from_market": "market name or null",
    "to_market": "market name or null",
    "amount_usd": number or null
  }
]

Return ONLY valid JSON. No markdown, no preamble, no explanation outside the array.`;

  let parsed: Array<{
    recommendation: string;
    rationale: string;
    action_type: string;
    from_market: string | null;
    to_market: string | null;
    amount_usd: number | null;
  }>;

  try {
    const anthropic = getAnthropic();
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { type: "text"; text: string }).text)
      .join("");

    parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Not an array");
  } catch {
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }

  // Save to DB
  const rows = parsed.map((r) => ({
    recommendation: r.recommendation,
    rationale: r.rationale,
    action_type: r.action_type,
    from_market: r.from_market ?? null,
    to_market: r.to_market ?? null,
    amount_usd: r.amount_usd ?? null,
    status: "pending",
    data_snapshot: dataSnapshot,
  }));

  const { data: inserted, error: insertError } = await serviceSupabase
    .from("marketing_recommendations")
    .insert(rows)
    .select();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ recommendations: inserted ?? [] });
}
