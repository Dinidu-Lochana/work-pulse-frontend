import { cn } from "@/lib/cn";
import { statusLabel, statusTone } from "@/lib/status";

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        `status-${statusTone(status)}`,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {statusLabel(status)}
    </span>
  );
}
