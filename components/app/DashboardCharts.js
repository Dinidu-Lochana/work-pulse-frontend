"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const BRAND_BLUE = "oklch(0.546 0.215 263)";
const GRID_COLOR = "oklch(0.922 0.012 257)";
const AXIS_COLOR = "oklch(0.52 0.03 260)";

export const STATUS_COLORS = {
  draft: "oklch(0.52 0.02 260)",
  not_started: "oklch(0.52 0.02 260)",
  submitted: "oklch(0.49 0.16 255)",
  needs_correction: "oklch(0.46 0.04 260)",
  approved: "oklch(0.43 0.13 255)",
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 12,
    color: "var(--foreground)",
  },
  labelStyle: { color: "var(--muted-foreground)", marginBottom: 4 },
  cursor: { fill: "var(--dashboard-soft)" },
};

const axisTick = { fill: AXIS_COLOR, fontSize: 11 };

export function TrendChart({ data }) {
  if (!data.length) return <EmptyState />;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeDasharray="0" />
        <XAxis dataKey="week" tick={axisTick} tickLine={false} axisLine={{ stroke: GRID_COLOR }} />
        <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} width={32} />
        <Tooltip {...tooltipStyle} formatter={(value) => [value, "Tasks completed"]} />
        <Line
          type="monotone"
          dataKey="count"
          stroke={BRAND_BLUE}
          strokeWidth={2}
          dot={{ r: 4, fill: BRAND_BLUE, stroke: "var(--card)", strokeWidth: 2 }}
          activeDot={{ r: 6, stroke: "var(--card)", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function WorkloadChart({ data }) {
  if (!data.length) return <EmptyState />;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeDasharray="0" />
        <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={{ stroke: GRID_COLOR }} />
        <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} width={32} />
        <Tooltip {...tooltipStyle} formatter={(value) => [`${value}h`, "Hours"]} />
        <Bar dataKey="hours" fill={BRAND_BLUE} radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HoursByTypeChart({ data }) {
  if (!data.length) return <EmptyState />;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke={GRID_COLOR} strokeDasharray="0" />
        <XAxis type="number" allowDecimals={false} tick={axisTick} tickLine={false} axisLine={{ stroke: GRID_COLOR }} />
        <YAxis type="category" dataKey="type" tick={axisTick} tickLine={false} axisLine={false} width={92} />
        <Tooltip {...tooltipStyle} formatter={(value) => [`${value}h`, "Hours"]} />
        <Bar dataKey="hours" fill={BRAND_BLUE} radius={[0, 4, 4, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusDistributionChart({ data }) {
  if (!data.length) return <EmptyState />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeDasharray="0" />
        <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={{ stroke: GRID_COLOR }} />
        <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} width={28} />
        <Tooltip {...tooltipStyle} formatter={(value) => [value, "Team members"]} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
      Not enough data yet.
    </div>
  );
}
