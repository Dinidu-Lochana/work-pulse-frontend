"use client";

import { ChevronDown, ChevronUp, History } from "lucide-react";
import { useState } from "react";

import { ReportContent } from "@/components/app/ReportContent";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/dates";

export function VersionHistory({ reportId, projectName }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [versions, setVersions] = useState(null);
  const [reviewHistory, setReviewHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = async () => {
    if (!open && versions === null) {
      setLoading(true);
      setError("");
      try {
        const data = await api.get(`/reports/${reportId}/versions`);
        setVersions(data.versions);
        setReviewHistory(data.reviewHistory);
      } catch (err) {
        setError(err.message || "Failed to load version history");
      } finally {
        setLoading(false);
      }
    }
    setOpen((o) => !o);
  };

  return (
    <div className="dashboard-card p-5">
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="flex items-center gap-2 font-display text-base font-bold text-foreground">
          <History className="size-4" /> Version history
        </span>
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>

      {open && (
        <div className="mt-4">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" /> Loading history…
            </div>
          )}
          {error && <Alert tone="error">{error}</Alert>}
          {!loading && versions && versions.length === 0 && (
            <p className="text-sm text-muted-foreground">No past versions yet — this report hasn&apos;t been submitted.</p>
          )}
          {!loading && versions && versions.length > 0 && (
            <ul className="space-y-3">
              {[...versions].reverse().map((version, reverseIndex) => {
                const versionNumber = versions.length - reverseIndex;
                const comments = reviewHistory.filter((entry) => entry.versionId === version._id);
                const expanded = expandedId === version._id;
                return (
                  <li key={version._id} className="rounded-md border border-border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Version {versionNumber}</p>
                        <p className="text-xs text-muted-foreground">Submitted {formatDateTime(version.submittedAt)}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setExpandedId(expanded ? null : version._id)}>
                        {expanded ? "Hide" : "View"}
                      </Button>
                    </div>

                    {comments.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {comments.map((comment, i) => (
                          <div
                            key={i}
                            className="rounded-md bg-surface-subtle px-3 py-2 text-xs text-muted-foreground"
                          >
                            <span
                              className={
                                comment.action === "approved" ? "font-semibold text-brand-blue" : "font-semibold text-destructive"
                              }
                            >
                              {comment.action === "approved" ? "Approved" : "Changes requested"}
                            </span>{" "}
                            by {comment.reviewer?.name || "a manager"} on {formatDateTime(comment.reviewedAt)}
                            {comment.comment && <p className="mt-1 text-foreground">{comment.comment}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {expanded && (
                      <div className="mt-3">
                        <ReportContent content={version} projectName={projectName} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
