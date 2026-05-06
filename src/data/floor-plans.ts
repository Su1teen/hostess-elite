/**
 * Architectural floor plan layouts per restaurant.
 *
 * Coordinates use a 100x60 viewport (16:9.6 aspect). Walls are SVG path
 * commands; doors are arcs; windows are double-line segments; tables are
 * placed by center coordinate (cx, cy) with explicit shape and seat capacity.
 */

export type WallSegment = string; // SVG path "d" command
export type DoorArc = { cx: number; cy: number; r: number; startAngle: number; endAngle: number };
export type WindowSeg = { x1: number; y1: number; x2: number; y2: number };
export type FixtureRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  variant?: "bar" | "kitchen" | "wc" | "entrance" | "lounge" | "stage" | "host";
};
export type FloorTable = {
  number: number;
  cx: number;
  cy: number;
  seats: number;
  shape: "rect" | "round" | "booth";
  rotation?: number; // degrees, only for rect/booth
  zone: "Зал" | "Терраса" | "VIP" | "Бар";
  available: boolean;
};

export interface FloorPlan {
  /** outer perimeter as SVG `d`. */
  perimeter: string;
  /** internal partition walls. */
  walls: WallSegment[];
  /** door arcs. */
  doors: DoorArc[];
  /** windows (double-line segments). */
  windows: WindowSeg[];
  /** static fixtures — bar, kitchen, WC, entrance, lounge. */
  fixtures: FixtureRect[];
  tables: FloorTable[];
  /** legend of zone tints, e.g. terrace lighter. */
  zones?: { x: number; y: number; w: number; h: number; label: string; tint: "terrace" | "vip" }[];
}

const noir: FloorPlan = {
  perimeter:
    "M 4 6 L 96 6 L 96 30 L 84 30 L 84 36 L 96 36 L 96 54 L 4 54 Z",
  walls: [
    "M 60 6 L 60 22", // host area divider
    "M 60 22 L 84 22", // host divider lateral
    "M 84 22 L 84 30", // wc/host wall
    "M 4 36 L 38 36", // back-of-house top
    "M 38 36 L 38 54", // BOH right
    "M 4 22 L 22 22", // private dining alcove
    "M 22 22 L 22 6", // private dining vertical
  ],
  doors: [
    { cx: 50, cy: 6, r: 4, startAngle: 0, endAngle: 90 }, // main entrance arc
    { cx: 22, cy: 22, r: 3, startAngle: 90, endAngle: 180 }, // private dining
    { cx: 38, cy: 42, r: 3, startAngle: 0, endAngle: 90 }, // BOH
  ],
  windows: [
    { x1: 8, y1: 6, x2: 18, y2: 6 },
    { x1: 26, y1: 6, x2: 46, y2: 6 },
    { x1: 64, y1: 6, x2: 80, y2: 6 },
    { x1: 88, y1: 6, x2: 96, y2: 18 },
  ],
  fixtures: [
    { x: 4, y: 36, w: 34, h: 18, label: "Кухня", variant: "kitchen" },
    { x: 84, y: 30, w: 12, h: 6, label: "WC", variant: "wc" },
    { x: 60, y: 6, w: 24, h: 16, label: "Бар", variant: "bar" },
    { x: 46, y: 4, w: 8, h: 4, label: "Вход", variant: "entrance" },
    { x: 4, y: 6, w: 18, h: 16, variant: "lounge" }, // private alcove tint
  ],
  zones: [
    { x: 4, y: 6, w: 18, h: 16, label: "Приватный зал", tint: "vip" },
  ],
  tables: [
    // Private dining alcove (VIP)
    { number: 1, cx: 9, cy: 13, seats: 4, shape: "round", zone: "VIP", available: true },
    { number: 2, cx: 17, cy: 13, seats: 4, shape: "round", zone: "VIP", available: false },
    // Main hall — high-back booths along window
    { number: 3, cx: 30, cy: 12, seats: 4, shape: "booth", zone: "Зал", available: true },
    { number: 4, cx: 42, cy: 12, seats: 4, shape: "booth", zone: "Зал", available: true },
    { number: 5, cx: 54, cy: 12, seats: 2, shape: "round", zone: "Зал", available: true },
    // Mid hall round tops
    { number: 6, cx: 30, cy: 28, seats: 4, shape: "round", zone: "Зал", available: false },
    { number: 7, cx: 44, cy: 28, seats: 6, shape: "rect", zone: "Зал", available: true },
    { number: 8, cx: 56, cy: 28, seats: 4, shape: "round", zone: "Зал", available: true },
    // Bar-side
    { number: 9, cx: 70, cy: 26, seats: 2, shape: "round", zone: "Бар", available: true },
    { number: 10, cx: 78, cy: 26, seats: 2, shape: "round", zone: "Бар", available: false },
    // Front hall larger groups
    { number: 11, cx: 50, cy: 44, seats: 8, shape: "rect", zone: "Зал", available: true },
    { number: 12, cx: 70, cy: 44, seats: 6, shape: "rect", zone: "Зал", available: true },
    { number: 13, cx: 86, cy: 44, seats: 4, shape: "round", zone: "Зал", available: true },
  ],
};

