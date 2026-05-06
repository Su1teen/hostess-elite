import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Heart, Locate, Sparkles, Flame, Clock3 } from "lucide-react";
import { Authed } from "@/components/layout/Authed";
import { useAppStore } from "@/store/app-store";
import { PremiumMap } from "@/components/map/PremiumMap";
import { PlaceMarker } from "@/components/map/PlaceMarker";
import { MapDrawer } from "@/components/map/MapDrawer";
import { CategoryRail, type CategoryFilter } from "@/components/map/CategoryRail";
import { PlaceCard } from "@/components/map/PlaceCard";
import { allPlaces, OCCUPANCY_TONE, occupancyBucket } from "@/lib/places";
import { CATEGORY_LABEL, CATEGORY_PLURAL } from "@/types/place";
import { MOODS } from "@/data/moods";
import { RESTAURANTS } from "@/data/restaurants";
import { Tag } from "@/components/common/Tag";
import { cn } from "@/lib/utils";
import type { Mood } from "@/types";
import type { PlaceListItem } from "@/types/place";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  const profile = useAppStore((s) => s.profile);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);

  const places = useMemo(() => allPlaces(), []);
  const visible = useMemo(() => {
    return places.filter((p) => {
      const matchCat = filter === "all" || p.category === filter;
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(query.toLowerCase());
      const matchMood =
        !mood ||
        (p.category === "restaurant" &&
          RESTAURANTS.find((r) => r.id === p.id)?.moods.includes(mood));
      return matchCat && matchQuery && matchMood;
    });
  }, [places, filter, query, mood]);

  const lastMinute = useMemo(
    () => places.filter((p) => p.hasLastMinute).slice(0, 6),
    [places],
  );

  const focused = activeId ? places.find((p) => p.id === activeId) ?? null : null;

  return (
    <Authed>
      <main className="relative min-h-dvh overflow-hidden">
        {/* Map background */}
        <div className="fixed inset-0 z-0">
          <PremiumMap>
            {visible.map((p) => (
              <PlaceMarker
                key={p.id}
                category={p.category}
                occupancy={p.occupancy}
                label={CATEGORY_LABEL[p.category]}
                x={p.mapXY.x}
                y={p.mapXY.y}
                active={activeId === p.id}
                onClick={() => setActiveId(activeId === p.id ? null : p.id)}
              />
            ))}
          </PremiumMap>
        </div>

        {/* Top header overlay */}
        <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] md:pt-20 pb-3 pointer-events-none">
          <div className="mx-auto max-w-[900px] flex items-center justify-between gap-3 pointer-events-auto">
            <div>
              <h1 className="text-[22px] md:text-3xl font-semibold tracking-tight">
                <span className="gold-text">Hostess</span>
              </h1>
              <p className="text-[11px] text-foreground/60 mt-0.5">
                Алматы · {profile.city ? "live" : "live"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Избранное"
                className="w-10 h-10 grid place-items-center rounded-full glass-medium glass-rim border-white/[0.08]"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                aria-label="Уведомления"
                className="w-10 h-10 grid place-items-center rounded-full glass-medium glass-rim border-white/[0.08]"
              >
                <Bell className="w-4 h-4" />
              </button>
              <Link
                to="/profile"
                className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-[var(--gold)]/40 hover:ring-[var(--gold)]/70 transition"
              >
                <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
              </Link>
            </div>
          </div>
        </header>

        {/* "Locate me" button (above drawer when drawer at peek/mid) */}
        <button
          aria-label="Моё местоположение"
          className="fixed right-4 z-30 w-10 h-10 rounded-full glass-medium glass-rim grid place-items-center"
          style={{ bottom: "calc(34vh + 1rem)" }}
        >
          <Locate className="w-4 h-4" />
        </button>

        {/* Focus card above drawer when marker active */}
        <AnimatePresence>
          {focused && (
            <motion.div
              key={focused.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 -translate-x-1/2 z-30 w-[min(420px,92vw)]"
              style={{ bottom: "calc(30vh + 0.75rem)" }}
            >
              <FocusCard place={focused} onClose={() => setActiveId(null)} onOpen={() => navigate({ to: focused.href ?? "/home" })} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drawer */}
        <MapDrawer initial="peek">
          <div className="px-4 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-12 max-w-[900px] mx-auto">
            {/* Search */}
            <div className="rounded-2xl flex items-center gap-3 px-3 py-2.5 border border-white/[0.07] bg-white/[0.04]">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск ресторана, барбершопа, спа…"
                className="bg-transparent outline-none flex-1 text-[14px] placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  очистить
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mt-3.5">
              <CategoryRail active={filter} onChange={setFilter} />
            </div>

            {/* Mood matcher rail */}
            <SectionTitle title="Подбор по настроению" />
            <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide flex gap-2 pb-1.5">
              <button
                onClick={() => setMood(null)}
                className={cn(
                  "shrink-0 px-3.5 py-2 rounded-full text-[12px] font-medium border transition-all",
                  mood === null
                    ? "bg-foreground text-background border-foreground"
                    : "bg-white/[0.04] text-foreground/85 border-white/[0.07]",
                )}
              >
                Любое
              </button>
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id === mood ? null : m.id)}
                  className={cn(
                    "shrink-0 px-3.5 py-2 rounded-full text-[12px] font-medium border transition-all inline-flex items-center gap-1.5",
                    m.id === mood
                      ? "bg-foreground text-background border-foreground"
                      : "bg-white/[0.04] text-foreground/85 border-white/[0.07]",
                  )}
                >
                  <span>{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Last-minute rail */}
            {lastMinute.length > 0 && (
              <>
                <SectionTitle
                  title="Горящие столики"
                  subtitle="Освободились прямо сейчас — со скидкой до 40%"
                  action={<Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />}
                />
                <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide flex gap-3 pb-2">
                  {lastMinute.map((p, i) => (
                    <Link
                      key={p.id}
                      to={p.href ?? "/home"}
                      className="shrink-0 w-[260px] block group"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="relative rounded-3xl overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition"
                      >
                        <div className="aspect-[5/4] relative">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
                          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                            <Tag variant="burgundy">
                              <Flame className="w-3 h-3" />
                              -{p.lastMinuteDiscount}%
                            </Tag>
                            <div className="glass rounded-full px-2 py-0.5 flex items-center gap-1.5 text-[10px]">
                              <Clock3 className="w-3 h-3" />
                              сейчас
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3.5">
                            <h3 className="text-base font-semibold text-white leading-tight">
                              {p.name}
                            </h3>
                            <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">
                              {p.subtitle}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Places list */}
            <SectionTitle
              title={filter === "all" ? "Все заведения" : CATEGORY_PLURAL[filter]}
              subtitle={`${visible.length} рядом · сортировка по дистанции`}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {visible.map((p, i) => (
                <PlaceCard key={p.id} place={p} index={i} />
              ))}
              {visible.length === 0 && (
                <div className="text-center text-muted-foreground py-12 text-sm">
                  Ничего не найдено по фильтру
                </div>
              )}
            </div>
          </div>
        </MapDrawer>
      </main>
    </Authed>
  );
}

function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mt-5 mb-2.5">
      <div>
        <h3 className="text-[14px] font-semibold tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="text-muted-foreground">{action}</div>}
    </div>
  );
}

function FocusCard({
  place,
  onClose,
  onOpen,
}: {
  place: PlaceListItem;
  onClose: () => void;
  onOpen: () => void;
}) {
  const occ = OCCUPANCY_TONE[occupancyBucket(place.occupancy)];
  return (
    <div
      className="rounded-3xl overflow-hidden border border-white/[0.1]"
      style={{
        background: "oklch(0.06 0.005 270 / 0.78)",
        backdropFilter: "blur(40px) saturate(1.6)",
        WebkitBackdropFilter: "blur(40px) saturate(1.6)",
        boxShadow:
          "inset 0 1px 0 oklch(1 0 0 / 0.14), 0 18px 60px oklch(0 0 0 / 0.55)",
      }}
    >
      <div className="flex gap-3 p-3">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
          <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Tag variant="muted">{CATEGORY_LABEL[place.category]}</Tag>
              <h4 className="text-[15px] font-semibold mt-1 truncate">{place.name}</h4>
              <p className="text-[11px] text-muted-foreground truncate">{place.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-[11px] text-muted-foreground hover:text-foreground"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-foreground/75">
            <span className={cn("w-1.5 h-1.5 rounded-full", occ.dot)} />
            {occ.label} · {place.occupancy}%
            <span className="text-foreground/45">·</span>
            <span>{place.district}</span>
          </div>
        </div>
      </div>
      <div className="px-3 pb-3">
        <button
          onClick={onOpen}
          className="w-full py-2.5 rounded-2xl text-[13px] font-semibold bg-foreground text-background hover:opacity-90 transition"
        >
          Открыть профиль
        </button>
      </div>
    </div>
  );
}
