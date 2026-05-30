"use client";

import { useState } from "react";

interface MarketCPA {
  market: string;
  leads: number;
  spend: number;
}

function calcCPA(spend: number, leads: number): string {
  if (leads === 0 || spend === 0) return "—";
  return `$${Math.round(spend / leads).toLocaleString()}`;
}

export function CpaWidget({ markets }: { markets: MarketCPA[] }) {
  const [spends, setSpends] = useState<Record<string, string>>(
    Object.fromEntries(markets.map((m) => [m.market, m.spend > 0 ? m.spend.toString() : ""]))
  );

  return (
    <div className="space-y-4">
      <p className="text-xs text-foreground-muted leading-relaxed">
        Enter your ad spend per market to calculate cost per lead. Values are for reference only — not saved.
      </p>

      <div className="space-y-3">
        {markets.map((m) => {
          const spend = parseFloat(spends[m.market] ?? "0") || 0;
          const cpa = calcCPA(spend, m.leads);
          return (
            <div key={m.market} className="bg-warm-50 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-navy">{m.market}</span>
                <span className="text-xs text-foreground-muted">{m.leads} leads</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-foreground-muted">
                    NZD $
                  </span>
                  <input
                    type="number"
                    value={spends[m.market] ?? ""}
                    onChange={(e) =>
                      setSpends((s) => ({ ...s, [m.market]: e.target.value }))
                    }
                    placeholder="0"
                    min={0}
                    className="w-full pl-12 pr-3 py-1.5 text-sm border border-warm-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                </div>
                <div className="text-right min-w-[64px]">
                  <p className="text-[10px] text-foreground-muted uppercase tracking-wide">CPA</p>
                  <p className="text-base font-serif text-navy">{cpa}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {markets.length > 1 && (
        <div className="pt-2 border-t border-warm-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground-muted">Total</span>
            <span className="font-medium text-navy">
              {calcCPA(
                markets.reduce((s, m) => s + (parseFloat(spends[m.market] ?? "0") || 0), 0),
                markets.reduce((s, m) => s + m.leads, 0)
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
