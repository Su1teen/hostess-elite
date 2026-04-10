import { Link } from "@tanstack/react-router";
import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/layout/GlassCard";
import { CATEGORY_CONFIG, type Venue } from "@/types/venue.types";

interface VenueListCardProps {
  venue: Venue;
}

export function VenueListCard({ venue }: VenueListCardProps) {
  const config = CATEGORY_CONFIG[venue.category];

  return (
    <Link to="/venue/$venueId" params={{ venueId: venue.id }}>
      <GlassCard className="flex gap-4 p-3 hover:bg-white/[0.08] transition-all duration-300 animate-float-up cursor-pointer">
        {/* Thumbnail */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shrink-0">
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className={cn("absolute top-2 left-2 w-2 h-2 rounded-full animate-pulse-glow", config.dotClass)} />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-foreground truncate">{venue.name}</h3>
              {!venue.isOpen && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground">Closed</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-neon-gold text-neon-gold" />
                {venue.rating}
              </span>
              <span>·</span>
              <span>{venue.reviewCount} reviews</span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {venue.distance}
              </span>
            </div>
          </div>

          {/* Occupancy bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Occupancy</span>
              <span className="text-[10px] font-medium text-foreground">{venue.occupancy}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", config.dotClass)}
                style={{
                  width: `${venue.occupancy}%`,
                  opacity: 0.4 + (venue.occupancy / 100) * 0.6,
                }}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 mt-2">
            {venue.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
