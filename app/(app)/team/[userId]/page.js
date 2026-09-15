"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { RequireRole } from "@/components/app/RequireRole";
import { Alert } from "@/components/ui/Alert";
import { PageLoader } from "@/components/ui/Spinner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatTile } from "@/components/app/StatTile";
import { api } from "@/lib/api";
import { formatDateRange } from "@/lib/dates";

function TeamMemberProfileContent() {
  const { userId } = useParams();
  const [member, setMember] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [usersData, reportsData] = await Promise.all([
        api.get("/users", { role: "team_member" }),
        api.get("/reports", { user: userId, limit: 100 }),
      ]);
      const found = usersData.users.find((u) => u.id === userId);
      setMember(found || null);
      setReports(reportsData.reports);
    } catch (err) {
      setError(err.message || "Failed to load team member");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageLoader />;
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!member) return <Alert tone="info">Team member not found.</Alert>;

  const approvedCount = reports.filter((r) => r.status === "approved").length;
  const needsCorrectionCount = reports.filter((r) => r.status === "needs_correction").length;
  const totalTasks = reports.reduce((sum, r) => sum + (r.tasksCompleted?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-dashboard-soft text-lg font-bold text-brand-blue">
          {member.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{member.name}</h1>
          <p className="text-sm text-muted-foreground">{member.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Total reports" value={reports.length} />
        <StatTile label="Approved" value={approvedCount} />
        <StatTile label="Needs correction" value={needsCorrectionCount} />
        <StatTile label="Tasks logged" value={totalTasks} />
      </div>

      <div className="dashboard-card overflow-hidden">
        <div className="border-b border-dashboard-border px-5 py-4">
          <h2 className="font-display text-base font-bold text-foreground">Report history</h2>
        </div>
        {reports.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No submitted reports yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-dashboard-border text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Week</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id} className="border-b border-dashboard-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatDateRange(report.weekStart, report.weekEnd)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{report.project?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={report.status === "submitted" ? `/review/${report._id}` : `/reports/${report._id}`}
                        className="text-sm font-semibold text-brand-blue hover:underline"
                      >
                        {report.status === "submitted" ? "Review" : "View"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamMemberProfilePage() {
  return (
    <RequireRole role="manager">
      <TeamMemberProfileContent />
    </RequireRole>
  );
}
