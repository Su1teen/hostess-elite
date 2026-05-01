import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Booking,
  Chat,
  ChatMessage,
  LoyaltyCard,
  StoryRing,
  UserProfile,
  WaitlistEntry,
} from "@/types";
import { CHATS, STORIES, WAITLIST_PRESETS } from "@/data/social";
import { LOYALTY_CARDS } from "@/data/wallet";
import { getRestaurantById } from "@/data/restaurants";

const DEFAULT_PROFILE: UserProfile = {
  name: "Султан Советов",
  username: "@sultan",
  phone: "+7 (701) 555-44-21",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop",
  city: "Алматы",
  tier: "Platinum",
  visits: 87,
  totalSpent: 4_280_000,
  memberSince: "март 2023",
  bio: "Гастрономия, винтаж, тёплый виниловый звук",
  favoriteCuisine: "стейк-хаус",
  pointsBalance: 96420,
};

const seedBookings = (): Booking[] => {
  const now = new Date();
  const future = new Date(now);
  future.setDate(future.getDate() + 1);
  future.setHours(20, 0, 0, 0);
  const past = new Date(now);
  past.setDate(past.getDate() - 6);
  past.setHours(21, 0, 0, 0);
  const noir = getRestaurantById("noir")!;
  const tartufo = getRestaurantById("tartufo")!;
  return [
    {
      id: "bk-1",
      restaurantId: noir.id,
      restaurantName: noir.name,
      imageUrl: noir.imageUrl,
      date: future.toISOString(),
      time: "20:00",
      guests: 2,
      tableNumber: 3,
      zone: "Зал",
      status: "confirmed",
      deposit: 30000,
      preorderTotal: 18600,
      preorderItems: [
        { itemId: "noir-1", name: "Тартар из говядины", qty: 2, price: 7800 },
        { itemId: "noir-15", name: "Алматинский закат", qty: 2, price: 4800 },
      ],
      comment: "Стол у окна, без пряностей",
      createdAt: new Date(now.getTime() - 3600_000).toISOString(),
    },
    {
      id: "bk-2",
      restaurantId: tartufo.id,
      restaurantName: tartufo.name,
      imageUrl: tartufo.imageUrl,
      date: past.toISOString(),
      time: "21:00",
      guests: 4,
      tableNumber: 5,
      zone: "Зал",
      status: "completed",
      deposit: 20000,
      preorderTotal: 0,
      preorderItems: [],
      createdAt: new Date(now.getTime() - 86400_000 * 7).toISOString(),
    },
  ];
};

const seedWaitlist = (): WaitlistEntry[] =>
  WAITLIST_PRESETS.map((p, idx) => {
    const r = getRestaurantById(p.restaurantId)!;
    return {
      id: `wl-${idx + 1}`,
      restaurantId: r.id,
      restaurantName: r.name,
      imageUrl: r.imageUrl,
      position: p.position,
      totalInQueue: p.totalInQueue,
      estimatedWait: p.estimatedWait,
      guests: p.guests,
      joinedAt: new Date(Date.now() - 1000 * 60 * (p.estimatedWait / 2)).toISOString(),
      notifyPush: true,
      notifySms: idx === 0,
    };
  });

interface AppState {
  // Auth
  isAuthenticated: boolean;
  authPhone: string;
  setAuthPhone: (p: string) => void;
  signIn: () => void;
  signOut: () => void;

  // Profile
  profile: UserProfile;
  setProfile: (patch: Partial<UserProfile>) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  cancelBooking: (id: string) => void;

