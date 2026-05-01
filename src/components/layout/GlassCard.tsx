import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "subtle" | "default" | "medium" | "heavy";
  rim?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", rim = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl",
          variant === "subtle" &&
            "bg-white/[0.03] border border-white/[0.06] backdrop-blur-md",
          variant === "default" && "glass",
          variant === "medium" && "glass-medium",
          variant === "heavy" && "glass-heavy",
          rim && "glass-rim",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
GlassCard.displayName = "GlassCard";
