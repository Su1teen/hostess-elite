export type Mood = "date" | "friends" | "business" | "family" | "celebration" | "solo";

export interface MoodConfig {
  id: Mood;
  label: string;
  emoji: string;
  description: string;
  gradient: string;
}

export type Cuisine =
  | "японская"
  | "итальянская"
  | "французская"
  | "грузинская"
  | "паназиатская"
  | "стейк-хаус"
  | "морепродукты"
  | "авторская"
  | "винный бар"
  | "коктейль-бар";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: Cuisine;
  description: string;
  longDescription: string;
  address: string;
  district: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  priceLevel: 2 | 3 | 4 | 5;
  averageBill: number; // ₸ per guest
  occupancy: number; // 0-100
  hours: string;
  isOpenNow: boolean;
  imageUrl: string;
  galleryUrls: string[];
  tags: string[];
  moods: Mood[];
  coordinates: { lat: number; lng: number };
  mapXY: { x: number; y: number }; // % position on stylized map
  hasLastMinute: boolean;
  lastMinuteDiscount?: number; // percent
  lastMinuteSeats?: number;
  vipRoom: boolean;
  signatureDish: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: "Закуски" | "Салаты" | "Супы" | "Основные" | "Гарниры" | "Десерты" | "Напитки" | "Вино" | "Сигнатурные";
  imageUrl: string;
  weight?: string;
  isSignature?: boolean;
  isVegetarian?: boolean;
  spicy?: 0 | 1 | 2;
}

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  number: number;
  seats: number;
  zone: "Зал" | "Терраса" | "VIP" | "Бар";
  available: boolean;
  x: number;
  y: number;
  shape: "rect" | "circle";
  width: number;
  height: number;
}

export interface Booking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  imageUrl: string;
  date: string; // ISO
  time: string; // 19:30
  guests: number;
  tableNumber: number;
  zone: string;
  status: "confirmed" | "pending" | "completed" | "cancelled" | "waitlist";
  deposit: number;
  preorderTotal: number;
  preorderItems: { itemId: string; name: string; qty: number; price: number }[];
  comment?: string;
  createdAt: string;
}

export interface WaitlistEntry {
  id: string;
  restaurantId: string;
  restaurantName: string;
  imageUrl: string;
  position: number;
  totalInQueue: number;
  estimatedWait: number; // minutes
  guests: number;
  joinedAt: string;
  notifyPush: boolean;
  notifySms: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  type: "Концерт" | "Вечеринка" | "Дегустация" | "Ужин" | "Стендап" | "Перформанс" | "Закрытый показ";
  venueName: string;
  venueId?: string;
  imageUrl: string;
  galleryUrls: string[];
  date: string; // ISO
  time: string;
  description: string;
  longDescription: string;
  priceFrom: number;
  ticketsLeft: number;
  totalTickets: number;
  artistsOrHosts: string[];
  ticketTypes: { id: string; name: string; price: number; perks: string[]; left: number }[];
  tags: string[];
}

export interface LoyaltyCard {
  id: string;
  restaurantId: string;
  restaurantName: string;
  tier: "Silver" | "Gold" | "Platinum" | "Black";
  cardNumber: string;
  visits: number;
  points: number;
  perks: string[];
  bgGradient: string;
  imageUrl: string;
  validUntil: string;
  qrPayload: string;
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: "В ресторане" | "В салоне" | "В пути" | "Дома" | "На событии" | "Свободен";
  statusLabel: string;
  statusVenue?: string;
  lastSeen: string;
  isOnApp: boolean;
  mood?: Mood;
  location: { x: number; y: number; lat: number; lng: number };
  mutualFriends: number;
  vipTier?: "Gold" | "Platinum" | "Black";
}

export interface ChatMessage {
  id: string;
  fromMe: boolean;
  text?: string;
  timestamp: string;
  type: "text" | "voice" | "image" | "booking-share" | "venue-share" | "event-share";
  attachmentTitle?: string;
  attachmentSubtitle?: string;
  attachmentImage?: string;
  voiceSeconds?: number;
  read?: boolean;
}

export interface Chat {
  friendId: string;
  messages: ChatMessage[];
  unread: number;
  lastMessagePreview: string;
  lastMessageAt: string;
  typing?: boolean;
}

export interface StoryItem {
  id: string;
  imageUrl: string;
  caption?: string;
  venueName?: string;
  postedAt: string;
  durationSec: number;
}

export interface StoryRing {
  id: string;
  authorName: string;
  authorAvatar: string;
  isMe?: boolean;
  viewed: boolean;
  items: StoryItem[];
}

export interface UserProfile {
  name: string;
  username: string;
  phone: string;
  avatar: string;
  city: string;
  tier: "Silver" | "Gold" | "Platinum" | "Black";
  visits: number;
  totalSpent: number;
  memberSince: string;
  bio: string;
  favoriteCuisine: Cuisine;
  pointsBalance: number;
}
