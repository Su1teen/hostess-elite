import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Tag({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "gold" | "burgundy" | "danger" | "muted";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide whitespace-nowrap",
        variant === "default" && "bg-white/[0.06] text-foreground border border-white/[0.08]",
        variant === "gold" && "bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30",
        variant === "burgundy" && "bg-[var(--burgundy)]/30 text-rose-200 border border-[var(--burgundy)]/50",
        variant === "danger" && "bg-destructive/15 text-destructive border border-destructive/30",
        variant === "muted" && "bg-white/[0.04] text-muted-foreground border border-white/[0.06]",
        className,
      )}
    >
      {children}
    </span>
  );
}
