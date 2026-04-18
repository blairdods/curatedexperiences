"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueData {
  period: string;
  total_revenue: number;
  booking_count: number;
}

export function RevenueChart({ data }: { data: RevenueData[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.period).toLocaleDateString("en-NZ", {
      month: "short",
      year: "2-digit",
    }),
    revenue: Number(d.total_revenue),
  }));

  if (formatted.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-foreground-muted">
        No revenue data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={formatted}>
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
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e8ddd6",
            fontSize: 12,
          }}
          formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
        />
        <Bar
          dataKey="revenue"
          fill="#b8860b"
          radius={[4, 4, 0, 0]}
          name="Revenue"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
