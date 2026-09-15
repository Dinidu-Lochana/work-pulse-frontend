"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import { RequireRole } from "@/components/app/RequireRole";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { PageLoader } from "@/components/ui/Spinner";
import { useProjects } from "@/hooks/useProjects";
import { api } from "@/lib/api";

const emptyForm = { name: "", description: "" };

function ProjectsPageContent() {
  const { projects, loading, error: loadError, reload } = useProjects({ includeInactive: true });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const startEdit = (project) => {
    setEditingId(project._id);
    setForm({ name: project.name, description: project.description || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Project name is required");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
      } else {
        await api.post("/projects", form);
      }
      cancelEdit();
      reload();
    } catch (err) {
      setError(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Deactivate "${project.name}"? Past reports keep referencing it, but it won't be selectable for new ones.`)) {
      return;
    }
    try {
      await api.delete(`/projects/${project._id}`);
      reload();
    } catch (err) {
      setError(err.message || "Failed to delete project");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Projects &amp; categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage the projects team members can tag their reports with.</p>
      </div>

      <div className="dashboard-card p-5">
        <h2 className="font-display text-base font-bold text-foreground">{editingId ? "Edit project" : "New project"}</h2>
        {error && <Alert tone="error" className="mt-3">{error}</Alert>}
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="name">
            <Input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="Description" htmlFor="description">
            <Textarea
              id="description"
              rows={1}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" variant="hero" disabled={saving}>
              {editingId ? <Pencil className="size-4" /> : <Plus className="size-4" />}
              {saving ? "Saving…" : editingId ? "Save changes" : "Add project"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                <X className="size-4" /> Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {loadError && <Alert tone="error">{loadError}</Alert>}

      {loading ? (
        <PageLoader />
      ) : (
        <div className="dashboard-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-dashboard-border text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id} className="border-b border-dashboard-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{project.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{project.description || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={project.isActive ? "status-approved rounded-full px-2.5 py-1 text-xs font-semibold" : "status-draft rounded-full px-2.5 py-1 text-xs font-semibold"}>
                        {project.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => startEdit(project)}
                          className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                          aria-label="Edit"
                        >
                          <Pencil className="size-4" />
                        </button>
                        {project.isActive && (
                          <button
                            onClick={() => handleDelete(project)}
                            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Deactivate"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <RequireRole role="manager">
      <ProjectsPageContent />
    </RequireRole>
  );
}
