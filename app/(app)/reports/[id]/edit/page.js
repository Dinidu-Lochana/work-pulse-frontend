"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { RequireRole } from "@/components/app/RequireRole";
import { buildInitialFormState, ReportForm } from "@/components/app/ReportForm";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { useProjects } from "@/hooks/useProjects";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const EDITABLE_STATUSES = ["draft", "needs_correction"];

function EditReportPageContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const [report, setReport] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.get(`/reports/${id}`);
      setReport(data.report);
      setForm(buildInitialFormState(data.report));
    } catch (err) {
      setLoadError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || projectsLoading || !form) return <PageLoader />;

  if (loadError) {
    return <Alert tone="error">{loadError}</Alert>;
  }

  const isOwner = report.user?._id === user.id || report.user === user.id;
  if (!isOwner || !EDITABLE_STATUSES.includes(report.status)) {
    return (
      <Alert tone="info">
        This report can&apos;t be edited right now.{" "}
        <Link href={`/reports/${id}`} className="font-semibold underline">
          View report
        </Link>
      </Alert>
    );
  }

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      await api.put(`/reports/${id}`, payload);
      router.push(`/reports/${id}`);
    } catch (err) {
      setError(err.details?.map((d) => d.message).join(", ") || err.message || "Failed to save report");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Edit weekly report</h1>
        {report.status === "needs_correction" && report.reviewComment && (
          <Alert tone="error" className="mt-3">
            <span className="font-semibold">Manager feedback:</span> {report.reviewComment}
          </Alert>
        )}
      </div>
      <ReportForm
        form={form}
        setForm={setForm}
        projects={projects}
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        submitLabel="Save changes"
        secondaryAction={
          <Button asChild variant="outline">
            <Link href={`/reports/${id}`}>Cancel</Link>
          </Button>
        }
      />
    </div>
  );
}

export default function EditReportPage() {
  return (
    <RequireRole role="team_member">
      <EditReportPageContent />
    </RequireRole>
  );
}
