import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, ChevronRight, Bell, Sparkles } from "lucide-react";
import { Authed } from "@/components/layout/Authed";
import { PageShell, SectionTitle } from "@/components/layout/PageShell";
import { StoriesBar } from "@/components/social/StoriesBar";
import { MoodMatcher } from "@/components/home/MoodMatcher";
import { LastMinuteRail } from "@/components/home/LastMinuteRail";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { RESTAURANTS } from "@/data/restaurants";
import { useAppStore } from "@/store/app-store";
import { GlassCard } from "@/components/layout/GlassCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

const CUISINES = [
  "Все",
  "стейк-хаус",
  "японская",
  "итальянская",
  "французская",
  "грузинская",
  "паназиатская",
  "морепродукты",
  "винный бар",
  "коктейль-бар",
  "авторская",
] as const;

function HomePage() {
  const profile = useAppStore((s) => s.profile);
  const [cuisine, setCuisine] = useState<string>("Все");
  const [query, setQuery] = useState("");

  const filtered = RESTAURANTS.filter((r) => {
    const matchCuisine = cuisine === "Все" || r.cuisine === cuisine;
    const matchQuery = !query || r.name.toLowerCase().includes(query.toLowerCase()) || r.cuisine.includes(query.toLowerCase());
    return matchCuisine && matchQuery;
  });

  return (
    <Authed>
      <PageShell>
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {profile.city} · сегодня в 19:00
            </p>
            <h1 className="text-[26px] md:text-3xl font-semibold tracking-tight mt-0.5">
              Добрый вечер, <span className="gold-text">{profile.name.split(" ")[0]}</span>
            </h1>
          </div>
          <Link
            to="/profile"
            className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-[var(--gold)]/40 hover:ring-[var(--gold)]/70 transition"
          >
            <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
          </Link>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass-medium rounded-2xl p-3 flex items-center gap-3 glass-rim"
        >
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти ресторан, кухню или блюдо"
            className="bg-transparent outline-none flex-1 text-[15px] placeholder:text-muted-foreground"
          />
          <button className="rounded-full glass-medium border-white/[0.1] w-9 h-9 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Stories */}
        <SectionTitle title="Сторис друзей" />
        <StoriesBar />

        {/* Mood matcher */}
        <SectionTitle title="Подбор по настроению" subtitle="Что вы планируете сегодня вечером?" />
        <MoodMatcher />

        {/* Last-minute */}
        <SectionTitle
          title="Горящие столики"
          subtitle="Освободились прямо сейчас — со скидкой до 40%"
          action={<Sparkles className="w-4 h-4 text-[var(--gold)]" />}
        />
        <LastMinuteRail />

        {/* Quick actions */}
        <SectionTitle title="Быстрые действия" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: "/events", label: "События", icon: "🎫", desc: "8 событий на этой неделе" },
            { to: "/wallet", label: "Кошелёк", icon: "💳", desc: "6 карт лояльности" },
            { to: "/social", label: "Друзья онлайн", icon: "👥", desc: "11 в городе сейчас" },
            { to: "/bookings", label: "Мои брони", icon: "📅", desc: "1 предстоящая" },
          ].map((q, i) => (
            <motion.div
              key={q.to}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={q.to}
                className="glass rounded-2xl p-4 flex flex-col gap-1 group hover:bg-white/[0.07] transition-colors"
              >
                <div className="text-xl">{q.icon}</div>
                <div className="text-sm font-semibold mt-1">{q.label}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-1">{q.desc}</div>
                <ChevronRight className="w-4 h-4 text-muted-foreground self-end -mt-3 group-hover:translate-x-1 transition" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Restaurant feed */}
        <SectionTitle
          title="Рестораны для вас"
          action={
            <Link to="/bookings" className="text-sm text-muted-foreground hover:text-foreground transition">
              Мои брони →
            </Link>
          }
        />
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-2">
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all border",
                cuisine === c
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white/[0.04] text-muted-foreground border-white/[0.06] hover:bg-white/[0.07]",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r, i) => (
            <RestaurantCard key={r.id} r={r} index={i} />
          ))}
          {filtered.length === 0 && (
            <GlassCard className="col-span-full p-8 text-center">
              <p className="text-muted-foreground">Ничего не найдено. Попробуйте другой запрос.</p>
            </GlassCard>
          )}
        </div>
      </PageShell>
    </Authed>
  );
}
