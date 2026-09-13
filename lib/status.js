export const REPORT_STATUSES = ["draft", "submitted", "needs_correction", "approved"];

export const STATUS_META = {
  draft: { label: "Draft", tone: "draft" },
  submitted: { label: "Submitted", tone: "submitted" },
  needs_correction: { label: "Needs Correction", tone: "correction" },
  approved: { label: "Approved", tone: "approved" },
};

export function statusLabel(status) {
  return STATUS_META[status]?.label || status;
}

export function statusTone(status) {
  return STATUS_META[status]?.tone || "draft";
}

export const TASK_STATUS_LABELS = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
  blocked: "Blocked",
};

export const TASK_PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const TASK_TYPE_LABELS = {
  development: "Development",
  testing: "Testing",
  meetings: "Meetings",
  documentation: "Documentation",
  other: "Other",
};
