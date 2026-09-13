import { Loader2 } from "lucide-react";

import { cn } from "@/lib/cn";

export function Spinner({ className }) {
  return <Loader2 className={cn("size-5 animate-spin text-brand-blue", className)} aria-hidden="true" />;
}

export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
      <Spinner className="size-6" />
      {label}
    </div>
  );
}
