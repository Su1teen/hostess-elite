import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Authed } from "@/components/layout/Authed";
import { PageShell, SectionTitle } from "@/components/layout/PageShell";
import { GlassCard } from "@/components/layout/GlassCard";
import { SocialTabs } from "@/components/social/SocialTabs";
import { useAppStore } from "@/store/app-store";
import { FRIENDS } from "@/data/social";
import { statusTone } from "@/lib/social-helpers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/social/chat")({
  component: ChatList,
});

function ChatList() {
  const chats = useAppStore((s) => s.chats);
  const friendsById = Object.fromEntries(FRIENDS.map((f) => [f.id, f]));

  const sorted = [...chats].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    if (diffMs < 60_000) return "сейчас";
    if (diffMs < 3600_000) return `${Math.floor(diffMs / 60_000)} мин`;
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
  };

  return (
    <Authed>
      <PageShell>
        <SectionTitle title="Чаты" subtitle={`Активных бесед: ${sorted.length}`} />
        <SocialTabs />

        <div className="space-y-2">
          {sorted.map((c, i) => {
            const f = friendsById[c.friendId];
            if (!f) return null;
            return (
              <motion.div
                key={c.friendId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
              >
                <Link
                  to="/chat/$friendId"
                  params={{ friendId: c.friendId }}
                  className="block group"
                >
                  <GlassCard className="p-3 flex items-center gap-3 group-hover:bg-white/[0.07] transition-colors">
                    <div className="relative shrink-0">
                      <img src={f.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                      {statusTone(f.status) !== "offline" && (
                        <span
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-background",
                            statusTone(f.status) === "online" && "bg-emerald-400",
                            statusTone(f.status) === "venue" && "bg-[var(--gold)]",
                            statusTone(f.status) === "busy" && "bg-rose-400",
                          )}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold truncate">{f.name}</h3>
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {formatTime(c.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={cn(
                          "text-[12px] truncate",
                          c.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground",
                        )}>
                          {c.typing ? (
                            <span className="text-[var(--gold)] italic">печатает…</span>
                          ) : (
                            c.lastMessagePreview
                          )}
                        </p>
                        {c.unread > 0 && (
                          <span className="shrink-0 min-w-[20px] h-5 rounded-full bg-[var(--gold)] text-black text-[10px] font-semibold flex items-center justify-center px-1.5">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {FRIENDS.filter((f) => f.isOnApp && !chats.find((c) => c.friendId === f.id))
            .slice(0, 6)
            .map((f) => (
              <Link
                key={f.id}
                to="/chat/$friendId"
                params={{ friendId: f.id }}
                className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:bg-white/[0.07] transition"
              >
                <img src={f.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <span className="text-[11px] text-foreground/85 truncate max-w-full">
                  {f.name.split(" ")[0]}
                </span>
              </Link>
            ))}
        </div>
      </PageShell>
    </Authed>
  );
}
