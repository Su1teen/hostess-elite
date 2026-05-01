import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  noTopPad?: boolean;
}

export function PageShell({ children, className, noTopPad }: PageShellProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative min-h-dvh w-full text-foreground",
        !noTopPad && "pt-4 md:pt-20",
        "pb-28 md:pb-10",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">{children}</div>
    </motion.main>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3 mb-3 mt-6">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-balance">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
