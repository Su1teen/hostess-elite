import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "heavy" | "subtle";
}

export function GlassCard({ children, className, variant = "default", ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        variant === "default" && "glass",
        variant === "heavy" && "glass-heavy",
        variant === "subtle" && "bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
