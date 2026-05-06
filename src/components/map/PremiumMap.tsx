import type { ReactNode } from "react";
import { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * Hand-crafted dark-mode vector basemap for Almaty. 100x60 viewport.
 *
 * Style references: 2GIS dark, Apple Maps dark, Google Maps "Aubergine".
 * Drawn entirely in SVG — no external tile provider.
 */

interface Props {
  /** Optional pan offset in viewport units; clamped externally. */
  panX?: number;
  panY?: number;
  /** Markers and overlays placed by absolute % within map area. */
  children?: ReactNode;
  /** Compact = used inside a drawer / smaller container. */
  compact?: boolean;
  /** Optional className for the root container. */
  className?: string;
}

export function PremiumMap({ panX = 0, panY = 0, children, compact = false, className }: Props) {
  // Memoize generated building grid once.
  const buildings = useMemo(() => generateBuildings(), []);
  const blocks = useMemo(() => generateBlocks(), []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className ?? ""}`}>
      {/* Deep dark base — radial wash for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 30% 20%, oklch(0.09 0.02 248) 0%, oklch(0.05 0.005 270) 60%, oklch(0.04 0 0) 100%)",
        }}
      />

      {/* Topo grain */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none">
        <defs>
          <pattern id="grain" width="200" height="200" patternUnits="userSpaceOnUse">
            <filter id="n">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix values="0 0 0 0 0.95 0 0 0 0 0.95 0 0 0 0 0.95 0 0 0 0.5 0" />
            </filter>
            <rect width="200" height="200" filter="url(#n)" opacity="0.06" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grain)" />
      </svg>

      <motion.svg
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        animate={{ x: panX, y: panY }}
        transition={{ type: "spring", stiffness: 90, damping: 22 }}
      >
        <defs>
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.18 0.04 245)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.14 0.04 235)" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="parkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.14 0.04 145)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="oklch(0.1 0.025 145)" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="bldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.14 0.005 270)" />
            <stop offset="100%" stopColor="oklch(0.09 0.005 270)" />
          </linearGradient>
        </defs>

        {/* River (Малая Алматинка) — diagonal */}
        <path
          d="M 4 50 C 18 46, 30 40, 38 32 S 62 18, 76 14 L 96 8 L 96 12 L 80 18 C 64 22, 50 30, 42 36 S 22 50, 4 54 Z"
          fill="url(#riverGrad)"
          opacity="0.55"
        />

        {/* Park: Парк Первого Президента */}
        <path
          d="M 60 40 L 78 38 L 80 50 L 64 52 Z"
          fill="url(#parkGrad)"
          stroke="oklch(0.25 0.05 145 / 0.3)"
          strokeWidth="0.25"
        />
        <text
          x="69"
          y="46"
          fill="oklch(0.45 0.05 145 / 0.6)"
          fontSize="2"
          letterSpacing="0.4"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
        >
          ПАРК
        </text>

        {/* Park: Центральный парк */}
        <path d="M 30 30 L 44 28 L 46 38 L 32 40 Z" fill="url(#parkGrad)" opacity="0.85" />
        <text
          x="38"
          y="35"
          fill="oklch(0.45 0.05 145 / 0.6)"
          fontSize="1.6"
          letterSpacing="0.3"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
        >
          ЦЕНТР. ПАРК
        </text>

        {/* City blocks — subtle faint fills to delineate neighborhoods */}
        {blocks.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill="oklch(0.07 0.005 270)"
            stroke="oklch(0.18 0.01 270 / 0.25)"
            strokeWidth="0.12"
            rx="0.4"
          />
        ))}

        {/* Building footprints */}
        {buildings.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill="url(#bldGrad)"
            stroke="oklch(0.32 0.01 270 / 0.45)"
            strokeWidth="0.08"
            rx="0.18"
            opacity={b.opacity}
          />
        ))}

        {/* Major roads — orthogonal grid w/ amber tint */}
        <g
          stroke="oklch(0.5 0.05 80 / 0.35)"
          strokeWidth="0.55"
          strokeLinecap="round"
          fill="none"
        >
          {/* East-west arteries */}
          <path d="M 0 14 L 100 14" />
          <path d="M 0 26 L 100 26" />
          <path d="M 0 38 L 100 38" />
          <path d="M 0 48 L 100 48" />
          {/* North-south arteries */}
          <path d="M 18 0 L 18 60" />
          <path d="M 36 0 L 36 60" />
          <path d="M 56 0 L 56 60" />
          <path d="M 74 0 L 74 60" />
          <path d="M 88 0 L 88 60" />
        </g>

        {/* Minor roads — finer */}
        <g
          stroke="oklch(0.32 0.02 80 / 0.22)"
          strokeWidth="0.18"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M 0 8 L 100 8" />
          <path d="M 0 20 L 100 20" />
          <path d="M 0 32 L 100 32" />
          <path d="M 0 44 L 100 44" />
          <path d="M 0 54 L 100 54" />
          <path d="M 9 0 L 9 60" />
          <path d="M 27 0 L 27 60" />
          <path d="M 45 0 L 45 60" />
          <path d="M 65 0 L 65 60" />
          <path d="M 81 0 L 81 60" />
          <path d="M 96 0 L 96 60" />
        </g>

        {/* Diagonal Достык / Аль-Фараби-style boulevard */}
        <path
          d="M 0 34 Q 35 30, 70 24 T 100 16"
          stroke="oklch(0.55 0.06 80 / 0.4)"
          strokeWidth="0.7"
          fill="none"
        />

        {/* District labels */}
        <g
          fill="oklch(0.65 0.02 80 / 0.55)"
          fontSize={compact ? "1.7" : "2"}
          letterSpacing="0.5"
          fontFamily="Inter, sans-serif"
        >
          <text x="14" y="9">МЕДЕУ</text>
          <text x="42" y="9">ЦЕНТР</text>
          <text x="78" y="9">САМАЛ</text>
          <text x="14" y="59">КОКТЕМ</text>
          <text x="42" y="59">АЛМАЛЫ</text>
          <text x="78" y="59">ДОСТЫК</text>
        </g>

        {/* Compass / north */}
        <g transform="translate(94, 4)">
          <circle r="2.4" fill="oklch(0.05 0.005 270)" stroke="oklch(0.5 0.05 80 / 0.5)" strokeWidth="0.18" />
          <path d="M 0 -1.6 L 0.5 0 L 0 0.4 L -0.5 0 Z" fill="oklch(0.86 0.13 85)" />
          <text
            x="0"
            y="-2.9"
            textAnchor="middle"
            fill="oklch(0.7 0.06 80)"
            fontSize="1.2"
            fontFamily="Inter, sans-serif"
          >
            С
          </text>
        </g>
      </motion.svg>

      {/* Markers / overlays */}
      <div className="absolute inset-0 pointer-events-none">{children}</div>
    </div>
  );
}

/** Generate a stable building grid (deterministic). */
function generateBuildings() {
  const rects: { x: number; y: number; w: number; h: number; opacity: number }[] = [];
  // Pseudo-deterministic
  let seed = 1729;
  const rng = () => {
    seed = (Math.imul(1103515245, seed) + 12345) | 0;
    return Math.abs(seed % 1000) / 1000;
  };

  // Block grid: 9 cols × 6 rows; each cell holds a few footprints
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 9; col++) {
      const cellX = col * 11 + 1;
      const cellY = row * 9 + 2;
      const count = 1 + Math.floor(rng() * 3);
      for (let i = 0; i < count; i++) {
        const w = 1.2 + rng() * 3.6;
        const h = 1.2 + rng() * 2.6;
        const x = cellX + rng() * (10 - w - 0.5);
        const y = cellY + rng() * (8 - h - 0.5);
        // skip if overlapping a park polygon roughly
        if (x > 28 && x < 48 && y > 26 && y < 42) continue;
        if (x > 58 && x < 82 && y > 36 && y < 54) continue;
        rects.push({ x, y, w, h, opacity: 0.7 + rng() * 0.3 });
      }
    }
  }
  return rects;
}

function generateBlocks() {
  // Subtle district fills — bigger soft block highlights.
  return [
    { x: 8, y: 4, w: 22, h: 8 }, // Медеу residential
    { x: 36, y: 4, w: 18, h: 8 }, // Центр
    { x: 60, y: 4, w: 28, h: 8 }, // Самал
    { x: 8, y: 50, w: 22, h: 8 },
    { x: 36, y: 50, w: 18, h: 8 },
    { x: 60, y: 50, w: 28, h: 8 },
  ];
}
