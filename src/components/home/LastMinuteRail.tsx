import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Clock3, ChevronRight } from "lucide-react";
import { RESTAURANTS } from "@/data/restaurants";
import { Tag } from "@/components/common/Tag";

export function LastMinuteRail() {
  const lm = RESTAURANTS.filter((r) => r.hasLastMinute);

  return (
    <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide flex gap-3.5 pb-2">
      {lm.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="shrink-0 w-[280px] md:w-[320px]"
        >
          <Link
            to="/restaurant/$id"
            params={{ id: r.id }}
            className="block group relative overflow-hidden rounded-3xl"
          >
            <div className="aspect-[5/4] relative">
              <img src={r.imageUrl} alt={r.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                <Tag variant="burgundy">
                  <Flame className="w-3 h-3" />
                  -{r.lastMinuteDiscount}%
                </Tag>
                <div className="glass rounded-full px-2.5 py-1 flex items-center gap-1.5 text-[11px]">
                  <Clock3 className="w-3 h-3" />
                  {r.lastMinuteSeats} места сегодня
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold text-white">{r.name}</h3>
                <p className="text-[12px] text-white/70 capitalize line-clamp-1 mt-0.5">{r.cuisine} · {r.district}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/55">Сейчас от</p>
                    <p className="text-base font-semibold text-white">
                      {(r.averageBill * (1 - (r.lastMinuteDiscount ?? 0) / 100)).toLocaleString("ru-RU")} ₸
                      <span className="text-xs text-white/50 line-through ml-1.5">
                        {r.averageBill.toLocaleString("ru-RU")}
                      </span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[var(--gold)] text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
