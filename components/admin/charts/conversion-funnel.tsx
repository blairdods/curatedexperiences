"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface FunnelStage {
  stage: string;
  count: number;
}

const STAGE_COLORS: Record<string, string> = {
  new: "#3b82f6",
  nurturing: "#f59e0b",
  proposal_sent: "#8b5cf6",
  deposit: "#10b981",
  confirmed: "#22c55e",
  closed_won: "#16a34a",
  closed_lost: "#9ca3af",
};

export function ConversionFunnel({ data }: { data: FunnelStage[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: d.stage.replace(/_/g, " "),
  }));

  if (formatted.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-foreground-muted">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={formatted} layout="vertical">
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#6b6560" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <YAxis
          dataKey="label"
          type="category"
          tick={{ fontSize: 11, fill: "#6b6560" }}
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e8ddd6",
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Leads">
          {formatted.map((entry) => (
            <Cell
              key={entry.stage}
              fill={STAGE_COLORS[entry.stage] ?? "#1F3864"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
