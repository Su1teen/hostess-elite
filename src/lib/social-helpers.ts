import type { Friend } from "@/types";
import { RESTAURANTS } from "@/data/restaurants";

export type StatusTone = "online" | "venue" | "busy" | "offline";

export function statusTone(status: Friend["status"]): StatusTone {
  switch (status) {
    case "В ресторане":
    case "На событии":
      return "venue";
    case "В пути":
    case "В салоне":
      return "online";
    case "Свободен":
      return "online";
    case "Дома":
      return "offline";
    default:
      return "offline";
  }
}

export function venueName(venueId: string | undefined): string | undefined {
  if (!venueId) return undefined;
  const r = RESTAURANTS.find((r) => r.id === venueId);
  return r?.name ?? venueId;
}
