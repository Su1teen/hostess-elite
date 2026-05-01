import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Bell,
  MessageSquare,
  Users,
  Clock3,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Authed } from "@/components/layout/Authed";
import { GlassCard } from "@/components/layout/GlassCard";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Tag } from "@/components/common/Tag";
import { useAppStore } from "@/store/app-store";
import { getRestaurantById } from "@/data/restaurants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/restaurant/$id/waitlist")({
  component: WaitlistPage,
});

function WaitlistPage() {
  const { id } = Route.useParams();
  const r = getRestaurantById(id)!;
  const navigate = useNavigate();
  const [guests, setGuests] = useState(2);
  const [pushNotify, setPushNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);
  const [joined, setJoined] = useState<{ position: number; total: number; eta: number } | null>(null);

  const join = useAppStore((s) => s.joinWaitlist);
  const leave = useAppStore((s) => s.leaveWaitlist);
  const myEntries = useAppStore((s) => s.waitlist.filter((w) => w.restaurantId === r.id));
  const toggleNotify = useAppStore((s) => s.toggleWaitlistNotify);

  // Live position update simulation when joined
  useEffect(() => {
    if (!joined) return;
    const t = setInterval(() => {
      setJoined((prev) => {
        if (!prev) return prev;
        const next = Math.max(1, prev.position - (Math.random() < 0.4 ? 1 : 0));
        return {
          position: next,
          total: prev.total,
          eta: Math.max(2, Math.round(next * (prev.eta / prev.position))),
        };
      });
    }, 8000);
    return () => clearInterval(t);
  }, [joined]);

  const onJoin = () => {
    const entry = join({
      restaurantId: r.id,
      restaurantName: r.name,
      imageUrl: r.imageUrl,
      estimatedWait: 25,
      guests,
      notifyPush: pushNotify,
      notifySms: smsNotify,
    });
    setJoined({ position: entry.position, total: entry.totalInQueue, eta: entry.estimatedWait });
    toast.success("Вы в очереди. Уведомим, когда стол освободится.");
  };

  return (
    <Authed>
      <main className="min-h-dvh pt-4 md:pt-20 pb-32 md:pb-12">
        <div className="mx-auto w-full max-w-[760px] px-4 md:px-6">
          <div className="flex items-center gap-3 mb-3">
            <Link
              to="/restaurant/$id"
              params={{ id: r.id }}
              className="w-10 h-10 rounded-full glass border-white/[0.08] flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs text-muted-foreground">Лист ожидания</p>
              <h1 className="text-xl font-semibold tracking-tight">{r.name}</h1>
            </div>
          </div>

          <GlassCard variant="medium" className="p-5 mb-3 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-[var(--gold)]/10 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Сейчас в зале</p>
              </div>
              <p className="text-foreground text-[15px] leading-relaxed">
                Все столы заняты — заполнено <span className="font-semibold">{r.occupancy}%</span>. По нашим данным, ближайший стол освободится через ~25 минут.
                Вы можете встать в очередь — мы уведомим, как только место будет ваше.
              </p>
            </div>
          </GlassCard>

          {!joined ? (
            <>
              <GlassCard variant="medium" className="p-5 mb-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Гости</p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 8].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGuests(g)}
                      className={cn(
                        "px-4 py-2 rounded-2xl text-sm font-medium border transition",
                        guests === g
                          ? "bg-foreground text-background border-foreground"
                          : "bg-white/[0.04] text-foreground border-white/[0.06] hover:bg-white/[0.07]",
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </GlassCard>

              <GlassCard variant="medium" className="p-5 mb-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Уведомления</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setPushNotify((v) => !v)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold">Push-уведомление</div>
                      <div className="text-[11px] text-muted-foreground">в приложении и на экран блокировки</div>
                    </div>
                    <Toggle on={pushNotify} />
                  </button>
                  <button
                    onClick={() => setSmsNotify((v) => !v)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold">СМС</div>
                      <div className="text-[11px] text-muted-foreground">+50 ₸ за сообщение</div>
                    </div>
                    <Toggle on={smsNotify} />
                  </button>
                </div>
              </GlassCard>

              <PrimaryButton fullWidth size="lg" onClick={onJoin}>
                Встать в очередь · {guests} гостя
              </PrimaryButton>
            </>
          ) : (
            <>
              <GlassCard variant="heavy" rim className="p-7 text-center mb-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Ваше место в очереди</p>
                <motion.div
                  key={joined.position}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-3 mb-1"
                >
                  <span className="text-7xl md:text-8xl font-semibold tracking-tighter gold-text">
                    #{joined.position}
                  </span>
                </motion.div>
                <p className="text-sm text-muted-foreground mb-5">
                  из {joined.total} в очереди · ожидание ~{joined.eta} мин
                </p>

                {/* Visual queue ring */}
                <div className="flex items-center justify-center gap-1 my-4 flex-wrap">
                  {Array.from({ length: joined.total }).map((_, i) => {
                    const isMe = i === joined.position - 1;
                    const ahead = i < joined.position - 1;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold border",
                          isMe && "bg-[var(--gold)] text-black border-[var(--gold)] animate-pulse-soft scale-125",
                          ahead && "bg-white/[0.04] text-muted-foreground border-white/[0.08]",
                          !isMe && !ahead && "bg-white/[0.02] text-muted-foreground/60 border-white/[0.04]",
                        )}
                      >
                        {isMe ? "Я" : i + 1}
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground">
                  Очередь обновляется в реальном времени. Когда ваше место подойдёт, придёт push.
                </p>
              </GlassCard>

              <GlassCard variant="medium" className="p-5 mb-3">
                <div className="grid grid-cols-3 divide-x divide-white/[0.05] gap-0">
                  <div className="flex flex-col items-center text-center gap-1 px-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div className="text-[11px] text-muted-foreground">Гости</div>
                    <div className="text-sm font-semibold">{guests}</div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1 px-3">
                    <Clock3 className="w-4 h-4 text-muted-foreground" />
                    <div className="text-[11px] text-muted-foreground">Ожидание</div>
                    <div className="text-sm font-semibold">{joined.eta} мин</div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1 px-3">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div className="text-[11px] text-muted-foreground">Уведомления</div>
                    <div className="text-sm font-semibold">{pushNotify ? "Push" : "—"}{smsNotify ? " + СМС" : ""}</div>
                  </div>
                </div>
              </GlassCard>

              <div className="flex gap-2">
                <PrimaryButton
                  fullWidth
                  variant="ghost"
                  onClick={() => {
                    if (myEntries[0]) leave(myEntries[0].id);
                    setJoined(null);
                    toast.success("Вы вышли из очереди");
                    navigate({ to: "/restaurant/$id", params: { id: r.id } });
                  }}
                >
                  Выйти из очереди
                </PrimaryButton>
                <PrimaryButton fullWidth onClick={() => navigate({ to: "/home" })}>
                  Полистать другие
                </PrimaryButton>
              </div>
            </>
          )}

          {myEntries.length > 0 && !joined && (
            <GlassCard className="p-4 mt-4">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Активные очереди</p>
              <div className="space-y-2">
                {myEntries.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 p-2 rounded-2xl bg-white/[0.03]">
                    <img src={e.imageUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{e.restaurantName}</div>
                      <div className="text-[11px] text-muted-foreground">#{e.position} из {e.totalInQueue} · ~{e.estimatedWait} мин</div>
                    </div>
                    <Tag variant="gold">в очереди</Tag>
                    <button
                      onClick={() => toggleNotify(e.id, "notifyPush")}
                      className={cn(
                        "w-8 h-8 rounded-xl border flex items-center justify-center transition",
                        e.notifyPush ? "bg-[var(--gold)]/15 border-[var(--gold)]/40 text-[var(--gold)]" : "bg-white/[0.04] border-white/[0.06]",
                      )}
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </main>
    </Authed>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      className={cn(
        "w-10 h-6 rounded-full p-0.5 flex items-center transition-all",
        on ? "bg-[var(--gold)] justify-end" : "bg-white/[0.1] justify-start",
      )}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white shadow"
      />
    </div>
  );
}
