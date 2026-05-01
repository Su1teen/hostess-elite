import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, MapPin, X, MessageSquare, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Authed } from "@/components/layout/Authed";
import { PageShell, SectionTitle } from "@/components/layout/PageShell";
import { GlassCard } from "@/components/layout/GlassCard";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Tag } from "@/components/common/Tag";
import { ShareSheet } from "@/components/social/ShareSheet";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  const bookings = useAppStore((s) => s.bookings);
  const cancel = useAppStore((s) => s.cancelBooking);
  const waitlist = useAppStore((s) => s.waitlist);
  const [tab, setTab] = useState<"upcoming" | "past" | "waitlist">("upcoming");
  const [shareItem, setShareItem] = useState<{ title: string; subtitle: string; image: string; url: string } | null>(null);

  const monthName = (m: number) =>
    ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"][m];

  const upcoming = bookings.filter((b) => b.status === "confirmed" && new Date(b.date) >= new Date());
  const past = bookings.filter((b) => b.status !== "confirmed" || new Date(b.date) < new Date());

  return (
    <Authed>
      <PageShell>
        <SectionTitle title="Мои брони" subtitle="Все ваши столы и очереди в одном месте" />

        <div className="flex gap-2 mb-4">
          {([
            { id: "upcoming", label: "Предстоящие", count: upcoming.length },
            { id: "past", label: "История", count: past.length },
            { id: "waitlist", label: "Очереди", count: waitlist.length },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "px-4 py-2 rounded-2xl text-sm font-medium border transition flex items-center gap-2",
                tab === t.id
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white/[0.04] text-muted-foreground border-white/[0.06] hover:bg-white/[0.07]",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "text-[10px] rounded-full px-1.5 py-0.5",
                  tab === t.id ? "bg-background/20 text-background" : "bg-white/[0.08] text-foreground",
                )}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {tab === "upcoming" && (
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <GlassCard className="p-8 text-center">
                <p className="text-muted-foreground">Нет активных броней</p>
                <Link
                  to="/home"
                  className="inline-flex mt-3 text-sm text-[var(--gold)] hover:text-[var(--gold-soft)] transition"
                >
                  Найти ресторан →
                </Link>
              </GlassCard>
            )}
            {upcoming.map((b, i) => {
              const d = new Date(b.date);
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <GlassCard variant="medium" className="overflow-hidden">
                    <div className="grid md:grid-cols-[200px_1fr] gap-0">
                      <div className="aspect-[16/10] md:aspect-auto relative">
                        <img src={b.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Tag variant="gold">подтверждено</Tag>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold tracking-tight">{b.restaurantName}</h3>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3 text-sm">
                          <div className="flex items-center gap-2 text-foreground/85">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            {d.getDate()} {monthName(d.getMonth())}
                          </div>
                          <div className="flex items-center gap-2 text-foreground/85">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            {b.time}
                          </div>
                          <div className="flex items-center gap-2 text-foreground/85">
                            <Users className="w-3.5 h-3.5 text-muted-foreground" />
                            {b.guests} гостя
                          </div>
                          <div className="flex items-center gap-2 text-foreground/85">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            Стол №{b.tableNumber} · {b.zone}
                          </div>
                        </div>
                        {b.preorderItems.length > 0 && (
                          <div className="mt-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Предзаказ</p>
                            <ul className="text-[12px] space-y-0.5">
                              {b.preorderItems.map((it) => (
                                <li key={it.itemId} className="flex justify-between">
                                  <span className="text-foreground/85">
                                    {it.qty}× {it.name}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {(it.price * it.qty).toLocaleString("ru-RU")} ₸
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <PrimaryButton
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setShareItem({
                                title: `${b.restaurantName} · ${b.time}`,
                                subtitle: `${d.getDate()} ${monthName(d.getMonth())} · стол №${b.tableNumber}`,
                                image: b.imageUrl,
                                url: `hostess.app/b/${b.id}`,
                              })
                            }
                          >
                            <Share2 className="w-4 h-4" /> Поделиться
                          </PrimaryButton>
                          <PrimaryButton
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.info("Чат с заведением открыт")}
                          >
                            <MessageSquare className="w-4 h-4" /> Связаться
                          </PrimaryButton>
                          <PrimaryButton
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              cancel(b.id);
                              toast.error("Бронь отменена. Депозит сгорел.");
                            }}
                          >
                            <X className="w-4 h-4" /> Отменить
                          </PrimaryButton>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {tab === "past" && (
          <div className="space-y-3">
            {past.length === 0 && (
              <GlassCard className="p-8 text-center">
                <p className="text-muted-foreground">История пустая</p>
              </GlassCard>
            )}
            {past.map((b) => {
              const d = new Date(b.date);
              return (
                <GlassCard key={b.id} className="p-4 flex gap-3 items-center opacity-90">
                  <img src={b.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold">{b.restaurantName}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {d.getDate()} {monthName(d.getMonth())} · {b.time} · {b.guests} гостя
                    </p>
                    <div className="mt-1.5">
                      <Tag variant={b.status === "completed" ? "gold" : b.status === "cancelled" ? "danger" : "muted"}>
                        {b.status === "completed" ? "посещено" : b.status === "cancelled" ? "отменено" : b.status}
                      </Tag>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.info("Открыть отзыв")}
                    className="text-[12px] text-muted-foreground hover:text-foreground transition"
                  >
                    Оставить отзыв →
                  </button>
                </GlassCard>
              );
            })}
          </div>
        )}

        {tab === "waitlist" && (
          <div className="space-y-3">
            {waitlist.length === 0 && (
              <GlassCard className="p-8 text-center">
                <p className="text-muted-foreground">Вы не в очередях</p>
              </GlassCard>
            )}
            {waitlist.map((w) => (
              <GlassCard key={w.id} variant="medium" className="p-4 flex items-center gap-4">
                <img src={w.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{w.restaurantName}</h3>
                  <p className="text-[11px] text-muted-foreground">
                    {w.guests} гостя · ожидание ~{w.estimatedWait} мин
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold gold-text">#{w.position}</div>
                  <div className="text-[11px] text-muted-foreground">из {w.totalInQueue}</div>
                </div>
                <Link
                  to="/restaurant/$id/waitlist"
                  params={{ id: w.restaurantId }}
                  className="rounded-xl px-3 py-2 bg-white/[0.05] hover:bg-white/[0.08] transition text-xs"
                >
                  Открыть
                </Link>
              </GlassCard>
            ))}
          </div>
        )}

        {shareItem && (
          <ShareSheet
            open={!!shareItem}
            onClose={() => setShareItem(null)}
            title={shareItem.title}
            subtitle={shareItem.subtitle}
            image={shareItem.image}
            url={shareItem.url}
          />
        )}
      </PageShell>
    </Authed>
  );
}
