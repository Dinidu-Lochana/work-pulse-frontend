import { Star } from "lucide-react";

import { cn } from "@/lib/cn";
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS, TASK_TYPE_LABELS } from "@/lib/status";

function Section({ title, description, children }) {
  return (
    <div className="dashboard-card p-5">
      <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function NoteRows({ items, emptyLabel }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={index}
          className={cn(
            "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
            item.isKey ? "border-brand-blue/30 bg-brand-blue/5" : "border-border",
          )}
        >
          <Star className={cn("mt-0.5 size-4 shrink-0", item.isKey ? "fill-brand-blue text-brand-blue" : "text-muted-foreground")} />
          <span className="text-foreground">{item.description}</span>
        </li>
      ))}
    </ul>
  );
}

export function ReportContent({ content, projectName }) {
  const hours = content.hoursByTaskType || {};
  const hasHours = Object.values(hours).some((v) => v > 0);

  return (
    <div className="space-y-5">
      <Section title="Week & project">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-muted-foreground">Project</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">{projectName || "—"}</dd>
          </div>
        </dl>
      </Section>

      <Section title="Tasks completed">
        {content.tasksCompleted?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-dashboard-border text-xs uppercase text-muted-foreground">
                  <th className="px-2 py-2 font-medium">Task</th>
                  <th className="px-2 py-2 font-medium">Priority</th>
                  <th className="px-2 py-2 font-medium">Planned / Actual</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-2 py-2 font-medium">Hrs (plan/spent)</th>
                  <th className="px-2 py-2 font-medium">Output</th>
                </tr>
              </thead>
              <tbody>
                {content.tasksCompleted.map((task, index) => (
                  <tr key={index} className="border-b border-dashboard-border last:border-0">
                    <td className="px-2 py-2.5 font-medium text-foreground">{task.name}</td>
                    <td className="px-2 py-2.5 text-muted-foreground">{TASK_PRIORITY_LABELS[task.priority] || task.priority}</td>
                    <td className="px-2 py-2.5 text-muted-foreground">
                      {task.plannedPercent}% / {task.actualPercent}%
                    </td>
                    <td className="px-2 py-2.5 text-muted-foreground">{TASK_STATUS_LABELS[task.status] || task.status}</td>
                    <td className="px-2 py-2.5 text-muted-foreground">
                      {task.timePlannedHours}h / {task.timeSpentHours}h
                    </td>
                    <td className="px-2 py-2.5 text-muted-foreground">{task.output || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No tasks logged.</p>
        )}
      </Section>

      <Section title="Planned for next week">
        {content.tasksPlannedNextWeek?.length ? (
          <ul className="list-inside list-disc space-y-1 text-sm text-foreground">
            {content.tasksPlannedNextWeek.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nothing planned yet.</p>
        )}
      </Section>

      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Blockers / challenges">
          <NoteRows items={content.blockers} emptyLabel="No blockers reported." />
        </Section>
        <Section title="Achievements / highlights">
          <NoteRows items={content.achievements} emptyLabel="No achievements noted." />
        </Section>
      </div>

      {hasHours && (
        <Section title="Hours by task type">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {Object.entries(hours).map(([type, value]) => (
              <div key={type} className="rounded-md border border-border px-3 py-2 text-center">
                <p className="text-lg font-bold text-foreground">{value}h</p>
                <p className="text-xs text-muted-foreground">{TASK_TYPE_LABELS[type] || type}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {(content.notes || content.links?.length > 0) && (
        <Section title="Notes & links">
          {content.notes && <p className="whitespace-pre-wrap text-sm text-foreground">{content.notes}</p>}
          {content.links?.length > 0 && (
            <ul className="mt-3 space-y-1">
              {content.links.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-blue hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}
    </div>
  );
}
