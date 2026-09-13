"use client";

import { Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";
import { TASK_TYPE_LABELS } from "@/lib/status";

const emptyTask = () => ({
  name: "",
  priority: "medium",
  plannedPercent: 0,
  actualPercent: 0,
  status: "not_started",
  timePlannedHours: 0,
  timeSpentHours: 0,
  output: "",
});

const emptyNote = () => ({ description: "", isKey: false });

export function buildInitialFormState(report) {
  if (!report) {
    return {
      weekStart: "",
      weekEnd: "",
      project: "",
      tasksCompleted: [emptyTask()],
      tasksPlannedNextWeek: [""],
      blockers: [emptyNote()],
      achievements: [emptyNote()],
      hoursByTaskType: { development: 0, testing: 0, meetings: 0, documentation: 0, other: 0 },
      notes: "",
      links: [""],
    };
  }

  return {
    weekStart: report.weekStart ? report.weekStart.slice(0, 10) : "",
    weekEnd: report.weekEnd ? report.weekEnd.slice(0, 10) : "",
    project: report.project?._id || report.project || "",
    tasksCompleted: report.tasksCompleted?.length ? report.tasksCompleted : [emptyTask()],
    tasksPlannedNextWeek: report.tasksPlannedNextWeek?.length ? report.tasksPlannedNextWeek : [""],
    blockers: report.blockers?.length ? report.blockers : [emptyNote()],
    achievements: report.achievements?.length ? report.achievements : [emptyNote()],
    hoursByTaskType: {
      development: report.hoursByTaskType?.development || 0,
      testing: report.hoursByTaskType?.testing || 0,
      meetings: report.hoursByTaskType?.meetings || 0,
      documentation: report.hoursByTaskType?.documentation || 0,
      other: report.hoursByTaskType?.other || 0,
    },
    notes: report.notes || "",
    links: report.links?.length ? report.links : [""],
  };
}

// Strips blank rows/entries the user never filled in, so we don't send
// half-empty objects that fail server-side validation (e.g. a task row
// with no name).
export function sanitizeReportPayload(form) {
  return {
    weekStart: form.weekStart,
    weekEnd: form.weekEnd,
    project: form.project,
    tasksCompleted: form.tasksCompleted.filter((task) => task.name.trim().length > 0),
    tasksPlannedNextWeek: form.tasksPlannedNextWeek.map((t) => t.trim()).filter(Boolean),
    blockers: form.blockers.filter((b) => b.description.trim().length > 0),
    achievements: form.achievements.filter((a) => a.description.trim().length > 0),
    hoursByTaskType: form.hoursByTaskType,
    notes: form.notes.trim(),
    links: form.links.map((l) => l.trim()).filter(Boolean),
  };
}

function SectionCard({ title, description, children }) {
  return (
    <div className="dashboard-card p-5">
      <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function TaskTable({ tasks, onChange }) {
  const updateTask = (index, patch) => {
    onChange(tasks.map((task, i) => (i === index ? { ...task, ...patch } : task)));
  };
  const removeTask = (index) => onChange(tasks.filter((_, i) => i !== index));
  const addTask = () => onChange([...tasks, emptyTask()]);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-muted-foreground">
              <th className="px-2 font-medium">Task</th>
              <th className="px-2 font-medium">Priority</th>
              <th className="px-2 font-medium">Planned %</th>
              <th className="px-2 font-medium">Actual %</th>
              <th className="px-2 font-medium">Status</th>
              <th className="px-2 font-medium">Hrs planned</th>
              <th className="px-2 font-medium">Hrs spent</th>
              <th className="px-2 font-medium">Output</th>
              <th className="px-2" />
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index} className="align-top">
                <td className="min-w-[160px] px-2">
                  <Input
                    value={task.name}
                    placeholder="Task name"
                    onChange={(e) => updateTask(index, { name: e.target.value })}
                  />
                </td>
                <td className="min-w-[110px] px-2">
                  <Select value={task.priority} onChange={(e) => updateTask(index, { priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </td>
                <td className="min-w-[90px] px-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={task.plannedPercent}
                    onChange={(e) => updateTask(index, { plannedPercent: Number(e.target.value) })}
                  />
                </td>
                <td className="min-w-[90px] px-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={task.actualPercent}
                    onChange={(e) => updateTask(index, { actualPercent: Number(e.target.value) })}
                  />
                </td>
                <td className="min-w-[130px] px-2">
                  <Select value={task.status} onChange={(e) => updateTask(index, { status: e.target.value })}>
                    <option value="not_started">Not started</option>
                    <option value="in_progress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="blocked">Blocked</option>
                  </Select>
                </td>
                <td className="min-w-[90px] px-2">
                  <Input
                    type="number"
                    min={0}
                    value={task.timePlannedHours}
                    onChange={(e) => updateTask(index, { timePlannedHours: Number(e.target.value) })}
                  />
                </td>
                <td className="min-w-[90px] px-2">
                  <Input
                    type="number"
                    min={0}
                    value={task.timeSpentHours}
                    onChange={(e) => updateTask(index, { timeSpentHours: Number(e.target.value) })}
                  />
                </td>
                <td className="min-w-[160px] px-2">
                  <Input
                    value={task.output}
                    placeholder="Deliverable"
                    onChange={(e) => updateTask(index, { output: e.target.value })}
                  />
                </td>
                <td className="px-2">
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove task"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addTask}>
        <Plus className="size-4" /> Add task
      </Button>
    </div>
  );
}

function NoteList({ items, onChange, placeholder, keyLabel }) {
  const updateItem = (index, patch) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };
  const toggleKey = (index) => {
    onChange(items.map((item, i) => ({ ...item, isKey: i === index ? !item.isKey : false })));
  };
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));
  const addItem = () => onChange([...items, emptyNote()]);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <Input
            value={item.description}
            placeholder={placeholder}
            onChange={(e) => updateItem(index, { description: e.target.value })}
          />
          <button
            type="button"
            onClick={() => toggleKey(index)}
            title={keyLabel}
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-md border transition-colors",
              item.isKey
                ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                : "border-input text-muted-foreground hover:text-foreground",
            )}
          >
            <Star className={cn("size-4", item.isKey && "fill-current")} />
          </button>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="size-4" /> Add
      </Button>
    </div>
  );
}

