import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Use service client for reading data (bypasses RLS)
  const serviceSupabase = await createServiceClient();

  // Fetch metrics
  const [leadsResult, hotLeadsResult, bookingsResult, contentResult] =
    await Promise.all([
      serviceSupabase
        .from("enquiries")
        .select("id", { count: "exact", head: true }),
      serviceSupabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .gte("intent_score", 7),
      serviceSupabase
        .from("bookings")
        .select("id", { count: "exact", head: true }),
      serviceSupabase
        .from("content")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_approval"),
    ]);

  const metrics = [
    { label: "Total Leads", value: leadsResult.count ?? 0 },
    { label: "Hot Leads (7+)", value: hotLeadsResult.count ?? 0 },
    { label: "Bookings", value: bookingsResult.count ?? 0 },
    { label: "Pending Approval", value: contentResult.count ?? 0 },
  ];

  // Fetch latest agent brief
  const { data: brief } = await serviceSupabase
    .from("agent_outputs")
    .select("content, created_at")
    .eq("agent_name", "ceo")
    .eq("output_type", "daily_brief")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Fetch recent leads
  const { data: recentLeads } = await serviceSupabase
    .from("enquiries")
    .select("id, name, email, source, intent_score, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy tracking-tight">
        Dashboard
      </h1>
      <p className="text-sm text-foreground-muted mt-1">
        Welcome back, {user.email}
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white rounded-xl p-5 border border-warm-200"
          >
            <p className="text-xs tracking-wide text-foreground-muted uppercase">
              {m.label}
            </p>
            <p className="text-3xl font-serif text-navy mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* CEO Brief */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            CEO Daily Brief
          </h2>
          {brief ? (
            <>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {brief.content?.slice(0, 500)}
              </p>
              <p className="text-xs text-warm-400 mt-3">
                {new Date(brief.created_at).toLocaleDateString("en-NZ", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </>
          ) : (
            <p className="text-sm text-foreground-muted">
              No brief available yet. The CEO agent will generate one daily
              once Paperclip is configured.
            </p>
          )}
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl p-6 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Recent Leads
          </h2>
          {recentLeads && recentLeads.length > 0 ? (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between py-2 border-b border-warm-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {lead.name || lead.email || "Anonymous"}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {lead.source} — {new Date(lead.created_at).toLocaleDateString("en-NZ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {lead.intent_score && lead.intent_score >= 7 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                        Hot
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-foreground-muted">
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground-muted">
              No leads yet. They&apos;ll appear here when visitors interact
              with the concierge.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
