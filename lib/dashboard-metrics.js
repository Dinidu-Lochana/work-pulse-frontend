import { TASK_TYPE_LABELS } from "@/lib/status";

function shortWeekLabel(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function computeDashboardMetrics({ reports, members, weekStartISO }) {
  const currentWeekReports = reports.filter((r) => r.weekStart.slice(0, 10) === weekStartISO);

  const memberIdsSubmitted = new Set(currentWeekReports.map((r) => r.user?._id));
  const complianceRate = members.length ? Math.round((memberIdsSubmitted.size / members.length) * 100) : 0;

  const needsCorrectionCount = currentWeekReports.filter((r) => r.status === "needs_correction").length;
  const openBlockers = currentWeekReports.reduce((sum, r) => sum + (r.blockers?.length || 0), 0);

  const statusBuckets = { not_started: 0, submitted: 0, needs_correction: 0, approved: 0 };
  for (const member of members) {
    const report = currentWeekReports.find((r) => r.user?._id === member.id);
    const status = report ? report.status : "not_started";
    statusBuckets[status] = (statusBuckets[status] || 0) + 1;
  }

  const workloadMap = new Map();
  for (const r of currentWeekReports) {
    const name = r.project?.name || "Unassigned";
    const hours = (r.tasksCompleted || []).reduce((sum, t) => sum + (t.timeSpentHours || 0), 0);
    workloadMap.set(name, (workloadMap.get(name) || 0) + hours);
  }
  const workload = [...workloadMap.entries()]
    .map(([name, hours]) => ({ name, hours: Math.round(hours * 10) / 10 }))
    .sort((a, b) => b.hours - a.hours);

  const hoursByType = { development: 0, testing: 0, meetings: 0, documentation: 0, other: 0 };
  for (const r of currentWeekReports) {
    const h = r.hoursByTaskType || {};
    for (const key of Object.keys(hoursByType)) hoursByType[key] += h[key] || 0;
  }
  const hoursByTypeData = Object.entries(hoursByType)
    .map(([type, hours]) => ({ type: TASK_TYPE_LABELS[type] || type, hours }))
    .filter((d) => d.hours > 0);

  const weekMap = new Map();
  for (const r of reports) {
    const wk = r.weekStart.slice(0, 10);
    const completedCount = (r.tasksCompleted || []).filter((t) => t.status === "completed").length;
    weekMap.set(wk, (weekMap.get(wk) || 0) + completedCount);
  }
  const trend = [...weekMap.entries()]
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .slice(-7)
    .map(([wk, count]) => ({ week: shortWeekLabel(wk), count }));

  const events = [];
  for (const r of reports) {
    if (r.submittedAt) {
      events.push({ type: "submitted", at: r.submittedAt, user: r.user?.name });
    }
    for (const entry of r.reviewHistory || []) {
      events.push({
        type: entry.action,
        at: entry.reviewedAt,
        user: r.user?.name,
        reviewer: entry.reviewer?.name,
      });
    }
  }
  events.sort((a, b) => new Date(b.at) - new Date(a.at));

  return {
    totalReportsThisWeek: currentWeekReports.length,
    complianceRate,
    membersSubmitted: memberIdsSubmitted.size,
    totalMembers: members.length,
    needsCorrectionCount,
    openBlockers,
    statusBuckets,
    workload,
    hoursByTypeData,
    trend,
    recentActivity: events.slice(0, 8),
  };
}
