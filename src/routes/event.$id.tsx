import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Ticket,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Authed } from "@/components/layout/Authed";
import { GlassCard } from "@/components/layout/GlassCard";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { IconButton } from "@/components/common/IconButton";
import { Tag } from "@/components/common/Tag";
import { ShareSheet } from "@/components/social/ShareSheet";
import { getEventById } from "@/data/events";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/event/$id")({
  component: EventDetail,
});

function EventDetail() {
  const { id } = Route.useParams();
  const ev = getEventById(id);
  const addTickets = useAppStore((s) => s.addTickets);
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [done, setDone] = useState(false);

  if (!ev) {
    return (
      <Authed>
        <div className="min-h-dvh flex items-center justify-center">Не найдено</div>
      </Authed>
    );
  }
  const d = new Date(ev.date);
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const dateLabel = `${d.getDate()} ${months[d.getMonth()]}`;
  const ticket = ev.ticketTypes.find((t) => t.id === selectedTicket);
  const total = (ticket?.price ?? 0) * qty;

  const buy = () => {
    if (!ticket) return;
    addTickets({
      id: `t-${Date.now()}`,
      eventId: ev.id,
      eventTitle: ev.title,
      ticketTypeName: ticket.name,
      date: ev.date,
      time: ev.time,
      price: ticket.price,
      qty,
      createdAt: new Date().toISOString(),
      imageUrl: ev.imageUrl,
    });
    setDone(true);
    toast.success("Билет в Кошельке");
  };

  if (done) {
    return (
      <Authed>
        <main className="min-h-dvh flex items-center justify-center px-4 py-10">
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full"
          >
            <GlassCard variant="heavy" rim className="p-7 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.15 }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-b from-[var(--gold)] to-[var(--gold-soft)] flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-black" strokeWidth={2.5} />
              </motion.div>
              <h1 className="text-2xl font-semibold tracking-tight">Билет ваш</h1>
              <p className="text-sm text-muted-foreground mt-1">{ev.title} · {dateLabel} · {ev.time}</p>
              <div className="my-5 p-4 bg-white/[0.04] rounded-2xl text-left text-sm space-y-1.5">
                <div className="flex justify-between"><span className="text-muted-foreground">Тариф</span><span>{ticket?.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Гостей</span><span>{qty}</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t border-white/[0.08]">
                  <span>Оплачено</span>
                  <span>{total.toLocaleString("ru-RU")} ₸</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/wallet"
                  className="flex-1 rounded-2xl py-3 text-sm font-medium glass border-white/[0.1] text-center hover:bg-white/[0.07] transition"
                >
                  Кошелёк
                </Link>
                <PrimaryButton fullWidth onClick={() => navigate({ to: "/events" })}>
                  Назад к афише
                </PrimaryButton>
              </div>
            </GlassCard>
          </motion.div>
        </main>
      </Authed>
    );
  }

  return (
    <Authed>
      <main className="min-h-dvh pb-32 md:pt-20">
        <div className="relative">
          <div className="aspect-[4/3] md:aspect-[21/8] relative overflow-hidden md:rounded-b-[40px]">
            <img src={ev.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black" />
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between md:hidden">
              <Link
                to="/events"
                className="w-10 h-10 rounded-full glass border-white/[0.08] flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <IconButton onClick={() => setShareOpen(true)}>
                <Share2 className="w-4 h-4" />
              </IconButton>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6 -mt-8 relative">
          <GlassCard variant="medium" rim className="p-5 md:p-7 mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Tag variant="muted">{ev.type}</Tag>
              {ev.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">{ev.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{ev.venueName}</p>

            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {dateLabel}
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {ev.time}
              </div>
              <div className="flex items-center gap-2.5">
                <Ticket className="w-4 h-4 text-muted-foreground" />
                {ev.ticketsLeft} билетов
              </div>
            </div>

            <p className="mt-4 text-[14px] text-foreground/85 leading-relaxed">{ev.longDescription}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {ev.artistsOrHosts.map((a) => (
                <span key={a} className="text-[12px] px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.06]">
                  {a}
                </span>
              ))}
            </div>
          </GlassCard>

          <div className="grid md:grid-cols-[1fr_400px] gap-4">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">Тарифы</h2>
              {ev.ticketTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicket(t.id)}
                  className={cn(
                    "w-full text-left rounded-2xl p-4 border transition",
                    selectedTicket === t.id
                      ? "bg-gradient-to-b from-white/[0.1] to-white/[0.02] border-[var(--gold)]/40 ring-1 ring-[var(--gold)]/30"
                      : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-base font-semibold">{t.name}</div>
                      <ul className="mt-2 space-y-1">
                        {t.perks.map((p) => (
                          <li key={p} className="text-[12px] text-foreground/75 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 text-[11px] text-muted-foreground">осталось {t.left} мест</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-semibold">{t.price.toLocaleString("ru-RU")} ₸</div>
                      <div className="text-[11px] text-muted-foreground">за гостя</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <GlassCard variant="heavy" rim className="p-5 md:sticky md:top-24 h-fit">
              <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                Покупка
              </h2>
              {!ticket ? (
                <p className="text-sm text-muted-foreground">Выберите тариф слева, чтобы продолжить.</p>
              ) : (
                <>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Тариф</span><span>{ticket.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Цена</span><span>{ticket.price.toLocaleString("ru-RU")} ₸</span></div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Гостей</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">−</button>
                      <span className="w-7 text-center font-semibold">{qty}</span>
                      <button onClick={() => setQty((q) => Math.min(ticket.left, q + 1))} className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">+</button>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-white/[0.08] pt-3 flex justify-between text-base font-semibold">
                    <span>К оплате</span>
                    <span>{total.toLocaleString("ru-RU")} ₸</span>
                  </div>
                  <PrimaryButton fullWidth size="lg" className="mt-4" onClick={buy}>
                    <Ticket className="w-4 h-4" />
                    Купить билет
                  </PrimaryButton>
                </>
              )}
              <button
                onClick={() => setShareOpen(true)}
                className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                Поделиться событием
              </button>
            </GlassCard>
          </div>
        </div>

        <ShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title={ev.title}
          subtitle={`${dateLabel} · ${ev.time} · от ${ev.priceFrom.toLocaleString("ru-RU")} ₸`}
          image={ev.imageUrl}
          url={`hostess.app/e/${ev.id}`}
        />
      </main>
    </Authed>
  );
}
