"use client";

import { useState, useEffect, useCallback } from "react";

interface Recommendation {
  id: string;
  recommendation: string;
  rationale: string;
  action_type: string;
  from_market: string | null;
  to_market: string | null;
  amount_usd: number | null;
  status: "pending" | "approved" | "dismissed";
  generated_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  reallocate_budget: "Reallocate",
  increase_spend: "Increase spend",
  decrease_spend: "Decrease spend",
  pause_campaign: "Pause campaign",
  other: "Recommendation",
};

const ACTION_COLOURS: Record<string, string> = {
  reallocate_budget: "bg-gold/10 text-gold border-gold/20",
  increase_spend: "bg-green-50 text-green-700 border-green-200",
  decrease_spend: "bg-amber-50 text-amber-700 border-amber-200",
  pause_campaign: "bg-red-50 text-red-700 border-red-200",
  other: "bg-stone/10 text-stone border-stone/20",
};

export function MarketingAgent() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/marketing/recommendations");
      const data = await res.json() as { recommendations: Recommendation[] };
      setRecommendations(data.recommendations ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRecommendations();
  }, [fetchRecommendations]);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/marketing/recommendations", { method: "POST" });
      const data = await res.json() as { recommendations: Recommendation[] };
      if (data.recommendations) {
        setRecommendations((prev) => [...(data.recommendations ?? []), ...prev]);
      }
    } finally {
      setGenerating(false);
    }
  };

  const act = async (id: string, status: "approved" | "dismissed") => {
    setActionLoading(id + status);
    try {
      const res = await fetch(`/api/admin/marketing/recommendations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json() as { recommendation: Recommendation };
      if (data.recommendation) {
        setRecommendations((prev) =>
          prev.map((r) => (r.id === id ? data.recommendation : r))
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  const pending = recommendations.filter((r) => r.status === "pending");
  const actioned = recommendations.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Analyses your lead data by market and suggests budget changes. Each suggestion requires your approval before anything is actioned.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={generating}
          className="flex-shrink-0 ml-4 px-4 py-2 text-xs font-medium bg-navy text-cream rounded-lg hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {generating ? "Analysing…" : "Generate Recommendations"}
        </button>
      </div>

      {loading && (
        <p className="text-xs text-foreground-muted">Loading…</p>
      )}

      {!loading && pending.length === 0 && actioned.length === 0 && (
        <p className="text-xs text-foreground-muted py-4 text-center">
          No recommendations yet — click Generate to analyse your current data.
        </p>
      )}

      {/* Pending recommendations */}
      {pending.length > 0 && (
        <div className="space-y-3">
          {pending.map((rec) => (
            <div
              key={rec.id}
              className="rounded-xl border border-warm-200 bg-warm-50 p-4"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex-shrink-0 mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${ACTION_COLOURS[rec.action_type] ?? ACTION_COLOURS.other}`}
                >
                  {ACTION_LABELS[rec.action_type] ?? "Recommendation"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy leading-snug">
                    {rec.recommendation}
                    {rec.amount_usd != null && (
                      <span className="ml-1 text-gold font-semibold">
                        ${rec.amount_usd.toLocaleString()}
                      </span>
                    )}
                  </p>
                  {rec.from_market && rec.to_market && (
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {rec.from_market} → {rec.to_market}
                    </p>
                  )}
                  <p className="text-xs text-foreground-muted mt-1.5 leading-relaxed">
                    {rec.rationale}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pl-0">
                <button
                  onClick={() => act(rec.id, "approved")}
                  disabled={actionLoading != null}
                  className="px-3 py-1.5 text-xs font-medium bg-navy text-cream rounded-lg hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading === rec.id + "approved" ? "…" : "Approve"}
                </button>
                <button
                  onClick={() => act(rec.id, "dismissed")}
                  disabled={actionLoading != null}
                  className="px-3 py-1.5 text-xs text-foreground-muted hover:text-navy transition-colors disabled:opacity-50"
                >
                  {actionLoading === rec.id + "dismissed" ? "…" : "Dismiss"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actioned history */}
      {actioned.length > 0 && (
        <div className="mt-2">
          <p className="text-[10px] uppercase tracking-widest text-foreground-muted mb-2">Previous</p>
          <div className="space-y-2">
            {actioned.slice(0, 5).map((rec) => (
              <div
                key={rec.id}
                className="flex items-center gap-3 py-2 border-b border-warm-100 last:border-0"
              >
                <span className={`text-[10px] ${rec.status === "approved" ? "text-green-600" : "text-foreground-muted"}`}>
                  {rec.status === "approved" ? "✓ Approved" : "Dismissed"}
                </span>
                <p className="text-xs text-foreground-muted flex-1 truncate">{rec.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
