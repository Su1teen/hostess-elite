import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, type ReactNode } from "react";

interface IconButtonProps extends HTMLMotionProps<"button"> {
  size?: "sm" | "md";
  active?: boolean;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "md", active = false, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "rounded-full glass border-white/10 text-foreground/90 hover:text-foreground transition-colors flex items-center justify-center",
          size === "sm" ? "w-9 h-9" : "w-11 h-11",
          active && "bg-[var(--gold)]/15 border-[var(--gold)]/40 text-[var(--gold)]",
          className,
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
IconButton.displayName = "IconButton";
