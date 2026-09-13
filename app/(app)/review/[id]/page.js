"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, MessageSquareWarning } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { RequireRole } from "@/components/app/RequireRole";
import { ReportContent } from "@/components/app/ReportContent";
import { VersionHistory } from "@/components/app/VersionHistory";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { PageLoader } from "@/components/ui/Spinner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { formatDateRange } from "@/lib/dates";

function ReviewPageContent() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.get(`/reports/${id}`);
      setReport(data.report);
    } catch (err) {
      setLoadError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageLoader />;
  if (loadError) return <Alert tone="error">{loadError}</Alert>;
  if (!report) return null;

  if (report.status !== "submitted") {
    return (
      <Alert tone="info">
        This report is not awaiting review (current status: {report.status}).{" "}
        <Link href={`/reports/${id}`} className="font-semibold underline">
          View report
        </Link>
      </Alert>
    );
  }

  const submitReview = async (action) => {
    setError("");
    if (action === "request_changes" && comment.trim().length === 0) {
      setError("A comment is required when requesting changes");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/reports/${id}/review`, { action, comment: comment.trim() });
      router.push(`/reports/${id}`);
    } catch (err) {
      setError(err.details?.map((d) => d.message).join(", ") || err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Reviewing {report.user?.name}&apos;s report
          </h1>
          <StatusBadge status={report.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDateRange(report.weekStart, report.weekEnd)} · {report.project?.name}
        </p>
      </div>

      <ReportContent content={report} projectName={report.project?.name} />

      <VersionHistory reportId={id} projectName={report.project?.name} />

      <div className="dashboard-card p-5">
        <h2 className="font-display text-base font-bold text-foreground">Review decision</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve this report, or request changes with a comment explaining what needs correction.
        </p>
        {error && <Alert tone="error" className="mt-3">{error}</Alert>}
        <Field label="Comment" htmlFor="comment" className="mt-4" hint="Required when requesting changes.">
          <Textarea
            id="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What needs to change, or why this report looks good…"
          />
        </Field>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="hero" disabled={submitting} onClick={() => submitReview("approve")}>
            <CheckCircle2 className="size-4" /> Approve
          </Button>
          <Button variant="outline" disabled={submitting} onClick={() => submitReview("request_changes")}>
            <MessageSquareWarning className="size-4" /> Request changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <RequireRole role="manager">
      <ReviewPageContent />
    </RequireRole>
  );
}
