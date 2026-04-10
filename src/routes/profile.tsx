import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Flame, TrendingUp, Calendar } from "lucide-react";
import { GlassCard } from "@/components/layout/GlassCard";
import { mockBookings, mockUserProfile } from "@/data/mockBookings";
import { CATEGORY_CONFIG } from "@/types/venue.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "My Profile — Hostess" },
      { name: "description", content: "Your premium booking profile, visit history and lifestyle feed." },
    ],
  }),
});

function ProfilePage() {
  const user = mockUserProfile;
  const upcoming = mockBookings.filter((b) => b.status === "upcoming");
  const completed = mockBookings.filter((b) => b.status === "completed");

  return (
    <div className="min-h-screen bg-background pb-24 md:pt-20">
      <div className="px-4 pt-[max(1.5rem,env(safe-area-inset-top))] md:pt-4 max-w-3xl mx-auto">

        {/* VIP Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img src={user.avatar} alt={user.name} className="w-18 h-18 md:w-20 md:h-20 rounded-2xl object-cover" />
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-gradient-to-r from-neon-gold to-neon-purple text-background">
              {user.tier}
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-xs text-muted-foreground">Member since {user.memberSince}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <GlassCard className="p-3 text-center">
            <TrendingUp className="w-4 h-4 mx-auto text-neon-cyan mb-1" />
            <p className="text-lg font-bold">{user.totalVisits}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Visits</p>
          </GlassCard>
          <GlassCard className="p-3 text-center">
            <Flame className="w-4 h-4 mx-auto text-neon-gold mb-1" />
            <p className="text-lg font-bold capitalize">{user.favoriteCategory}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Favorite</p>
          </GlassCard>
          <GlassCard className="p-3 text-center">
            <Star className="w-4 h-4 mx-auto text-neon-purple mb-1" />
            <p className="text-lg font-bold">${user.totalSpent.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Spent</p>
          </GlassCard>
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-6">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Upcoming
          </h2>
          {upcoming.length === 0 ? (
            <GlassCard variant="subtle" className="p-6 text-center">
              <p className="text-sm text-muted-foreground">No upcoming bookings</p>
              <Link to="/" className="text-primary text-sm underline mt-2 inline-block">Discover venues</Link>
            </GlassCard>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((booking) => {
                const config = CATEGORY_CONFIG[booking.venueCategory];
                return (
                  <GlassCard key={booking.id} className="flex gap-3 p-3">
                    <img src={booking.imageUrl} alt={booking.venueName} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)} />
                        <h3 className="text-sm font-semibold truncate">{booking.venueName}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {booking.date} · {booking.time} · {booking.guests} guests
                      </p>
                      <p className="text-xs font-medium mt-1">Table #{booking.tableNumber}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neon-gold/10 text-neon-gold font-medium">Upcoming</span>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Stories / Memories */}
        <div className="mb-6">
          <h2 className="text-base font-semibold mb-3">Memories</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {completed.map((booking) => {
              const config = CATEGORY_CONFIG[booking.venueCategory];
              return (
                <div key={booking.id} className="shrink-0 w-28">
                  <div className={cn("w-20 h-20 mx-auto rounded-full p-0.5 mb-1.5", `bg-gradient-to-br from-[var(--neon-${booking.venueCategory === "restaurant" ? "gold" : booking.venueCategory === "nightlife" ? "purple" : booking.venueCategory === "beauty" ? "burgundy" : "cyan"})] to-transparent`)}>
                    <img src={booking.imageUrl} alt={booking.venueName} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground truncate">{booking.venueName}</p>
                  <p className="text-[9px] text-center text-muted-foreground/60">{booking.date}</p>
                </div>
              );
            })}
            {/* Add more placeholder */}
            <div className="shrink-0 w-28 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-dashed border-white/10 flex items-center justify-center">
                <span className="text-2xl text-muted-foreground/30">+</span>
              </div>
              <p className="text-[10px] text-center text-muted-foreground/40 mt-1.5">Visit more</p>
            </div>
          </div>
        </div>

        {/* Lifestyle Feed */}
        <div className="mb-6">
          <h2 className="text-base font-semibold mb-3">Events & Offers</h2>
          <div className="flex flex-col gap-3">
            <GlassCard className="overflow-hidden">
              <div className="relative h-36 md:h-44">
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80" alt="Event" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple font-semibold">This Weekend</span>
                  <h3 className="text-sm font-bold mt-1">Midnight Jazz at Velvet Lounge</h3>
                  <p className="text-[10px] text-muted-foreground">Live jazz, craft cocktails & city views. Sat 11 PM.</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="overflow-hidden">
              <div className="relative h-36 md:h-44">
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" alt="Offer" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-gold/20 text-neon-gold font-semibold">Exclusive</span>
                  <h3 className="text-sm font-bold mt-1">Chef's Table at Ember & Oak</h3>
                  <p className="text-[10px] text-muted-foreground">5-course tasting menu with wine pairing. Limited seats.</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