const velvet: FloorPlan = {
  perimeter: "M 4 4 L 96 4 L 96 56 L 4 56 Z",
  walls: [
    "M 4 18 L 60 18", // bar divider
    "M 60 4 L 60 18", // bar wall
    "M 76 18 L 96 18", // back wall
    "M 76 18 L 76 38", // booth divider
    "M 4 38 L 76 38", // terrace divider
  ],
  doors: [
    { cx: 50, cy: 4, r: 4, startAngle: 0, endAngle: 90 },
    { cx: 60, cy: 18, r: 3, startAngle: 90, endAngle: 180 },
  ],
  windows: [
    { x1: 4, y1: 38, x2: 76, y2: 38 }, // terrace glass
    { x1: 96, y1: 8, x2: 96, y2: 36 },
  ],
  fixtures: [
    { x: 4, y: 4, w: 56, h: 14, label: "Бар · DJ", variant: "bar" },
    { x: 76, y: 4, w: 20, h: 14, label: "WC · Lounge", variant: "wc" },
    { x: 46, y: 2, w: 8, h: 4, label: "Вход", variant: "entrance" },
  ],
  zones: [
    { x: 4, y: 38, w: 92, h: 18, label: "Терраса", tint: "terrace" },
  ],
  tables: [
    // Bar-stool tables along the bar
    { number: 1, cx: 12, cy: 24, seats: 2, shape: "round", zone: "Бар", available: true },
    { number: 2, cx: 22, cy: 24, seats: 2, shape: "round", zone: "Бар", available: true },
    { number: 3, cx: 32, cy: 24, seats: 2, shape: "round", zone: "Бар", available: false },
    { number: 4, cx: 42, cy: 24, seats: 2, shape: "round", zone: "Бар", available: true },
    { number: 5, cx: 52, cy: 24, seats: 2, shape: "round", zone: "Бар", available: false },
    // VIP booths (right)
    { number: 6, cx: 84, cy: 24, seats: 8, shape: "booth", zone: "VIP", available: true },
    { number: 7, cx: 84, cy: 32, seats: 6, shape: "booth", zone: "VIP", available: true },
    // Lounge couches mid
    { number: 8, cx: 14, cy: 32, seats: 4, shape: "round", zone: "Зал", available: true },
    { number: 9, cx: 30, cy: 32, seats: 4, shape: "round", zone: "Зал", available: false },
    { number: 10, cx: 46, cy: 32, seats: 4, shape: "round", zone: "Зал", available: true },
    { number: 11, cx: 62, cy: 32, seats: 4, shape: "round", zone: "Зал", available: false },
    // Terrace
    { number: 12, cx: 14, cy: 48, seats: 2, shape: "round", zone: "Терраса", available: true },
    { number: 13, cx: 28, cy: 48, seats: 4, shape: "rect", zone: "Терраса", available: true },
    { number: 14, cx: 46, cy: 48, seats: 4, shape: "rect", zone: "Терраса", available: false },
    { number: 15, cx: 64, cy: 48, seats: 6, shape: "rect", zone: "Терраса", available: true },
    { number: 16, cx: 84, cy: 48, seats: 8, shape: "rect", zone: "Терраса", available: true },
  ],
};

