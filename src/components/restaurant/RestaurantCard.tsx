import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Flame } from "lucide-react";
import type { Restaurant } from "@/types";
import { Tag } from "@/components/common/Tag";

export function RestaurantCard({ r, index = 0 }: { r: Restaurant; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to="/restaurant/$id"
        params={{ id: r.id }}
        className="block group"
      >
        <div className="relative overflow-hidden rounded-3xl bg-card border border-white/[0.06] hover:border-white/[0.14] transition-all">
          <div className="aspect-[16/10] relative overflow-hidden">
            <img
              src={r.imageUrl}
              alt={r.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {r.hasLastMinute && r.lastMinuteDiscount && (
                  <Tag variant="burgundy">
                    <Flame className="w-3 h-3" />
                    -{r.lastMinuteDiscount}% сейчас
                  </Tag>
                )}
                {r.vipRoom && <Tag variant="gold">VIP-зал</Tag>}
              </div>
              <div className="glass-medium rounded-full px-2.5 py-1 flex items-center gap-1">
                <Star className="w-3 h-3 fill-[var(--gold)] text-[var(--gold)]" />
                <span className="text-[11px] font-semibold">{r.rating}</span>
              </div>
            </div>

            {/* Bottom title row */}
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white leading-tight">
                    {r.name}
                  </h3>
                  <p className="text-[12px] text-white/75 capitalize">
                    {r.cuisine} · средний чек {r.averageBill.toLocaleString("ru-RU")} ₸
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pt-3 pb-4 flex items-center justify-between gap-3 text-[12px] text-foreground/75">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-foreground/50" />
              <span className="truncate">{r.district} · {r.distanceKm} км</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5 text-foreground/50" />
              <span>{r.hours}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 shrink-0 text-foreground/85">
              <span className={`w-1.5 h-1.5 rounded-full ${r.occupancy > 80 ? "bg-rose-400" : r.occupancy > 50 ? "bg-amber-400" : "bg-emerald-400"} animate-pulse-soft`} />
              {r.occupancy > 80 ? "Загружен" : r.occupancy > 50 ? "Свободно" : "Тихо"}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
