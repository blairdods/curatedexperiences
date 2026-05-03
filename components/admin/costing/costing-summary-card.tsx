"use client";

import type { CostingSummary } from "@/lib/costing/types";

interface Props {
  summary: CostingSummary;
  fxRate: number;
  pax: number | null;
}

export function CostingSummaryCard({ summary, fxRate, pax }: Props) {
  const rate = fxRate || 0;
  const showUsd = rate > 0;
  const showPerPerson = pax && pax > 0;

  return (
    <div className="bg-navy/5 rounded-xl p-5 border border-navy/10">
      <h2 className="text-xs tracking-widest uppercase text-navy/70 mb-4">
        Costing Summary
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-foreground-muted">Total Net (NZD)</span>
          <span className="text-sm font-mono font-medium">
            ${summary.total_net_nzd.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-sm text-foreground-muted">Total Gross (NZD)</span>
          <span className="text-lg font-serif text-navy font-medium">
            ${summary.total_gross_nzd.toLocaleString()}
          </span>
        </div>

        {showUsd && (
          <div className="flex justify-between items-baseline border-t border-navy/10 pt-3">
            <span className="text-sm text-foreground-muted">
              Total Gross (USD) <span className="text-xs">@{rate}</span>
            </span>
            <span className="text-lg font-serif text-navy font-medium">
              ${summary.total_gross_usd.toLocaleString()}
            </span>
          </div>
        )}

        {!showUsd && (
          <p className="text-xs text-red-500">FX rate not set — USD unavailable</p>
        )}

        {showPerPerson && (
          <>
            <div className="border-t border-navy/10 pt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-foreground-muted">Per Person (NZD)</span>
                <span className="text-sm font-mono font-medium">
                  ${summary.per_person_nzd.toLocaleString()}
                </span>
              </div>
              {showUsd && (
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-sm text-foreground-muted">Per Person (USD)</span>
                  <span className="text-sm font-mono font-medium">
                    ${summary.per_person_usd.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        <div className="border-t border-navy/10 pt-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-foreground-muted">Effective Margin</span>
            <span className="text-sm font-medium text-navy">
              {summary.effective_margin_pct}%
            </span>
          </div>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-sm text-foreground-muted">Margin Amount (NZD)</span>
            <span className="text-sm font-mono">
              ${summary.total_margin_amount_nzd.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
