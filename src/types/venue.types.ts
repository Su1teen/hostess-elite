export type VenueCategory = "beauty" | "auto" | "restaurant" | "nightlife";

export interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  description: string;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  occupancy: number; // 0-100
  priceRange: string;
  operatingHours: string;
  imageUrl: string;
  galleryUrls: string[];
  coordinates: { x: number; y: number }; // mock map position (%)
  tags: string[];
  isOpen: boolean;
}

export interface MenuItem {
  id: string;
  venueId: string;
  name: string;
  description: string;
  price: number;
  category: "starters" | "mains" | "drinks" | "desserts" | "services";
  imageUrl: string;
  isPopular?: boolean;
}

export interface Table {
  id: string;
  venueId: string;
  number: number;
  seats: number;
  isAvailable: boolean;
  x: number; // SVG position
  y: number;
  width: number;
  height: number;
  shape: "rect" | "circle";
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  venueCategory: VenueCategory;
  date: string;
  time: string;
  guests: number;
  tableNumber: number;
  status: "upcoming" | "completed" | "cancelled";
  totalAmount: number;
  imageUrl: string;
}

export interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  tier: "Silver" | "Gold" | "Elite" | "Black";
  totalVisits: number;
  favoriteCategory: VenueCategory;
  totalSpent: number;
  memberSince: string;
}

export const CATEGORY_CONFIG: Record<VenueCategory, { label: string; colorClass: string; glowClass: string; dotClass: string }> = {
  beauty: { label: "Beauty", colorClass: "text-neon-burgundy", glowClass: "neon-glow-burgundy", dotClass: "bg-neon-burgundy" },
  auto: { label: "Auto", colorClass: "text-neon-cyan", glowClass: "neon-glow-cyan", dotClass: "bg-neon-cyan" },
  restaurant: { label: "Restaurants", colorClass: "text-neon-gold", glowClass: "neon-glow-gold", dotClass: "bg-neon-gold" },
  nightlife: { label: "Nightlife", colorClass: "text-neon-purple", glowClass: "neon-glow-purple", dotClass: "bg-neon-purple" },
};