const tartufo: FloorPlan = {
  perimeter: "M 4 4 L 96 4 L 96 56 L 4 56 Z",
  walls: [
    "M 4 36 L 60 36",
    "M 60 36 L 60 56",
    "M 72 4 L 72 22",
    "M 72 22 L 96 22",
  ],
  doors: [
    { cx: 50, cy: 4, r: 4, startAngle: 0, endAngle: 90 },
    { cx: 60, cy: 36, r: 3, startAngle: 90, endAngle: 180 },
  ],
  windows: [
    { x1: 8, y1: 4, x2: 26, y2: 4 },
    { x1: 32, y1: 4, x2: 46, y2: 4 },
    { x1: 4, y1: 12, x2: 4, y2: 30 },
  ],
  fixtures: [
    { x: 72, y: 4, w: 24, h: 18, label: "Открытая кухня", variant: "kitchen" },
    { x: 72, y: 22, w: 24, h: 8, label: "Бар · трюфель", variant: "bar" },
    { x: 60, y: 36, w: 36, h: 20, label: "WC · Lounge", variant: "wc" },
    { x: 46, y: 2, w: 8, h: 4, label: "Вход", variant: "entrance" },
  ],
  tables: [
    { number: 1, cx: 14, cy: 14, seats: 2, shape: "round", zone: "Зал", available: true },
    { number: 2, cx: 26, cy: 14, seats: 2, shape: "round", zone: "Зал", available: true },
    { number: 3, cx: 38, cy: 14, seats: 4, shape: "rect", zone: "Зал", available: false },
    { number: 4, cx: 54, cy: 14, seats: 4, shape: "rect", zone: "Зал", available: true },
    { number: 5, cx: 14, cy: 28, seats: 4, shape: "round", zone: "Зал", available: true },
    { number: 6, cx: 30, cy: 28, seats: 6, shape: "rect", zone: "Зал", available: true },
    { number: 7, cx: 50, cy: 28, seats: 8, shape: "rect", zone: "Зал", available: false },
    { number: 8, cx: 14, cy: 46, seats: 4, shape: "rect", zone: "Зал", available: true },
    { number: 9, cx: 30, cy: 46, seats: 4, shape: "rect", zone: "Зал", available: true },
    { number: 10, cx: 46, cy: 46, seats: 6, shape: "rect", zone: "Зал", available: true },
    { number: 11, cx: 84, cy: 32, seats: 2, shape: "round", zone: "Бар", available: true },
    { number: 12, cx: 84, cy: 42, seats: 2, shape: "round", zone: "Бар", available: false },
  ],
};

