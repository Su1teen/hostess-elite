import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare, MapPin } from "lucide-react";
import { Authed } from "@/components/layout/Authed";
import { PageShell, SectionTitle } from "@/components/layout/PageShell";
import { GlassCard } from "@/components/layout/GlassCard";
import { Tag } from "@/components/common/Tag";
import { SocialTabs } from "@/components/social/SocialTabs";
import { FRIENDS } from "@/data/social";
import { statusTone, venueName } from "@/lib/social-helpers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/social/contacts")({
  component: ContactsPage,
});

function ContactsPage() {
  const [query, setQuery] = useState("");
  const filtered = FRIENDS.filter((f) =>
    !query
      ? true
      : f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.username.toLowerCase().includes(query.toLowerCase()),
  );

  const onApp = filtered.filter((f) => f.isOnApp);
  const invite = filtered.filter((f) => !f.isOnApp);

  return (
    <Authed>
      <PageShell>
        <SectionTitle title="Социальная сеть" />
        <SocialTabs />

        <GlassCard variant="medium" className="p-3 flex items-center gap-3 mb-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти друга по имени или нику"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
        </GlassCard>

        <SectionTitle
          title={`В Hostess · ${onApp.length}`}
          subtitle="Синхронизировано из Контактов"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {onApp.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="glass rounded-2xl p-3 flex items-center gap-3"
            >
              <div className="relative w-12 h-12 shrink-0">
                <img src={f.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-background",
                    statusTone(f.status) === "online" && "bg-emerald-400",
                    statusTone(f.status) === "venue" && "bg-[var(--gold)]",
                    statusTone(f.status) === "busy" && "bg-rose-400",
                    statusTone(f.status) === "offline" && "bg-zinc-500",
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold truncate">{f.name}</h3>
                  {f.vipTier && <Tag variant="gold">{f.vipTier}</Tag>}
                </div>
                <p className="text-[12px] text-muted-foreground truncate">
                  {f.statusLabel}
                  {venueName(f.statusVenue) ? ` · ${venueName(f.statusVenue)}` : ""}
                </p>
                <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                  {f.mutualFriends} общих · {f.username}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Link
                  to="/chat/$friendId"
                  params={{ friendId: f.id }}
                  className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.08] transition"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
                <Link
                  to="/social/map"
                  search={{ focus: f.id }}
                  className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.08] transition"
                >
                  <MapPin className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {invite.length > 0 && (
          <>
            <SectionTitle
              title="Пригласить · ваши контакты"
              subtitle="Эти друзья ещё не в Hostess Elite"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {invite.map((f) => (
                <div key={f.id} className="glass rounded-2xl p-3 flex items-center gap-3 opacity-80">
                  <img src={f.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{f.name}</h3>
                    <p className="text-[11px] text-muted-foreground truncate">{f.username}</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-[var(--gold)] text-black hover:scale-105 transition">
                    Пригласить
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </PageShell>
    </Authed>
  );
}
