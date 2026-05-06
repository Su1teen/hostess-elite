import { motion } from "framer-motion";
import type { FloorPlan as FloorPlanData, FloorTable } from "@/data/floor-plans";
import { cn } from "@/lib/utils";

interface Props {
  plan: FloorPlanData;
  selectedTable: number | null;
  onSelect: (tableNumber: number) => void;
  /** disable selecting tables (read-only preview) */
  readOnly?: boolean;
}

/**
 * Architectural floor plan for restaurant booking.
 *
 * Renders walls (paths), windows (double lines), doors (arcs), fixtures
 * (bar/kitchen/WC/entrance) and color-coded numbered tables. Coordinates
 * use a 100x60 viewport.
 */
export function FloorPlan({ plan, selectedTable, onSelect, readOnly = false }: Props) {
  return (
    <div className="relative w-full aspect-[100/60] rounded-2xl overflow-hidden border border-white/[0.08] bg-[radial-gradient(ellipse_at_center,oklch(0.1_0.012_270)_0%,oklch(0.05_0.005_270)_100%)]">
      {/* Faint architectural grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" preserveAspectRatio="none">
        <defs>
          <pattern id="grid-fp" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-fp)" />
      </svg>

      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="floor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.09 0.005 270 / 0.85)" />
            <stop offset="100%" stopColor="oklch(0.06 0.005 270 / 0.95)" />
          </linearGradient>
          <linearGradient id="terraceTint" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.16 0.05 145 / 0.18)" />
            <stop offset="100%" stopColor="oklch(0.12 0.04 145 / 0.1)" />
          </linearGradient>
          <linearGradient id="vipTint" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.22 0.08 30 / 0.18)" />
            <stop offset="100%" stopColor="oklch(0.16 0.06 30 / 0.1)" />
          </linearGradient>
        </defs>

        {/* Floor body */}
        <path d={plan.perimeter} fill="url(#floor)" stroke="oklch(0.55 0.02 80 / 0.65)" strokeWidth="0.35" strokeLinejoin="round" />

        {/* Zone tints (terrace / vip) */}
        {plan.zones?.map((z, i) => (
          <rect
            key={i}
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            fill={z.tint === "terrace" ? "url(#terraceTint)" : "url(#vipTint)"}
            stroke="oklch(1 0 0 / 0.06)"
            strokeWidth="0.18"
            strokeDasharray="0.6 0.6"
          />
        ))}

        {/* Internal walls */}
        <g stroke="oklch(0.55 0.02 80 / 0.55)" strokeWidth="0.28" strokeLinecap="round" fill="none">
          {plan.walls.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Windows — double-line */}
        <g stroke="oklch(0.78 0.05 230 / 0.7)" strokeWidth="0.22" strokeLinecap="round" fill="none">
          {plan.windows.map((w, i) => (
            <g key={i}>
              <line x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2} />
              <line
                x1={w.x1}
                y1={w.y1 + (w.x1 === w.x2 ? 0 : 0.55)}
                x2={w.x2}
                y2={w.y2 + (w.x1 === w.x2 ? 0 : 0.55)}
                opacity="0.5"
              />
              {w.x1 === w.x2 && (
                <line
                  x1={w.x1 + 0.55}
                  y1={w.y1}
                  x2={w.x2 + 0.55}
                  y2={w.y2}
                  opacity="0.5"
                />
              )}
            </g>
          ))}
        </g>

        {/* Doors — arcs */}
        <g stroke="oklch(0.86 0.13 85 / 0.55)" strokeWidth="0.22" fill="none">
          {plan.doors.map((d, i) => {
            const sx = d.cx + d.r * Math.cos((d.startAngle * Math.PI) / 180);
            const sy = d.cy + d.r * Math.sin((d.startAngle * Math.PI) / 180);
            const ex = d.cx + d.r * Math.cos((d.endAngle * Math.PI) / 180);
            const ey = d.cy + d.r * Math.sin((d.endAngle * Math.PI) / 180);
            const path = `M ${sx} ${sy} A ${d.r} ${d.r} 0 0 1 ${ex} ${ey}`;
            return (
              <g key={i}>
                <path d={path} />
                <line x1={d.cx} y1={d.cy} x2={sx} y2={sy} opacity="0.7" />
              </g>
            );
          })}
        </g>

        {/* Fixtures (bar / kitchen / wc / entrance) */}
        {plan.fixtures.map((f, i) => {
          const fillByVariant: Record<string, string> = {
            bar: "oklch(0.18 0.04 30 / 0.55)",
            kitchen: "oklch(0.14 0.02 80 / 0.55)",
            wc: "oklch(0.12 0.02 220 / 0.45)",
            entrance: "oklch(0.86 0.13 85 / 0.18)",
            lounge: "oklch(0.15 0.04 320 / 0.4)",
            host: "oklch(0.18 0.05 30 / 0.6)",
            stage: "oklch(0.18 0.07 320 / 0.45)",
          };
          const variant = f.variant ?? "bar";
          return (
            <g key={i}>
              <rect
                x={f.x}
                y={f.y}
                width={f.w}
                height={f.h}
                rx="0.5"
                fill={fillByVariant[variant]}
                stroke="oklch(0.5 0.02 80 / 0.45)"
                strokeWidth="0.2"
              />
              {/* Hatched pattern on kitchen */}
              {variant === "kitchen" && (
                <g
                  stroke="oklch(0.5 0.02 80 / 0.35)"
                  strokeWidth="0.12"
                  strokeLinecap="round"
                >
                  {Array.from({ length: Math.ceil(f.w / 2) }).map((_, idx) => (
                    <line
                      key={idx}
                      x1={f.x + idx * 2}
                      y1={f.y}
                      x2={f.x + idx * 2 - f.h * 0.6}
                      y2={f.y + f.h}
                    />
                  ))}
                </g>
              )}
              {f.label && (
                <text
                  x={f.x + f.w / 2}
                  y={f.y + f.h / 2 + 0.6}
                  textAnchor="middle"
                  fill="oklch(0.78 0.04 80 / 0.85)"
                  fontSize="1.6"
                  letterSpacing="0.4"
                  fontFamily="Inter, sans-serif"
                  fontWeight={500}
                >
                  {f.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Tables */}
        {plan.tables.map((t) => (
          <TableShape
            key={t.number}
            t={t}
            selected={selectedTable === t.number}
            onClick={() => !readOnly && t.available && onSelect(t.number)}
            readOnly={readOnly}
          />
        ))}
      </svg>
    </div>
  );
}

function TableShape({
  t,
  selected,
  onClick,
  readOnly,
}: {
  t: FloorTable;
  selected: boolean;
  onClick: () => void;
  readOnly: boolean;
}) {
  const occupied = !t.available;
  const tone = selected
    ? { stroke: "oklch(0.86 0.13 85)", fill: "oklch(0.86 0.13 85 / 0.85)", text: "oklch(0.05 0 0)" }
    : occupied
      ? { stroke: "oklch(0.6 0.16 25 / 0.7)", fill: "oklch(0.4 0.14 25 / 0.4)", text: "oklch(0.85 0.06 30 / 0.85)" }
      : { stroke: "oklch(0.78 0.18 145 / 0.85)", fill: "oklch(0.4 0.16 145 / 0.45)", text: "oklch(0.95 0.04 145)" };

  // chair dot positions around table
  const chairs = chairsAround(t);

  // table size (units)
  const w = t.shape === "round" ? 4 : t.shape === "booth" ? 8 : Math.max(4, t.seats * 1.2);
  const h = t.shape === "round" ? 4 : 4;

  return (
    <g
      transform={`translate(${t.cx} ${t.cy})${t.rotation ? ` rotate(${t.rotation})` : ""}`}
      style={{ cursor: occupied || readOnly ? "default" : "pointer" }}
      onClick={onClick}
    >
      {/* Chairs */}
      {chairs.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r={0.55}
          fill="oklch(0.18 0.01 270 / 0.85)"
          stroke={tone.stroke}
          strokeWidth="0.18"
        />
      ))}

      {/* Table */}
      {t.shape === "round" ? (
        <motion.circle
          cx={0}
          cy={0}
          r={w / 2}
          fill={tone.fill}
          stroke={tone.stroke}
          strokeWidth="0.35"
          whileHover={!occupied && !readOnly ? { scale: 1.06 } : undefined}
          whileTap={!occupied && !readOnly ? { scale: 0.96 } : undefined}
          style={{
            filter: selected ? "drop-shadow(0 0 4px oklch(0.86 0.13 85))" : undefined,
          }}
        />
      ) : (
        <motion.rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={t.shape === "booth" ? 1.2 : 0.6}
          fill={tone.fill}
          stroke={tone.stroke}
          strokeWidth="0.35"
          whileHover={!occupied && !readOnly ? { scale: 1.06 } : undefined}
          whileTap={!occupied && !readOnly ? { scale: 0.96 } : undefined}
          style={{
            filter: selected ? "drop-shadow(0 0 4px oklch(0.86 0.13 85))" : undefined,
          }}
        />
      )}

      <text
        x={0}
        y={0.6}
        textAnchor="middle"
        fontSize="1.7"
        fontWeight={700}
        fontFamily="Inter, sans-serif"
        fill={tone.text}
      >
        {t.number}
      </text>
    </g>
  );
}

function chairsAround(t: FloorTable) {
  const chairs: { x: number; y: number }[] = [];
  if (t.shape === "round") {
    for (let i = 0; i < t.seats; i++) {
      const a = (i / t.seats) * Math.PI * 2 - Math.PI / 2;
      chairs.push({ x: Math.cos(a) * 3, y: Math.sin(a) * 3 });
    }
  } else if (t.shape === "booth") {
    // chairs on one side
    const w = 8;
    const half = (t.seats - 1) / 2;
    for (let i = 0; i < t.seats; i++) {
      chairs.push({ x: (i - half) * (w / t.seats), y: 2.6 });
    }
  } else {
    // rect — chairs on top + bottom
    const w = Math.max(4, t.seats * 1.2);
    const perSide = Math.ceil(t.seats / 2);
    for (let i = 0; i < perSide; i++) {
      chairs.push({ x: -w / 2 + ((i + 0.5) * w) / perSide, y: -2.6 });
    }
    for (let i = 0; i < t.seats - perSide; i++) {
      chairs.push({ x: -w / 2 + ((i + 0.5) * w) / (t.seats - perSide || 1), y: 2.6 });
    }
  }
  return chairs;
}
