"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  period: string;
  count: number;
}

export function LeadsTrendChart({ data }: { data: DataPoint[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.period).toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "short",
    }),
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
      <AreaChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8ddd6" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#6b6560" }}
          tickLine={false}
          axisLine={{ stroke: "#e8ddd6" }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#6b6560" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e8ddd6",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#1F3864"
          fill="#1F3864"
          fillOpacity={0.1}
          strokeWidth={2}
          name="Leads"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
