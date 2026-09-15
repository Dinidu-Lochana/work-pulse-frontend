"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ReportContent } from "@/components/app/ReportContent";
import { VersionHistory } from "@/components/app/VersionHistory";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDateRange } from "@/lib/dates";

const EDITABLE_STATUSES = ["draft", "needs_correction"];

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get(`/reports/${id}`);
      setReport(data.report);
    } catch (err) {
      setError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageLoader />;
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!report) return null;

  const isOwner = (report.user?._id || report.user) === user.id;
  const isManager = user.role === "manager";
  const canEdit = isOwner && EDITABLE_STATUSES.includes(report.status);
  const canSubmit = canEdit;

  const handleSubmit = async () => {
    if (!window.confirm("Submit this report for manager review?")) return;
    setSubmitting(true);
    try {
      const data = await api.post(`/reports/${id}/submit`);
      setReport(data.report);
    } catch (err) {
      setError(err.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {formatDateRange(report.weekStart, report.weekEnd)}
            </h1>
            <StatusBadge status={report.status} />
          </div>
          {isManager && report.user?.name && (
            <p className="mt-1 text-sm text-muted-foreground">
              {report.user.name} · {report.user.email}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <Button asChild variant="outline">
              <Link href={`/reports/${id}/edit`}>
                <Pencil className="size-4" /> Edit
              </Link>
            </Button>
          )}
          {canSubmit && (
            <Button variant="hero" onClick={handleSubmit} disabled={submitting}>
              <Send className="size-4" /> {submitting ? "Submitting…" : "Submit for review"}
            </Button>
          )}
          {isManager && report.status === "submitted" && (
            <Button asChild variant="hero">
              <Link href={`/review/${id}`}>Review report</Link>
            </Button>
          )}
        </div>
      </div>

      {report.reviewComment && (
        <Alert tone={report.status === "needs_correction" ? "error" : "success"}>
          <span className="font-semibold">
            {report.status === "needs_correction" ? "Correction requested: " : "Manager comment: "}
          </span>
          {report.reviewComment}
        </Alert>
      )}

      <ReportContent content={report} projectName={report.project?.name} />

      <VersionHistory reportId={id} projectName={report.project?.name} />

      <div>
        <button onClick={() => router.back()} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Back
        </button>
      </div>
    </div>
  );
}
