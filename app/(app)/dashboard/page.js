"use client";

import Link from "next/link";
import {
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  FileText,
  MessageSquareText,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { RequireRole } from "@/components/app/RequireRole";
import {
  HoursByTypeChart,
  StatusDistributionChart,
  STATUS_COLORS,
  TrendChart,
  WorkloadChart,
} from "@/components/app/DashboardCharts";
import { StatTile } from "@/components/app/StatTile";
import { Alert } from "@/components/ui/Alert";
import { PageLoader } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { computeDashboardMetrics } from "@/lib/dashboard-metrics";
import { getMonday, toISODate } from "@/lib/dates";
import { statusLabel } from "@/lib/status";

const STATUS_ORDER = ["not_started", "submitted", "needs_correction", "approved"];
const STATUS_LABELS_MANAGER = {
  not_started: "Not started",
  submitted: statusLabel("submitted"),
  needs_correction: statusLabel("needs_correction"),
  approved: statusLabel("approved"),
};

function ACTIVITY_TEXT(event) {
  if (event.type === "submitted") return `${event.user} submitted a report`;
  if (event.type === "approved") return `${event.reviewer || "A manager"} approved ${event.user}'s report`;
  return `${event.reviewer || "A manager"} requested changes on ${event.user}'s report`;
}

function ACTIVITY_ICON(type) {
  if (type === "approved") return CheckCircle2;
  if (type === "requested_changes") return MessageSquareText;
  return FileCheck2;
}

function DashboardPageContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const weekStartISO = toISODate(getMonday());
      const [reportsData, usersData] = await Promise.all([
        api.get("/reports", { limit: 100 }),
        api.get("/users", { role: "team_member" }),
      ]);
      setMetrics(computeDashboardMetrics({ reports: reportsData.reports, members: usersData.users, weekStartISO }));
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageLoader />;
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!metrics) return null;

  const statusData = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS_MANAGER[status],
    count: metrics.statusBuckets[status] || 0,
    fill: STATUS_COLORS[status],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Team dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">This week&apos;s submission health and team-wide insights.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Reports this week"
          value={metrics.totalReportsThisWeek}
          detail={`${metrics.totalMembers} team members`}
          icon={FileText}
        />
        <StatTile
          label="Submission compliance"
          value={`${metrics.complianceRate}%`}
          detail={`${metrics.membersSubmitted} of ${metrics.totalMembers} submitted`}
          icon={TrendingUp}
        />
        <StatTile
          label="Needs correction"
          value={metrics.needsCorrectionCount}
          detail="This week"
          icon={MessageSquareText}
        />
        <StatTile label="Open blockers" value={metrics.openBlockers} detail="This week" icon={CircleAlert} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="dashboard-card p-5">
          <h2 className="font-display text-base font-bold text-foreground">Tasks completed trend</h2>
          <p className="text-xs text-muted-foreground">Completed tasks per reporting week, team-wide</p>
          <div className="mt-3">
            <TrendChart data={metrics.trend} />
          </div>
        </div>
        <div className="dashboard-card p-5">
          <h2 className="font-display text-base font-bold text-foreground">Status by team member</h2>
          <p className="text-xs text-muted-foreground">This week</p>
          <div className="mt-3">
            <StatusDistributionChart data={statusData} />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {statusData.map((s) => (
              <span key={s.status} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: s.fill }} />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="dashboard-card p-5">
          <h2 className="font-display text-base font-bold text-foreground">Workload by project</h2>
          <p className="text-xs text-muted-foreground">Hours reported this week</p>
          <div className="mt-3">
            <WorkloadChart data={metrics.workload} />
          </div>
        </div>
        <div className="dashboard-card p-5">
          <h2 className="font-display text-base font-bold text-foreground">Time spent by task type</h2>
          <p className="text-xs text-muted-foreground">Team-wide, this week</p>
          <div className="mt-3">
            <HoursByTypeChart data={metrics.hoursByTypeData} />
          </div>
        </div>
      </div>

      <div className="dashboard-card p-5">
        <h2 className="font-display text-base font-bold text-foreground">Recent activity</h2>
        {metrics.recentActivity.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {metrics.recentActivity.map((event, index) => {
              const Icon = ACTIVITY_ICON(event.type);
              return (
                <div key={index} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-dashboard-soft">
                    <Icon className="size-3.5 text-brand-blue" />
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-5 text-foreground">{ACTIVITY_TEXT(event)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{new Date(event.at).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Need to filter or open a specific report?{" "}
        <Link href="/dashboard/reports" className="font-semibold text-brand-blue hover:underline">
          Go to all reports →
        </Link>
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireRole role="manager">
      <DashboardPageContent />
    </RequireRole>
  );
}