function StringList({ items, onChange, placeholder }) {
  const updateItem = (index, value) => onChange(items.map((item, i) => (i === index ? value : item)));
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));
  const addItem = () => onChange([...items, ""]);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input value={item} placeholder={placeholder} onChange={(e) => updateItem(index, e.target.value)} />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="size-4" /> Add
      </Button>
    </div>
  );
}

export function ReportForm({ form, setForm, projects, onSubmit, saving, error, submitLabel, secondaryAction }) {
  const [localError, setLocalError] = useState("");

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError("");

    if (!form.weekStart || !form.weekEnd) {
      setLocalError("Week start and end dates are required");
      return;
    }
    if (new Date(form.weekEnd) < new Date(form.weekStart)) {
      setLocalError("Week end must be on or after week start");
      return;
    }
    if (!form.project) {
      setLocalError("Select a project");
      return;
    }

    onSubmit(sanitizeReportPayload(form));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(error || localError) && <Alert tone="error">{error || localError}</Alert>}

      <SectionCard title="Week & project">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Week start" htmlFor="weekStart">
            <Input
              id="weekStart"
              type="date"
              required
              value={form.weekStart}
              onChange={(e) => update({ weekStart: e.target.value })}
            />
          </Field>
          <Field label="Week end" htmlFor="weekEnd">
            <Input
              id="weekEnd"
              type="date"
              required
              value={form.weekEnd}
              onChange={(e) => update({ weekEnd: e.target.value })}
            />
          </Field>
          <Field label="Project / category" htmlFor="project">
            <Select id="project" required value={form.project} onChange={(e) => update({ project: e.target.value })}>
              <option value="">Select a project…</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Tasks completed" description="Log what you worked on this week and how it went.">
        <TaskTable tasks={form.tasksCompleted} onChange={(tasksCompleted) => update({ tasksCompleted })} />
      </SectionCard>

      <SectionCard title="Planned for next week">
        <StringList
          items={form.tasksPlannedNextWeek}
          onChange={(tasksPlannedNextWeek) => update({ tasksPlannedNextWeek })}
          placeholder="What will you work on next?"
        />
      </SectionCard>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Blockers / challenges" description="Star the one that's the key issue this week.">
          <NoteList
            items={form.blockers}
            onChange={(blockers) => update({ blockers })}
            placeholder="Describe a blocker"
            keyLabel="Mark as key issue"
          />
        </SectionCard>
        <SectionCard title="Achievements / highlights" description="Star the one that's the key achievement.">
          <NoteList
            items={form.achievements}
            onChange={(achievements) => update({ achievements })}
            placeholder="Describe an achievement"
            keyLabel="Mark as key achievement"
          />
        </SectionCard>
      </div>

      <SectionCard title="Hours by task type" description="Optional — helps managers see where time went.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {Object.keys(form.hoursByTaskType).map((type) => (
            <Field key={type} label={TASK_TYPE_LABELS[type]} htmlFor={`hours-${type}`}>
              <Input
                id={`hours-${type}`}
                type="number"
                min={0}
                value={form.hoursByTaskType[type]}
                onChange={(e) =>
                  update({
                    hoursByTaskType: { ...form.hoursByTaskType, [type]: Number(e.target.value) },
                  })
                }
              />
            </Field>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Notes & links" description="Optional.">
        <div className="space-y-4">
          <Field label="Notes" htmlFor="notes">
            <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => update({ notes: e.target.value })} />
          </Field>
          <Field label="Links">
            <StringList items={form.links} onChange={(links) => update({ links })} placeholder="https://…" />
          </Field>
        </div>
      </SectionCard>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="hero" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </Button>
        {secondaryAction}
      </div>
    </form>
  );
}
