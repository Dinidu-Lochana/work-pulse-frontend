"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { RequireRole } from "@/components/app/RequireRole";
import { buildInitialFormState, ReportForm } from "@/components/app/ReportForm";
import { PageLoader } from "@/components/ui/Spinner";
import { useProjects } from "@/hooks/useProjects";
import { api } from "@/lib/api";

function NewReportPageContent() {
  const router = useRouter();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const [form, setForm] = useState(buildInitialFormState(null));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      const data = await api.post("/reports", payload);
      router.push(`/reports/${data.report._id}`);
    } catch (err) {
      setError(err.details?.map((d) => d.message).join(", ") || err.message || "Failed to create report");
    } finally {
      setSaving(false);
    }
  };

  if (projectsLoading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">New weekly report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Saved as a draft first — you can review it and submit for approval when it&apos;s ready.
        </p>
      </div>
      {projectsError && <p className="mb-4 text-sm text-destructive">{projectsError}</p>}
      <ReportForm
        form={form}
        setForm={setForm}
        projects={projects}
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        submitLabel="Save draft"
      />
    </div>
  );
}

export default function NewReportPage() {
  return (
    <RequireRole role="team_member">
      <NewReportPageContent />
    </RequireRole>
  );
}
