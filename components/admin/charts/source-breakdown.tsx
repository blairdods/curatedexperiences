"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SourceData {
  source: string;
  count: number;
}

const COLORS = ["#1F3864", "#b8860b", "#c4b5a3", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

export function SourceBreakdown({ data }: { data: SourceData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-foreground-muted">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="source"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          paddingAngle={2}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e8ddd6",
            fontSize: 12,
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11 }}
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
