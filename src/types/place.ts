import type { Restaurant } from "./index";

export type PlaceCategory =
  | "restaurant"
  | "bar"
  | "barber"
  | "spa"
  | "medical"
  | "carwash"
  | "dentistry";

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  restaurant: "Ресторан",
  bar: "Бар",
  barber: "Барбершоп",
  spa: "Спа",
  medical: "Мед. центр",
  carwash: "Автомойка",
  dentistry: "Стоматология",
};

export const CATEGORY_PLURAL: Record<PlaceCategory, string> = {
  restaurant: "Рестораны",
  bar: "Бары",
  barber: "Барбершопы",
  spa: "Спа",
  medical: "Мед. центры",
  carwash: "Автомойки",
  dentistry: "Стоматологии",
};

/**
 * Universal place — covers restaurants, bars, barbers, spas, medical, car wash, dentistry.
 * Bookable establishments (restaurants/bars) are typed via `Restaurant` which extends this.
 */
export interface Place {
  id: string;
  category: PlaceCategory;
  name: string;
  /** A short subtitle: cuisine for restaurants, "мужской · бритьё" for barbers, etc. */
  subtitle: string;
  description: string;
  longDescription: string;
  address: string;
  district: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  /** 0–100, used for map ring + UI tag. */
  occupancy: number;
  hours: string;
  isOpenNow: boolean;
  imageUrl: string;
  galleryUrls: string[];
  tags: string[];
  /** Coordinates on the stylized basemap, percentages 0–100. */
  mapXY: { x: number; y: number };
  /** "Average bill" for restaurants, typical visit price otherwise. */
  averagePrice: number;
  vipRoom?: boolean;
  hasLastMinute?: boolean;
  lastMinuteDiscount?: number;
}

/** Non-restaurant places (barbers, spas, etc.). */
export type ServicePlace = Omit<Place, "category"> & {
  category: Exclude<PlaceCategory, "restaurant" | "bar">;
};

/** Helper used by the home/map drawer to treat restaurants and service places uniformly. */
export interface PlaceListItem {
  id: string;
  category: PlaceCategory;
  name: string;
  subtitle: string;
  district: string;
  distanceKm: number;
  rating: number;
  occupancy: number;
  hours: string;
  imageUrl: string;
  averagePrice: number;
  mapXY: { x: number; y: number };
  vipRoom?: boolean;
  hasLastMinute?: boolean;
  lastMinuteDiscount?: number;
  /** Restaurants are routed to /restaurant/:id; service places have their own modal/profile. */
  href?: string;
}

export type AnyPlace = Restaurant | ServicePlace;
