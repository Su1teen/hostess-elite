import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Compass, MessageSquare } from "lucide-react";
import { z } from "zod";
import { Authed } from "@/components/layout/Authed";
import { PageShell, SectionTitle } from "@/components/layout/PageShell";
import { GlassCard } from "@/components/layout/GlassCard";
import { Tag } from "@/components/common/Tag";
import { SocialTabs } from "@/components/social/SocialTabs";
import { FRIENDS } from "@/data/social";
import { RESTAURANTS } from "@/data/restaurants";
import { statusTone, venueName } from "@/lib/social-helpers";
import { cn } from "@/lib/utils";

const search = z.object({
  focus: z.string().optional(),
});

export const Route = createFileRoute("/social/map")({
  component: MapPage,
  validateSearch: search.parse,
});

function MapPage() {
  const params = Route.useSearch();
  const [activeFriend, setActiveFriend] = useState<string | null>(params.focus ?? null);

  const onApp = useMemo(() => FRIENDS.filter((f) => f.isOnApp && f.location), []);

  const focused = activeFriend ? FRIENDS.find((f) => f.id === activeFriend) : null;

  return (
    <Authed>
      <PageShell>
        <SectionTitle
          title="Карта друзей"
          subtitle="Кто где сейчас в городе"
          action={
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Алматы · live
            </span>
          }
        />
        <SocialTabs />

        <GlassCard variant="medium" className="overflow-hidden p-0">
          <div className="relative aspect-[4/3] md:aspect-[16/9] w-full bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.18_0.04_245)_0%,oklch(0.05_0.005_270)_60%)]">
            {/* Stylized map: roads + neighborhoods */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
              <defs>
                <pattern id="topo" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 20 Q 20 0 40 20" fill="none" stroke="oklch(0.3 0.02 250 / 0.15)" strokeWidth="0.5" />
                  <path d="M 0 30 Q 20 10 40 30" fill="none" stroke="oklch(0.3 0.02 250 / 0.1)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="800" height="600" fill="url(#topo)" />

              {/* Mountains */}
              <path d="M 0 540 L 80 480 L 160 510 L 240 460 L 320 500 L 400 470 L 480 510 L 560 480 L 640 510 L 720 470 L 800 500 L 800 600 L 0 600 Z"
                fill="oklch(0.1 0.015 240 / 0.6)" stroke="oklch(0.4 0.04 240 / 0.3)" strokeWidth="0.7" />

              {/* Roads */}
              <g stroke="oklch(0.55 0.04 60 / 0.25)" strokeWidth="2" fill="none">
                <path d="M 100 100 Q 250 200 400 250 T 750 350" />
                <path d="M 50 350 L 200 320 L 300 340 L 480 280 L 600 320 L 780 290" />
                <path d="M 150 450 L 350 400 L 500 420 L 700 380" />
                <path d="M 350 80 L 380 250 L 420 400 L 450 540" />
                <path d="M 600 80 L 580 250 L 560 400 L 540 540" />
              </g>

              {/* Neighborhoods labels */}
              <g fill="oklch(0.7 0.02 60 / 0.5)" fontSize="10" letterSpacing="2">
                <text x="120" y="160">МЕДЕУ</text>
                <text x="370" y="200">ЦЕНТР</text>
                <text x="600" y="160">САМАЛ</text>
                <text x="200" y="380">КОКТЕМ</text>
                <text x="500" y="450">ДОСТЫК</text>
                <text x="700" y="280">МЕГА</text>
              </g>
            </svg>

            {/* Restaurant pins (smaller) */}
            {RESTAURANTS.map((r) => (
              <div
                key={r.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${r.mapXY.x}%`, top: `${r.mapXY.y}%` }}
              >
                <div className="w-2 h-2 rounded-full bg-white/60 ring-2 ring-white/20" />
                <div className="absolute left-1/2 -translate-x-1/2 top-3 opacity-0 group-hover:opacity-100 transition-opacity glass rounded-md px-2 py-0.5 whitespace-nowrap text-[10px] z-10">
                  {r.name}
                </div>
              </div>
            ))}

            {/* Friend avatars */}
            {onApp.map((f) => {
              const isActive = activeFriend === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFriend(f.id === activeFriend ? null : f.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${f.location!.x}%`, top: `${f.location!.y}%` }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 + Math.random() * 0.4 }}
                    className="relative"
                  >
                    {statusTone(f.status) === "online" && (
                      <span className="absolute inset-0 rounded-full bg-[var(--gold)]/40 animate-ping" />
                    )}
                    <div
                      className={cn(
                        "rounded-full overflow-hidden ring-2 transition-all",
                        isActive
                          ? "w-14 h-14 ring-[var(--gold)]"
                          : statusTone(f.status) === "venue"
                            ? "w-10 h-10 ring-[var(--gold)]/80"
                            : statusTone(f.status) === "online"
                              ? "w-10 h-10 ring-emerald-400/80"
                              : "w-9 h-9 ring-white/40",
                      )}
                    >
                      <img src={f.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    {f.statusVenue && (
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap text-[9px] glass rounded-full px-1.5 py-0.5 max-w-[110px] truncate">
                        📍 {venueName(f.statusVenue)}
                      </div>
                    )}
                  </motion.div>
                </button>
              );
            })}

            {/* Compass overlay */}
            <div className="absolute top-3 left-3 glass rounded-2xl px-3 py-1.5 text-[11px] text-foreground/80 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-[var(--gold)]" />
              {onApp.length} друзей онлайн
            </div>
          </div>
        </GlassCard>

        {/* Selected friend card */}
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            <GlassCard variant="medium" className="p-4 flex items-center gap-3">
              <img src={focused.avatar} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-[var(--gold)]/60" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold truncate">{focused.name}</h3>
                  {focused.vipTier && <Tag variant="gold">{focused.vipTier}</Tag>}
                </div>
                <p className="text-[12px] text-muted-foreground">
                  {focused.statusLabel}
                  {venueName(focused.statusVenue) ? ` · ${venueName(focused.statusVenue)}` : ""}
                </p>
                <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                  {focused.mood && `Настроение: ${focused.mood}`} · последняя активность {focused.lastSeen}
                </p>
              </div>
              <Link
                to="/chat/$friendId"
                params={{ friendId: focused.id }}
                className="rounded-full px-3 py-2 bg-[var(--gold)] text-black text-xs font-medium flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Написать
              </Link>
            </GlassCard>
          </motion.div>
        )}

        <SectionTitle title="Друзья онлайн" />
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-2">
          {onApp.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFriend(f.id)}
              className={cn(
                "shrink-0 flex flex-col items-center gap-1.5 group",
                activeFriend === f.id && "scale-105",
              )}
            >
              <div className="relative">
                <img
                  src={f.avatar}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white/[0.08] group-hover:ring-[var(--gold)]/60 transition"
                />
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-background",
                    statusTone(f.status) === "online" && "bg-emerald-400",
                    statusTone(f.status) === "venue" && "bg-[var(--gold)]",
                    statusTone(f.status) === "busy" && "bg-rose-400",
                  )}
                />
              </div>
              <span className="text-[11px] truncate max-w-[80px]">{f.name.split(" ")[0]}</span>
              <span className="text-[9px] text-muted-foreground truncate max-w-[80px]">
                {venueName(f.statusVenue) ?? f.statusLabel}
              </span>
            </button>
          ))}
        </div>
      </PageShell>
    </Authed>
  );
}
