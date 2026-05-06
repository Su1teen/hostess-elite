import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Flame } from "lucide-react";
import type { PlaceListItem } from "@/types/place";
import { CATEGORY_LABEL } from "@/types/place";
import { Tag } from "@/components/common/Tag";
import { OCCUPANCY_TONE, occupancyBucket } from "@/lib/places";
import { cn } from "@/lib/utils";

interface Props {
  place: PlaceListItem;
  index?: number;
  /** Compact = smaller card for horizontal rails. */
  compact?: boolean;
}

export function PlaceCard({ place, index = 0, compact = false }: Props) {
  const occ = OCCUPANCY_TONE[occupancyBucket(place.occupancy)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.36,
        delay: Math.min(index * 0.03, 0.24),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to={place.href ?? "/home"}
        className={cn(
          "block group rounded-3xl border border-white/[0.06] hover:border-white/[0.12]",
          "bg-[oklch(0.07_0.005_270_/_0.7)] backdrop-blur-2xl",
          "transition-all overflow-hidden",
          compact ? "min-w-[260px]" : "w-full",
        )}
      >
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={place.imageUrl}
            alt={place.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {/* Gradient base for legibility of nothing — only top badges row */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" />

          {/* Top badges (left) */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {place.hasLastMinute && place.lastMinuteDiscount ? (
                <Tag variant="burgundy">
                  <Flame className="w-3 h-3" />
                  -{place.lastMinuteDiscount}%
                </Tag>
              ) : null}
              {place.vipRoom ? <Tag variant="gold">VIP-зал</Tag> : null}
              <Tag variant="muted">{CATEGORY_LABEL[place.category]}</Tag>
            </div>
            <div className="glass-medium rounded-full px-2 py-0.5 flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 fill-[var(--gold)] text-[var(--gold)]" />
              <span className="text-[11px] font-semibold">{place.rating}</span>
            </div>
          </div>
        </div>

        {/* Body — separated, no overlap on photo */}
        <div className="px-4 pt-3.5 pb-4">
          <h3 className="text-[15px] font-semibold tracking-tight leading-tight">
            {place.name}
          </h3>
          <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">
            {place.subtitle}
          </p>

          <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-foreground/70">
            <span className="inline-flex items-center gap-1 min-w-0">
              <MapPin className="w-3 h-3 shrink-0 text-foreground/45" />
              <span className="truncate">{place.district} · {place.distanceKm} км</span>
            </span>
            <span className="inline-flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3 text-foreground/45" />
              {place.hours}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-foreground/85">
              <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse-soft", occ.dot)} />
              {occ.label} · {place.occupancy}%
            </span>
            <span className="text-[11px] text-foreground/60">
              {place.category === "restaurant" || place.category === "bar"
                ? `средний чек ${place.averagePrice.toLocaleString("ru-RU")} ₸`
                : `от ${place.averagePrice.toLocaleString("ru-RU")} ₸`}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
