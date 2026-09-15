"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { RequireRole } from "@/components/app/RequireRole";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PageLoader } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { api } from "@/lib/api";
import { formatDateRange } from "@/lib/dates";
import { REPORT_STATUSES, statusLabel } from "@/lib/status";

function MyReportsPageContent() {
  const [reports, setReports] = useState([]);
  const [meta, setMeta] = useState(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/reports/mine", { status: status || undefined, page });
      setReports(data.reports);
      setMeta(data.meta);
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your weekly report history and current statuses.</p>
        </div>
        <Button asChild variant="hero">
          <Link href="/reports/new">
            <Plus className="size-4" /> New report
          </Link>
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Select
          className="w-48"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          {REPORT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </Select>
      </div>

      {error && <Alert tone="error" className="mb-4">{error}</Alert>}

      {loading ? (
        <PageLoader />
      ) : reports.length === 0 ? (
        <div className="dashboard-card p-10 text-center text-sm text-muted-foreground">
          No reports yet. Create your first weekly report to get started.
        </div>
      ) : (
        <div className="dashboard-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
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
                      <Link href={`/reports/${report._id}`} className="text-sm font-semibold text-brand-blue hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function MyReportsPage() {
  return (
    <RequireRole role="team_member">
      <MyReportsPageContent />
    </RequireRole>
  );
}
