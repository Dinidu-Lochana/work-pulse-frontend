import { cn } from "@/lib/cn";

const toneClasses = {
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-brand-blue/25 bg-brand-blue/10 text-brand-blue",
  success: "border-brand-blue/25 bg-dashboard-soft text-foreground",
};

export function Alert({ tone = "info", className, children }) {
  return (
    <div className={cn("rounded-md border px-3.5 py-2.5 text-sm", toneClasses[tone], className)}>
      {children}
    </div>
  );
}
