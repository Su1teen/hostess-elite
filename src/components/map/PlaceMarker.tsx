import { motion } from "framer-motion";
import {
  Utensils,
  Wine,
  Scissors,
  Sparkles,
  Stethoscope,
  Car,
  SmilePlus,
  type LucideIcon,
} from "lucide-react";
import type { PlaceCategory } from "@/types/place";
import { OCCUPANCY_TONE, occupancyBucket } from "@/lib/places";

const ICON_MAP: Record<PlaceCategory, LucideIcon> = {
  restaurant: Utensils,
  bar: Wine,
  barber: Scissors,
  spa: Sparkles,
  medical: Stethoscope,
  carwash: Car,
  dentistry: SmilePlus,
};

const CATEGORY_TONE: Record<PlaceCategory, { bg: string; text: string }> = {
  restaurant: { bg: "oklch(0.18 0.07 30 / 0.95)", text: "oklch(0.95 0.05 30)" }, // burgundy
  bar: { bg: "oklch(0.2 0.08 320 / 0.95)", text: "oklch(0.95 0.06 320)" },
  barber: { bg: "oklch(0.16 0.005 270 / 0.95)", text: "oklch(0.92 0.01 80)" },
  spa: { bg: "oklch(0.18 0.06 340 / 0.95)", text: "oklch(0.95 0.06 340)" },
  medical: { bg: "oklch(0.17 0.07 200 / 0.95)", text: "oklch(0.95 0.06 200)" },
  carwash: { bg: "oklch(0.17 0.07 240 / 0.95)", text: "oklch(0.95 0.06 240)" },
  dentistry: { bg: "oklch(0.18 0.06 180 / 0.95)", text: "oklch(0.95 0.06 180)" },
};

interface Props {
  category: PlaceCategory;
  occupancy: number;
  label: string;
  active?: boolean;
  onClick?: () => void;
  /** percentage on map */
  x: number;
  y: number;
  /** smaller variant when no label shown */
  size?: "sm" | "md";
}

export function PlaceMarker({
  category,
  occupancy,
  label,
  active = false,
  onClick,
  x,
  y,
  size = "md",
}: Props) {
  const Icon = ICON_MAP[category];
  const tone = CATEGORY_TONE[category];
  const occ = OCCUPANCY_TONE[occupancyBucket(occupancy)];

  // Ring fill ratio matches occupancy.
  const C = 2 * Math.PI * 18;
  const dash = (occupancy / 100) * C;

  const dim = size === "sm" ? 32 : 40;

  return (
    <button
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 group pointer-events-auto outline-none"
      style={{ left: `${x}%`, top: `${y}%`, zIndex: active ? 30 : 10 }}
      aria-label={label}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: active ? 1.12 : 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="relative flex flex-col items-center"
      >
        {/* Glow halo for active marker */}
        {active && (
          <span
            className="absolute inset-0 -m-3 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.86 0.13 85 / 0.35) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
        )}

        <span
          className="relative grid place-items-center rounded-full"
          style={{ width: dim, height: dim }}
        >
          {/* Occupancy ring */}
          <svg
            width={dim + 6}
            height={dim + 6}
            viewBox="0 0 48 48"
            className="absolute inset-0 -m-[3px]"
          >
            {/* Track */}
            <circle
              cx="24"
              cy="24"
              r="18"
              fill="none"
              stroke="oklch(1 0 0 / 0.08)"
              strokeWidth="3"
            />
            {/* Progress */}
            <circle
              cx="24"
              cy="24"
              r="18"
              fill="none"
              stroke={occ.ring}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C}`}
              transform="rotate(-90 24 24)"
              style={{
                filter: "drop-shadow(0 0 4px " + occ.ring + ")",
              }}
            />
          </svg>

          {/* Icon chip */}
          <span
            className="relative grid place-items-center rounded-full border"
            style={{
              width: dim - 8,
              height: dim - 8,
              background: tone.bg,
              borderColor: active ? "oklch(0.86 0.13 85 / 0.95)" : "oklch(1 0 0 / 0.12)",
              boxShadow: active
                ? "0 0 0 1px oklch(0.86 0.13 85 / 0.4), 0 8px 24px oklch(0 0 0 / 0.6)"
                : "0 4px 14px oklch(0 0 0 / 0.55)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <Icon
              style={{ color: tone.text, width: dim * 0.42, height: dim * 0.42 }}
              strokeWidth={2}
            />
          </span>
        </span>

        {/* Label */}
        <span
          className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wide whitespace-nowrap"
          style={{
            background: active
              ? "oklch(0.05 0.005 270 / 0.85)"
              : "oklch(0.05 0.005 270 / 0.55)",
            color: active ? "oklch(0.95 0.06 80)" : "oklch(0.85 0.02 80 / 0.85)",
            border: "1px solid oklch(1 0 0 / 0.06)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          {label}
        </span>
      </motion.div>
    </button>
  );
}
