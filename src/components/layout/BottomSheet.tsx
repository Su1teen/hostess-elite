import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ children, className }: BottomSheetProps) {
  const [sheetState, setSheetState] = useState<"peek" | "half" | "full">("half");
  const y = useMotionValue(0);

  // Snap points as vh percentages from top
  const snapPoints = { peek: 70, half: 40, full: 5 };
  const currentSnap = snapPoints[sheetState];

  const borderRadius = useTransform(
    y,
    [-200, 0],
    [0, 20]
  );

  const handleDragEnd = (_: never, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (velocity < -300 || offset < -100) {
      // Swiped up
      if (sheetState === "peek") setSheetState("half");
      else if (sheetState === "half") setSheetState("full");
    } else if (velocity > 300 || offset > 100) {
      // Swiped down
      if (sheetState === "full") setSheetState("half");
      else if (sheetState === "half") setSheetState("peek");
    }
  };

  return (
    <motion.div
      className={cn(
        "fixed left-0 right-0 bottom-0 z-40 glass-heavy border-t border-white/[0.08] overflow-hidden",
        className
      )}
      style={{
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
      }}
      animate={{
        top: `${currentSnap}vh`,
      }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
        <div className="w-10 h-1 rounded-full bg-white/20" />
      </div>

      {/* Content */}
      <div className="overflow-y-auto px-4 pb-24" style={{ height: `calc(${100 - currentSnap}vh - 40px)` }}>
        {children}
      </div>
    </motion.div>
  );
}
