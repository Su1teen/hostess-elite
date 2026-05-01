import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Ticket, ChevronRight, Sparkles } from "lucide-react";
import { Authed } from "@/components/layout/Authed";
import { PageShell, SectionTitle } from "@/components/layout/PageShell";
import { GlassCard } from "@/components/layout/GlassCard";
import { Tag } from "@/components/common/Tag";
import { EVENTS } from "@/data/events";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({
  component: EventsPage,
});

const TYPES = ["Все", "Концерт", "Вечеринка", "Дегустация", "Ужин", "Стендап", "Перформанс", "Закрытый показ"] as const;

function EventsPage() {
  const tickets = useAppStore((s) => s.tickets);
  const [type, setType] = useState<(typeof TYPES)[number]>("Все");
  const [activeDay, setActiveDay] = useState(0);

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }, []);

  const dayName = (d: Date) => ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][d.getDay()];

  const filtered = useMemo(() => {
    return EVENTS.filter((e) => {
      const ed = new Date(e.date);
      ed.setHours(0, 0, 0, 0);
      const sameDay = ed.getTime() === days[activeDay].getTime();
      const sameType = type === "Все" || e.type === type;
      return sameDay && sameType;
    });
  }, [activeDay, type, days]);

  return (
    <Authed>
      <PageShell>
        <SectionTitle
          title="События недели"
          subtitle="Концерты, дегустации, закрытые ужины"
          action={
            tickets.length > 0 && (
              <Link
                to="/events"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <Ticket className="w-4 h-4" /> Мои билеты {tickets.length}
              </Link>
            )
          }
        />

        {/* Calendar strip */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-1 mb-3">
          {days.map((d, i) => {
            const count = EVENTS.filter((e) => {
              const ed = new Date(e.date);
              ed.setHours(0, 0, 0, 0);
              return ed.getTime() === d.getTime();
            }).length;
            return (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={cn(
                  "shrink-0 w-16 px-2 py-3 rounded-2xl border text-center transition-all",
                  activeDay === i
                    ? "bg-foreground text-background border-foreground shadow-[0_0_24px_rgba(255,255,255,0.1)]"
                    : "bg-white/[0.04] text-foreground border-white/[0.06] hover:bg-white/[0.07]",
                )}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-70">
                  {i === 0 ? "Сегодня" : i === 1 ? "Завтра" : dayName(d)}
                </div>
                <div className="text-lg font-semibold mt-1">{d.getDate()}</div>
                <div className="text-[10px] opacity-60">{count > 0 ? `${count} соб.` : "—"}</div>
              </button>
            );
          })}
        </div>

        {/* Type filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-2 mb-3">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition",
                type === t
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white/[0.04] text-muted-foreground border-white/[0.06] hover:bg-white/[0.07]",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tickets */}
        {tickets.length > 0 && (
          <>
            <SectionTitle title="Ваши билеты" subtitle="Сохранены в Кошелёк" />
            <div className="grid md:grid-cols-2 gap-3 mb-3">
              {tickets.map((t) => (
                <GlassCard key={t.id} variant="medium" className="p-4 flex items-center gap-4">
                  <img src={t.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{t.eventTitle}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(t.date).toLocaleDateString("ru-RU")} · {t.time} · {t.ticketTypeName}
                    </p>
                    <div className="mt-1.5">
                      <Tag variant="gold">×{t.qty} билет</Tag>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </>
        )}

        <SectionTitle title={filtered.length === 0 ? "Нет событий в этот день" : "Афиша"} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((ev, i) => {
            const d = new Date(ev.date);
            const sold = ev.totalTickets - ev.ticketsLeft;
            const soldOutSoon = ev.ticketsLeft / ev.totalTickets < 0.2;
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to="/event/$id"
                  params={{ id: ev.id }}
                  className="block group relative overflow-hidden rounded-3xl border border-white/[0.06] hover:border-white/[0.14] transition-all"
                >
                  <div className="aspect-[16/10] relative">
                    <img
                      src={ev.imageUrl}
                      alt={ev.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      <Tag variant="muted">{ev.type}</Tag>
                      {soldOutSoon && (
                        <Tag variant="burgundy">
                          <Sparkles className="w-3 h-3" />
                          мало билетов
                        </Tag>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-semibold text-white">{ev.title}</h3>
                      <p className="text-[12px] text-white/75 truncate">{ev.venueName}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[12px] text-white/85">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {d.getDate()}.{(d.getMonth() + 1).toString().padStart(2, "0")}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {ev.time}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/70" />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pt-3 pb-3.5 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">от </span>
                      <span className="font-semibold">{ev.priceFrom.toLocaleString("ru-RU")} ₸</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {sold} / {ev.totalTickets} мест продано
                    </div>
                  </div>
                  {/* progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/[0.06]">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--gold)] to-amber-400"
                      style={{ width: `${(sold / ev.totalTickets) * 100}%` }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <GlassCard className="p-8 text-center mt-3">
            <p className="text-muted-foreground">В этот день событий по выбранному типу нет.</p>
          </GlassCard>
        )}
      </PageShell>
    </Authed>
  );
}