  // Pre-order cart (per current booking flow)
  cart: { restaurantId: string | null; items: Record<string, number> };
  addToCart: (restaurantId: string, itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setCartRestaurant: (restaurantId: string) => void;

  // Waitlist
  waitlist: WaitlistEntry[];
  joinWaitlist: (e: Omit<WaitlistEntry, "id" | "joinedAt" | "position" | "totalInQueue">) => WaitlistEntry;
  leaveWaitlist: (id: string) => void;
  toggleWaitlistNotify: (id: string, key: "notifyPush" | "notifySms") => void;

  // Wallet
  cards: LoyaltyCard[];

  // Stories
  stories: StoryRing[];
  markStoryViewed: (id: string) => void;

  // Chats
  chats: Chat[];
  sendMessage: (friendId: string, msg: ChatMessage) => void;
  markChatRead: (friendId: string) => void;

  // Tickets purchased
  tickets: { id: string; eventId: string; eventTitle: string; ticketTypeName: string; date: string; time: string; price: number; qty: number; createdAt: string; imageUrl: string }[];
  addTickets: (t: AppState["tickets"][number]) => void;

  // UI
  storyViewerOpen: { ringId: string | null };
  openStoryViewer: (ringId: string) => void;
  closeStoryViewer: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      authPhone: "",
      setAuthPhone: (p) => set({ authPhone: p }),
      signIn: () => set({ isAuthenticated: true }),
      signOut: () => set({ isAuthenticated: false }),

      profile: DEFAULT_PROFILE,
      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      bookings: seedBookings(),
      addBooking: (b) => set((s) => ({ bookings: [b, ...s.bookings] })),
      cancelBooking: (id) =>
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
        })),

      cart: { restaurantId: null, items: {} },
      addToCart: (restaurantId, itemId) =>
        set((s) => {
          const sameRestaurant = s.cart.restaurantId === restaurantId || s.cart.restaurantId === null;
          const items = sameRestaurant ? { ...s.cart.items } : {};
          items[itemId] = (items[itemId] ?? 0) + 1;
          return { cart: { restaurantId, items } };
        }),
      removeFromCart: (itemId) =>
        set((s) => {
          const items = { ...s.cart.items };
          if (!items[itemId]) return s;
          items[itemId] -= 1;
          if (items[itemId] <= 0) delete items[itemId];
          return { cart: { ...s.cart, items } };
        }),
      clearCart: () => set({ cart: { restaurantId: null, items: {} } }),
      setCartRestaurant: (restaurantId) =>
        set((s) => {
          if (s.cart.restaurantId === restaurantId) return s;
          return { cart: { restaurantId, items: {} } };
        }),

      waitlist: seedWaitlist(),
      joinWaitlist: (e) => {
        const id = `wl-${Date.now()}`;
        const entry: WaitlistEntry = {
          ...e,
          id,
          position: Math.floor(Math.random() * 4) + 2,
          totalInQueue: Math.floor(Math.random() * 6) + 5,
          joinedAt: new Date().toISOString(),
        };
        set((s) => ({ waitlist: [entry, ...s.waitlist] }));
        return entry;
      },
      leaveWaitlist: (id) => set((s) => ({ waitlist: s.waitlist.filter((w) => w.id !== id) })),
      toggleWaitlistNotify: (id, key) =>
        set((s) => ({
          waitlist: s.waitlist.map((w) => (w.id === id ? { ...w, [key]: !w[key] } : w)),
        })),

      cards: LOYALTY_CARDS,

      stories: STORIES,
      markStoryViewed: (id) =>
        set((s) => ({
          stories: s.stories.map((st) => (st.id === id ? { ...st, viewed: true } : st)),
        })),

      chats: CHATS,
      sendMessage: (friendId, msg) =>
        set((s) => {
          const existing = s.chats.find((c) => c.friendId === friendId);
          const lastPreview = msg.text ?? (msg.type === "voice" ? "Голос · 0:00" : "Вложение");
          if (existing) {
            return {
              chats: s.chats.map((c) =>
                c.friendId === friendId
                  ? {
                      ...c,
                      messages: [...c.messages, msg],
                      lastMessagePreview: lastPreview,
                      lastMessageAt: msg.timestamp,
                      typing: false,
                    }
                  : c,
              ),
            };
          }
          return {
            chats: [
              ...s.chats,
              {
                friendId,
                messages: [msg],
                lastMessagePreview: lastPreview,
                lastMessageAt: msg.timestamp,
                unread: 0,
              },
            ],
          };
        }),
      markChatRead: (friendId) =>
        set((s) => ({
          chats: s.chats.map((c) => (c.friendId === friendId ? { ...c, unread: 0 } : c)),
        })),

      tickets: [],
      addTickets: (t) => set((s) => ({ tickets: [t, ...s.tickets] })),

      storyViewerOpen: { ringId: null },
      openStoryViewer: (ringId) => set({ storyViewerOpen: { ringId } }),
      closeStoryViewer: () => set({ storyViewerOpen: { ringId: null } }),
    }),
    {
      name: "hostess-elite-store",
      version: 1,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : ({} as Storage),
      ),
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        authPhone: s.authPhone,
        profile: s.profile,
        bookings: s.bookings,
        waitlist: s.waitlist,
        tickets: s.tickets,
        stories: s.stories,
        chats: s.chats,
      }),
    },
  ),
);