const atelier: FloorPlan = {
  // 1 chef-counter, single open kitchen
  perimeter: "M 8 8 L 92 8 L 92 52 L 8 52 Z",
  walls: [
    "M 8 32 L 92 32", // counter line
    "M 30 32 L 30 52", // back-of-house left
    "M 70 32 L 70 52", // back-of-house right
  ],
  doors: [
    { cx: 50, cy: 8, r: 4, startAngle: 0, endAngle: 90 },
    { cx: 30, cy: 42, r: 3, startAngle: 0, endAngle: 90 },
  ],
  windows: [
    { x1: 12, y1: 8, x2: 24, y2: 8 },
    { x1: 76, y1: 8, x2: 88, y2: 8 },
  ],
  fixtures: [
    { x: 30, y: 32, w: 40, h: 20, label: "Кухня шефа", variant: "kitchen" },
    { x: 70, y: 36, w: 22, h: 16, label: "WC", variant: "wc" },
    { x: 8, y: 36, w: 22, h: 16, label: "Lounge", variant: "lounge" },
    { x: 12, y: 18, w: 76, h: 8, label: "Стойка шефа", variant: "host" },
    { x: 46, y: 6, w: 8, h: 4, label: "Вход", variant: "entrance" },
  ],
  tables: [
    // 11 seats along the chef's counter (single table — see name "Atelier 11")
    { number: 1, cx: 16, cy: 22, seats: 1, shape: "round", zone: "Зал", available: true },
    { number: 2, cx: 23, cy: 22, seats: 1, shape: "round", zone: "Зал", available: false },
    { number: 3, cx: 30, cy: 22, seats: 1, shape: "round", zone: "Зал", available: true },
    { number: 4, cx: 37, cy: 22, seats: 1, shape: "round", zone: "Зал", available: true },
    { number: 5, cx: 44, cy: 22, seats: 1, shape: "round", zone: "Зал", available: false },
    { number: 6, cx: 51, cy: 22, seats: 1, shape: "round", zone: "Зал", available: true },
    { number: 7, cx: 58, cy: 22, seats: 1, shape: "round", zone: "Зал", available: true },
    { number: 8, cx: 65, cy: 22, seats: 1, shape: "round", zone: "Зал", available: true },
    { number: 9, cx: 72, cy: 22, seats: 1, shape: "round", zone: "Зал", available: false },
    { number: 10, cx: 79, cy: 22, seats: 1, shape: "round", zone: "Зал", available: true },
    { number: 11, cx: 86, cy: 22, seats: 1, shape: "round", zone: "Зал", available: true },
  ],
};

/** Generic floorplan generator for restaurants without a custom layout. */
function genericPlan(seed: string): FloorPlan {
  // Deterministic pseudo-random by hash of seed for stability.
  let h = 0;
  for (const c of seed) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  const rng = () => {
    h = (Math.imul(1103515245, h) + 12345) | 0;
    return Math.abs(h % 1000) / 1000;
  };
  const tables: FloorTable[] = [];
  // 12 tables in 3 rows × 4 cols grid with offsets
  let n = 1;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const cx = 14 + col * 18 + (rng() - 0.5) * 4;
      const cy = 16 + row * 12 + (rng() - 0.5) * 3;
      const seats = [2, 2, 4, 4, 6][Math.floor(rng() * 5)];
      const shape: FloorTable["shape"] = rng() > 0.6 ? "rect" : "round";
      const available = rng() > 0.35;
      tables.push({
        number: n++,
        cx,
        cy,
        seats,
        shape,
        zone: row === 2 ? "Терраса" : "Зал",
        available,
      });
    }
  }
  return {
    perimeter: "M 4 4 L 96 4 L 96 56 L 4 56 Z",
    walls: ["M 4 44 L 96 44"],
    doors: [{ cx: 50, cy: 4, r: 4, startAngle: 0, endAngle: 90 }],
    windows: [
      { x1: 8, y1: 4, x2: 28, y2: 4 },
      { x1: 36, y1: 4, x2: 46, y2: 4 },
      { x1: 60, y1: 4, x2: 88, y2: 4 },
    ],
    fixtures: [
      { x: 4, y: 44, w: 96, h: 12, label: "Терраса", variant: "lounge" },
      { x: 4, y: 4, w: 12, h: 14, label: "Бар", variant: "bar" },
      { x: 84, y: 4, w: 12, h: 8, label: "WC", variant: "wc" },
      { x: 46, y: 2, w: 8, h: 4, label: "Вход", variant: "entrance" },
    ],
    zones: [{ x: 4, y: 44, w: 92, h: 12, label: "Терраса", tint: "terrace" }],
    tables,
  };
}

export const FLOOR_PLANS: Record<string, FloorPlan> = {
  noir,
  velvet,
  tartufo,
  atelier,
};

export function getFloorPlan(restaurantId: string): FloorPlan {
  return FLOOR_PLANS[restaurantId] ?? genericPlan(restaurantId);
}
