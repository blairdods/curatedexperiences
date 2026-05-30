import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const today = new Date().toLocaleDateString("en-NZ", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Pacific/Auckland",
  });

  // Pull data in parallel
  const [
    newLeadsResult,
    hotLeadsResult,
    allLeadsResult,
    pendingContentResult,
    bookingsResult,
    recentLeadsResult,
  ] = await Promise.all([
    supabase.from("enquiries").select("id, name, source, intent_score", { count: "exact" }).gte("created_at", since24h),
    supabase.from("enquiries").select("id, name, email, intent_score, source, status", { count: "exact" }).gte("intent_score", 7).eq("status", "new"),
    supabase.from("enquiries").select("id", { count: "exact", head: true }),
    supabase.from("content").select("id, title", { count: "exact" }).eq("status", "pending_approval"),
    supabase.from("bookings").select("id, status, total_value_usd").order("created_at", { ascending: false }).limit(5),
    supabase.from("enquiries").select("name, email, source, intent_score, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const newLeads = newLeadsResult.data ?? [];
  const hotLeads = hotLeadsResult.data ?? [];
  const totalLeads = allLeadsResult.count ?? 0;
  const pendingContent = pendingContentResult.data ?? [];
  const recentBookings = bookingsResult.data ?? [];

  // Build context for Claude
  const context = {
    date: today,
    total_leads_all_time: totalLeads,
    new_leads_last_24h: {
      count: newLeads.length,
      leads: newLeads.map((l) => ({ name: l.name ?? "Anonymous", source: l.source ?? "unknown", intent_score: l.intent_score ?? 0 })),
    },
    hot_leads_needing_contact: {
      count: hotLeads.length,
      leads: hotLeads.map((l) => ({ name: l.name ?? "Anonymous", email: l.email ?? "", source: l.source ?? "unknown", intent_score: l.intent_score })),
    },
    content_pending_approval: {
      count: pendingContent.length,
      items: pendingContent.map((c) => c.title),
    },
    active_bookings: recentBookings.filter((b) => !["completed", "cancelled"].includes(b.status ?? "")).length,
    recent_bookings: recentBookings.map((b) => ({ status: b.status, value_usd: b.total_value_usd })),
  };

  const prompt = `You are generating the CEO Daily Brief for Curated Experiences, a luxury New Zealand travel company. Today is ${today}.

Here is the current data snapshot:
${JSON.stringify(context, null, 2)}

Write a concise morning brief (under 400 words) for Tony and Liam, the company founders. Cover:

1. **Overnight Activity** — new leads in the last 24 hours, their sources and intent scores
2. **Immediate Attention** — any hot leads (score 7+) still marked "new" that haven't been contacted yet
3. **Content Queue** — items pending approval (if any)
4. **Bookings** — active booking count and pipeline
5. **Today's Priorities** — 2-3 specific things that need action today, most important first

Tone: professional, warm, direct. This is a morning briefing, not a report — speak to them personally. Use markdown headings.

If there are no new leads or nothing urgent, say so briefly rather than padding.`;

  let briefContent: string;
  try {
    const anthropic = getAnthropic();
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });
    briefContent = message.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { type: "text"; text: string }).text)
      .join("");
  } catch (err) {
    console.error("CEO brief generation failed:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }

  // Save to agent_outputs
  const { error: saveError } = await supabase.from("agent_outputs").insert({
    agent_name: "ceo",
    output_type: "daily_brief",
    content: briefContent,
    status: "active",
    metadata: { context },
  });

  if (saveError) {
    console.error("Failed to save CEO brief:", saveError);
    return NextResponse.json({ error: saveError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, generated_at: new Date().toISOString() });
}
