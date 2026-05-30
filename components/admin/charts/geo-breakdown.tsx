"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface GeoData {
  market: string;
  count: number;
  pct: number;
}

const COLORS: Record<string, string> = {
  "Singapore": "#B8965A",
  "United States": "#0F1C2E",
  "Other": "#C8BCAD",
};

const DEFAULT_COLOR = "#C8BCAD";

export function GeoBreakdown({ data }: { data: GeoData[] }) {
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-foreground-muted">
        No geographic data yet — captures automatically from new leads
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="market"
            cx="50%"
            cy="50%"
            outerRadius={75}
            innerRadius={38}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[entry.market] ?? DEFAULT_COLOR}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} leads`, String(name)]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e8ddd6", fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
        </PieChart>
      </ResponsiveContainer>

      {/* Table */}
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.market} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[d.market] ?? DEFAULT_COLOR }}
              />
              <span className="text-foreground">{d.market}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-foreground-muted">
              <span>{d.count} leads</span>
              <span className="w-8 text-right font-medium">{d.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
