import type { Booking, Table, Review, UserProfile, TimeSlot } from "@/types/venue.types";

export const mockTables: Table[] = [
  // NOIR Steakhouse floor plan
  { id: "t1", venueId: "1", number: 1, seats: 2, isAvailable: true, x: 80, y: 80, width: 50, height: 50, shape: "circle" },
  { id: "t2", venueId: "1", number: 2, seats: 2, isAvailable: false, x: 180, y: 80, width: 50, height: 50, shape: "circle" },
  { id: "t3", venueId: "1", number: 3, seats: 4, isAvailable: true, x: 300, y: 80, width: 80, height: 50, shape: "rect" },
  { id: "t4", venueId: "1", number: 4, seats: 4, isAvailable: true, x: 80, y: 200, width: 80, height: 50, shape: "rect" },
  { id: "t5", venueId: "1", number: 5, seats: 6, isAvailable: false, x: 230, y: 200, width: 100, height: 60, shape: "rect" },
  { id: "t6", venueId: "1", number: 6, seats: 2, isAvailable: true, x: 400, y: 80, width: 50, height: 50, shape: "circle" },
  { id: "t7", venueId: "1", number: 7, seats: 8, isAvailable: true, x: 80, y: 320, width: 120, height: 60, shape: "rect" },
  { id: "t8", venueId: "1", number: 8, seats: 4, isAvailable: false, x: 280, y: 320, width: 80, height: 50, shape: "rect" },
  { id: "t9", venueId: "1", number: 9, seats: 2, isAvailable: true, x: 420, y: 200, width: 50, height: 50, shape: "circle" },
  { id: "t10", venueId: "1", number: 10, seats: 6, isAvailable: true, x: 400, y: 320, width: 100, height: 60, shape: "rect" },
];

export const mockTimeSlots: TimeSlot[] = [
  { time: "18:00", isAvailable: true },
  { time: "18:30", isAvailable: true },
  { time: "19:00", isAvailable: false },
  { time: "19:30", isAvailable: true },
  { time: "20:00", isAvailable: true },
  { time: "20:30", isAvailable: false },
  { time: "21:00", isAvailable: true },
  { time: "21:30", isAvailable: true },
  { time: "22:00", isAvailable: true },
  { time: "22:30", isAvailable: false },
];

export const mockBookings: Booking[] = [
  {
    id: "b1", venueId: "1", venueName: "NOIR Steakhouse", venueCategory: "restaurant",
    date: "2026-04-12", time: "20:00", guests: 2, tableNumber: 3,
    status: "upcoming", totalAmount: 180, imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
  },
  {
    id: "b2", venueId: "3", venueName: "The Blade Studio", venueCategory: "beauty",
    date: "2026-04-15", time: "14:00", guests: 1, tableNumber: 1,
    status: "upcoming", totalAmount: 45, imageUrl: "https://images.unsplash.com/photo-1585747860019-8e4e7687bf38?w=400&q=80",
  },
  {
    id: "b3", venueId: "2", venueName: "Velvet Lounge", venueCategory: "nightlife",
    date: "2026-04-05", time: "22:00", guests: 4, tableNumber: 7,
    status: "completed", totalAmount: 320, imageUrl: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&q=80",
  },
  {
    id: "b4", venueId: "8", venueName: "Ember & Oak", venueCategory: "restaurant",
    date: "2026-03-28", time: "19:30", guests: 2, tableNumber: 1,
    status: "completed", totalAmount: 95, imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=400&q=80",
  },
  {
    id: "b5", venueId: "4", venueName: "Obsidian Auto Spa", venueCategory: "auto",
    date: "2026-03-20", time: "10:00", guests: 1, tableNumber: 1,
    status: "completed", totalAmount: 250, imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&q=80",
  },
];

export const mockReviews: Review[] = [
  { id: "r1", userName: "Alexander M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", rating: 5, text: "Absolutely phenomenal experience. The wagyu tartare alone is worth the visit.", date: "2026-04-01" },
  { id: "r2", userName: "Elena K.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", rating: 5, text: "Impeccable service and atmosphere. The sommelier's wine pairing was exceptional.", date: "2026-03-28" },
  { id: "r3", userName: "James W.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", rating: 4, text: "Great steaks but the wait was a bit long on a Saturday. Still a top-tier restaurant.", date: "2026-03-25" },
];

export const mockUserProfile: UserProfile = {
  name: "Maxim Volkov",
  avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
  tier: "Elite",
  totalVisits: 47,
  favoriteCategory: "restaurant",
  totalSpent: 8450,
  memberSince: "2025-01",
};
