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

interface IntentBucket {
  range: string;
  count: number;
  color: string;
}

export function IntentDistribution({
  data,
}: {
  data: IntentBucket[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-foreground-muted">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis
          dataKey="range"
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
        <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Leads">
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
