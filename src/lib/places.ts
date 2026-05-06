import { RESTAURANTS } from "@/data/restaurants";
import { SERVICE_PLACES } from "@/data/places";
import type { PlaceListItem, PlaceCategory } from "@/types/place";

/** Restaurants converted to the universal place shape used by the map+drawer. */
export function restaurantsAsPlaces(): PlaceListItem[] {
  return RESTAURANTS.map((r) => ({
    id: r.id,
    category: "restaurant" as PlaceCategory,
    name: r.name,
    subtitle: `${r.cuisine} · средний чек ${r.averageBill.toLocaleString("ru-RU")} ₸`,
    district: r.district,
    distanceKm: r.distanceKm,
    rating: r.rating,
    occupancy: r.occupancy,
    hours: r.hours,
    imageUrl: r.imageUrl,
    averagePrice: r.averageBill,
    mapXY: r.mapXY,
    vipRoom: r.vipRoom,
    hasLastMinute: r.hasLastMinute,
    lastMinuteDiscount: r.lastMinuteDiscount,
    href: `/restaurant/${r.id}`,
  }));
}

export function servicesAsPlaces(): PlaceListItem[] {
  return SERVICE_PLACES.map((p) => ({
    id: p.id,
    category: p.category,
    name: p.name,
    subtitle: `${p.subtitle} · от ${p.averagePrice.toLocaleString("ru-RU")} ₸`,
    district: p.district,
    distanceKm: p.distanceKm,
    rating: p.rating,
    occupancy: p.occupancy,
    hours: p.hours,
    imageUrl: p.imageUrl,
    averagePrice: p.averagePrice,
    mapXY: p.mapXY,
    vipRoom: p.vipRoom,
    hasLastMinute: p.hasLastMinute,
    lastMinuteDiscount: p.lastMinuteDiscount,
    href: `/place/${p.id}`,
  }));
}

export function allPlaces(): PlaceListItem[] {
  return [...restaurantsAsPlaces(), ...servicesAsPlaces()];
}

export function occupancyBucket(occ: number): "low" | "moderate" | "high" {
  if (occ <= 50) return "low";
  if (occ < 80) return "moderate";
  return "high";
}

export const OCCUPANCY_TONE: Record<
  "low" | "moderate" | "high",
  { ring: string; dot: string; label: string }
> = {
  low: {
    ring: "oklch(0.8 0.18 145)", // emerald
    dot: "bg-emerald-400",
    label: "Свободно",
  },
  moderate: {
    ring: "oklch(0.85 0.16 85)", // gold/amber
    dot: "bg-amber-400",
    label: "Средне",
  },
  high: {
    ring: "oklch(0.62 0.21 25)", // burgundy/red
    dot: "bg-rose-400",
    label: "Загружено",
  },
};
