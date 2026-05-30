"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface TrafficRow {
  date: string;
  sessions: number;
  users: number;
}

export function Ga4TrafficChart({ data }: { data: TrafficRow[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-foreground-muted">
        No GA4 data yet — syncs daily once GA4 is configured
      </div>
    );
  }

  const formatted = data.map((r) => ({
    ...r,
    label: new Date(r.date).toLocaleDateString("en-NZ", { day: "numeric", month: "short" }),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0F1C2E" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#0F1C2E" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#B8965A" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#B8965A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "#9a8574" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9a8574" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #e8ddd6", fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="sessions"
          stroke="#0F1C2E"
          strokeWidth={2}
          fill="url(#sessionsGrad)"
          name="Sessions"
        />
        <Area
          type="monotone"
          dataKey="users"
          stroke="#B8965A"
          strokeWidth={2}
          fill="url(#usersGrad)"
          name="Users"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
