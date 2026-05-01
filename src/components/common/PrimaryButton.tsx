import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface PrimaryButtonProps extends HTMLMotionProps<"button"> {
  variant?: "gold" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, variant = "gold", size = "md", fullWidth, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className={cn(
          "relative overflow-hidden rounded-2xl font-medium tracking-tight transition-colors disabled:opacity-50 disabled:pointer-events-none select-none",
          fullWidth && "w-full",
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-5 py-3 text-[15px]",
          size === "lg" && "px-6 py-4 text-base",
          variant === "gold" &&
            "bg-gradient-to-b from-[var(--gold)] to-[var(--gold-soft)] text-black shadow-[0_0_24px_oklch(0.86_0.13_85/0.18),inset_0_1px_0_oklch(1_0_0/0.25)] hover:shadow-[0_0_28px_oklch(0.86_0.13_85/0.3),inset_0_1px_0_oklch(1_0_0/0.3)]",
          variant === "ghost" &&
            "bg-white/[0.06] text-foreground hover:bg-white/[0.1] border border-white/[0.08]",
          variant === "outline" &&
            "bg-transparent text-foreground hover:bg-white/[0.05] border border-white/[0.18]",
          variant === "danger" &&
            "bg-destructive/[0.12] text-destructive hover:bg-destructive/[0.2] border border-destructive/30",
          className,
        )}
        {...props}
      >
        {variant === "gold" && (
          <span
            aria-hidden
            className="absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] opacity-0 hover:opacity-100 transition-opacity duration-700"
            style={{ animation: "shine 2.4s ease-in-out infinite" }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </motion.button>
    );
  },
);
PrimaryButton.displayName = "PrimaryButton";
