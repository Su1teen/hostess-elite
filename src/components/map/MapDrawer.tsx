import { useEffect, useState, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Liquid Glass pull-up drawer with three snap points: peek / mid / full.
 *
 * - Drag handle at top with vertical bar.
 * - Multi-layered glass: glass-heavy + inset rim + faint inner glow.
 * - Snap is spring-physics based, with momentum.
 */

type Snap = "peek" | "mid" | "full";

interface Props {
  /** Heights in viewport px ratios — 0..1 of viewport height. */
  snaps?: Record<Snap, number>;
  /** Initial snap. */
  initial?: Snap;
  /** Children rendered inside the scrollable content area. */
  children: ReactNode;
  /** Optional className for the outer container. */
  className?: string;
  /** Notified when snap changes. */
  onSnapChange?: (snap: Snap) => void;
}

const DEFAULT_SNAPS: Record<Snap, number> = {
  peek: 0.28,
  mid: 0.6,
  full: 0.94,
};

export function MapDrawer({
  snaps = DEFAULT_SNAPS,
  initial = "mid",
  children,
  className,
  onSnapChange,
}: Props) {
  const [vh, setVh] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerHeight : 800,
  );
  const [snap, setSnap] = useState<Snap>(initial);
  const y = useMotionValue(0);

  // Sync vh on mount and resize
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const snapY = (s: Snap) => vh - vh * snaps[s];

  // Animate to snap on mount and on snap changes.
  useEffect(() => {
    const target = snapY(snap);
    const controls = animate(y, target, {
      type: "spring",
      stiffness: 320,
      damping: 36,
    });
    onSnapChange?.(snap);
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap, vh]);

  const handleDragEnd = (_e: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    const current = y.get();
    const projected = current + info.velocity.y * 0.1;
    const candidates: Snap[] = ["full", "mid", "peek"];
    let best: Snap = snap;
    let bestDist = Infinity;
    for (const s of candidates) {
      const dist = Math.abs(snapY(s) - projected);
      if (dist < bestDist) {
        bestDist = dist;
        best = s;
      }
    }
    setSnap(best);
  };

  // Inner glow brightens as drawer rises
  const glow = useTransform(y, [snapY("full"), snapY("peek")], [0.32, 0.05]);

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: snapY("full"), bottom: snapY("peek") }}
      dragElastic={0.06}
      dragMomentum={true}
      onDragEnd={handleDragEnd}
      style={{ y, height: vh }}
      className={cn(
        "fixed left-0 right-0 top-0 z-30 will-change-transform select-none",
        className,
      )}
    >
      {/* Outer glass shell */}
      <div className="relative w-full h-full rounded-t-[28px] overflow-hidden">
        {/* Layered glass background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(1 0 0 / 0.10) 0%, oklch(1 0 0 / 0.05) 100%)",
            backdropFilter: "blur(48px) saturate(1.7)",
            WebkitBackdropFilter: "blur(48px) saturate(1.7)",
          }}
        />
        {/* Inner rim highlight */}
        <div
          className="absolute inset-0 pointer-events-none rounded-t-[28px]"
          style={{
            boxShadow:
              "inset 0 1px 0 oklch(1 0 0 / 0.18), inset 0 -1px 0 oklch(1 0 0 / 0.04), inset 1px 0 0 oklch(1 0 0 / 0.06), inset -1px 0 0 oklch(1 0 0 / 0.06), 0 -32px 80px oklch(0 0 0 / 0.5)",
          }}
        />
        {/* Inner soft halo */}
        <motion.div
          className="absolute inset-x-12 top-0 h-32 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, oklch(0.86 0.13 85 / 0.18) 0%, transparent 70%)",
            opacity: glow,
            filter: "blur(20px)",
          }}
        />

        {/* Drag handle */}
        <button
          aria-label="Развернуть"
          onClick={() => setSnap(snap === "full" ? "peek" : snap === "mid" ? "full" : "mid")}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-6 py-2 group"
        >
          <span className="block h-1.5 w-12 rounded-full bg-white/30 group-hover:bg-white/55 transition-colors" />
        </button>

        {/* Expand chevron next to handle when not full */}
        {snap !== "full" && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 0.7, y: 0 }}
            className="absolute top-1.5 right-5 z-10 text-foreground/55"
            aria-hidden
          >
            <ChevronUp className="w-4 h-4" />
          </motion.span>
        )}

        {/* Scrollable content */}
        <div className="absolute inset-0 pt-7 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
