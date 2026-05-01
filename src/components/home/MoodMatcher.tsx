import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { MOODS } from "@/data/moods";
import { RESTAURANTS } from "@/data/restaurants";
import type { Mood } from "@/types";
import { cn } from "@/lib/utils";

export function MoodMatcher() {
  const [active, setActive] = useState<Mood>("date");
  const navigate = useNavigate();

  const matches = RESTAURANTS.filter((r) => r.moods.includes(active)).slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-1">
        {MOODS.map((m) => {
          const isActive = m.id === active;
          return (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActive(m.id)}
              className={cn(
                "shrink-0 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 border",
                isActive
                  ? "bg-gradient-to-b from-white/[0.18] to-white/[0.06] text-foreground border-white/[0.18] shadow-[0_0_30px_oklch(0.86_0.13_85/0.1)]"
                  : "bg-white/[0.04] text-muted-foreground border-white/[0.06] hover:bg-white/[0.07] hover:text-foreground",
              )}
            >
              <span className="text-base">{m.emoji}</span>
              {m.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl glass-medium glass-rim p-1"
        >
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br pointer-events-none",
              MOODS.find((m) => m.id === active)?.gradient,
            )}
          />
          <div className="relative z-10 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Атмосфера {MOODS.find((m) => m.id === active)?.label}
                </p>
                <p className="text-base mt-0.5 max-w-md">
                  {MOODS.find((m) => m.id === active)?.description}
                </p>
              </div>
              <div className="text-3xl md:text-5xl">
                {MOODS.find((m) => m.id === active)?.emoji}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {matches.map((r, i) => (
                <motion.button
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate({ to: "/restaurant/$id", params: { id: r.id } })}
                  className="text-left flex items-center gap-3 glass rounded-2xl p-2.5 border border-white/[0.06] hover:border-white/[0.14] transition-all overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground capitalize truncate">
                      {r.cuisine} · {r.distanceKm} км
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
