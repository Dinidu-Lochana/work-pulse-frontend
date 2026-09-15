"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { RequireRole } from "@/components/app/RequireRole";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PageLoader } from "@/components/ui/Spinner";
import { useProjects } from "@/hooks/useProjects";
import { api } from "@/lib/api";
import { formatDateRange } from "@/lib/dates";
import { REPORT_STATUSES, statusLabel } from "@/lib/status";

function AllReportsPageContent() {
  const { projects } = useProjects();
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({ user: "", project: "", status: "", weekFrom: "", weekTo: "" });
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users", { role: "team_member" })
      .then((data) => setMembers(data.users))
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/reports", {
        ...filters,
        user: filters.user || undefined,
        project: filters.project || undefined,
        status: filters.status || undefined,
        weekFrom: filters.weekFrom || undefined,
        weekTo: filters.weekTo || undefined,
        page,
      });
      setReports(data.reports);
      setMeta(data.meta);
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFilter = (patch) => {
    setPage(1);
    setFilters((f) => ({ ...f, ...patch }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">All reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">Filter and open any team member&apos;s weekly report.</p>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Team member">
          <Select value={filters.user} onChange={(e) => updateFilter({ user: e.target.value })}>
            <option value="">All members</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Project">
          <Select value={filters.project} onChange={(e) => updateFilter({ project: e.target.value })}>
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={filters.status} onChange={(e) => updateFilter({ status: e.target.value })}>
            <option value="">All statuses</option>
            {REPORT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Week from">
          <Input type="date" value={filters.weekFrom} onChange={(e) => updateFilter({ weekFrom: e.target.value })} />
        </Field>
        <Field label="Week to">
          <Input type="date" value={filters.weekTo} onChange={(e) => updateFilter({ weekTo: e.target.value })} />
        </Field>
      </div>

      {error && <Alert tone="error" className="mb-4">{error}</Alert>}

      {loading ? (
        <PageLoader />
      ) : reports.length === 0 ? (
        <div className="dashboard-card p-10 text-center text-sm text-muted-foreground">No reports match these filters.</div>
      ) : (
        <div className="dashboard-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-dashboard-border text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Team member</th>
                  <th className="px-4 py-3 font-medium">Week</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id} className="border-b border-dashboard-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{report.user?.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateRange(report.weekStart, report.weekEnd)}</td>
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

export default function AllReportsPage() {
  return (
    <RequireRole role="manager">
      <AllReportsPageContent />
    </RequireRole>
  );
}
