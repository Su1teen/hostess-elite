import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Star, MapPin, Clock, Users, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/layout/GlassCard";
import { mockVenues } from "@/data/mockVenues";
import { mockMenus } from "@/data/mockMenus";
import { mockReviews } from "@/data/mockBookings";
import { CATEGORY_CONFIG } from "@/types/venue.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/venue/$venueId")({
  component: VenueDetailPage,
  head: ({ params }) => {
    const venue = mockVenues.find((v) => v.id === params.venueId);
    return {
      meta: [
        { title: venue ? `${venue.name} — Hostess` : "Venue — Hostess" },
        { name: "description", content: venue?.description || "Book your premium experience." },
        { property: "og:title", content: venue?.name || "Venue" },
        { property: "og:description", content: venue?.description || "" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Venue not found</h1>
        <Link to="/" className="text-primary underline">Back to discover</Link>
      </div>
    </div>
  ),
});

function VenueDetailPage() {
  const { venueId } = Route.useParams();
  const venue = mockVenues.find((v) => v.id === venueId);
  const venueMenuItems = mockMenus.filter((m) => m.venueId === venueId);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (!venue) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Venue not found</p>
      </div>
    );
  }

  const config = CATEGORY_CONFIG[venue.category];

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { day: d.toLocaleDateString("en", { weekday: "short" }), date: d.getDate(), full: d.toISOString().split("T")[0] };
  });

  const timeSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
  const unavailable = new Set(["19:00", "20:30", "22:00"]);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Parallax Hero */}
      <div className="relative h-[45vh] md:h-[50vh] overflow-hidden">
        <img
          src={venue.imageUrl}
          alt={venue.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Back button */}
        <Link to="/" className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 z-10 glass w-10 h-10 rounded-full flex items-center justify-center md:top-20">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>

        {/* Category badge */}
        <div className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-10 md:top-20">
          <span className={cn("px-3 py-1 rounded-full text-xs font-semibold glass", config.colorClass)}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 -mt-16 px-4 max-w-3xl mx-auto">
        {/* Title & Info */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{venue.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-neon-gold text-neon-gold" />
              <span className="text-foreground font-medium">{venue.rating}</span>
              <span>({venue.reviewCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {venue.address}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {venue.operatingHours}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{venue.description}</p>

          {/* Occupancy badge */}
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full glass">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs">
              <span className={cn("font-semibold", venue.occupancy > 80 ? "text-destructive" : config.colorClass)}>
                {venue.occupancy}%
              </span>
              <span className="text-muted-foreground ml-1">occupied</span>
            </span>
            <div className={cn("w-2 h-2 rounded-full animate-pulse-glow", config.dotClass)} />
          </div>
        </div>

        {/* Booking Section */}
        <GlassCard className="p-4 mb-6">
          <h2 className="text-base font-semibold mb-3">Book a Visit</h2>

          {/* Date scroller */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide">
            {dates.map((d, i) => (
              <button
                key={d.full}
                onClick={() => setSelectedDate(i)}
                className={cn(
                  "flex flex-col items-center px-3 py-2 rounded-xl text-sm shrink-0 transition-all duration-200",
                  selectedDate === i
                    ? "glass-heavy text-foreground border border-primary/50"
                    : "bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]"
                )}
              >
                <span className="text-[10px] uppercase tracking-wider mb-0.5">{d.day}</span>
                <span className="text-lg font-semibold">{d.date}</span>
              </button>
            ))}
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {timeSlots.map((time) => {
              const isUnavailable = unavailable.has(time);
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => !isUnavailable && setSelectedTime(time)}
                  disabled={isUnavailable}
                  className={cn(
                    "py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isUnavailable && "bg-white/[0.02] text-muted-foreground/40 cursor-not-allowed",
                    isSelected && "glass-heavy text-foreground border border-primary/50 neon-glow-burgundy",
                    !isUnavailable && !isSelected && "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]"
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Menu Preview */}
        {venueMenuItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3">Menu Highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {venueMenuItems.slice(0, 6).map((item) => (
                <GlassCard key={item.id} variant="subtle" className="overflow-hidden">
                  <div className="relative h-28 md:h-32">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    {item.isPopular && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-neon-gold/20 text-neon-gold text-[10px] font-semibold">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-xs font-semibold truncate">{item.name}</h3>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{item.description}</p>
                    <p className="text-sm font-semibold mt-1 text-foreground">${item.price}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mb-6">
          <h2 className="text-base font-semibold mb-3">Reviews</h2>
          <div className="flex flex-col gap-3">
            {mockReviews.map((review) => (
              <GlassCard key={review.id} variant="subtle" className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <img src={review.avatar} alt={review.userName} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold">{review.userName}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-neon-gold text-neon-gold" />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground ml-auto">{review.date}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{review.text}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass-heavy border-t border-white/[0.08] px-4 py-3 md:pb-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="font-bold text-foreground">{venue.priceRange}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="glass w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </button>
            <Link
              to="/venue/$venueId/book"
              params={{ venueId: venue.id }}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                "bg-primary text-primary-foreground hover:opacity-90",
                config.glowClass
              )}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
