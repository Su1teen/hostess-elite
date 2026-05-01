import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronRight, Star, Sparkles, Ticket } from "lucide-react";
import { Authed } from "@/components/layout/Authed";
import { PageShell, SectionTitle } from "@/components/layout/PageShell";
import { GlassCard } from "@/components/layout/GlassCard";
import { Tag } from "@/components/common/Tag";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wallet")({
  component: WalletPage,
});

function QrPattern({ payload }: { payload: string }) {
  // Deterministic pseudo-QR — visual placeholder
  const seed = [...payload].reduce((a, c) => a + c.charCodeAt(0), 0);
  const grid = Array.from({ length: 21 }).map((_, i) =>
    Array.from({ length: 21 }).map((_, j) => {
      const v = (i * 31 + j * 17 + seed) % 7;
      return v < 3;
    }),
  );
  return (
    <div className="aspect-square bg-white rounded-xl p-2 grid grid-cols-21 gap-0">
      <div className="grid grid-cols-[repeat(21,1fr)] gap-[1px] w-full h-full">
        {grid.flat().map((on, i) => (
          <div key={i} className={cn("aspect-square", on ? "bg-black" : "bg-white")} />
        ))}
      </div>
    </div>
  );
}

function WalletPage() {
  const cards = useAppStore((s) => s.cards);
  const tickets = useAppStore((s) => s.tickets);
  const profile = useAppStore((s) => s.profile);
  const [activeIdx, setActiveIdx] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const expanded = cards.find((c) => c.id === expandedId);

  return (
    <Authed>
      <PageShell>
        <SectionTitle
          title="Кошелёк"
          subtitle="Карты лояльности, билеты и пропуска"
          action={
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <Plus className="w-4 h-4" /> Добавить
            </button>
          }
        />

        {/* Tier banner */}
        <GlassCard variant="medium" rim className="p-5 mb-4 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-[var(--gold)]/15 blur-3xl pointer-events-none" />
          <div className="relative grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Ваш статус</p>
              <h3 className="text-3xl font-semibold mt-0.5 gold-text">{profile.tier}</h3>
              <p className="text-[12px] text-foreground/80 mt-1">
                {profile.visits} визитов · {profile.totalSpent.toLocaleString("ru-RU")} ₸ оборот
              </p>
              <p className="text-[12px] text-foreground/80">
                Накоплено баллов: <span className="font-semibold">{profile.pointsBalance.toLocaleString("ru-RU")}</span>
              </p>
            </div>
            <div className="flex flex-col items-end justify-between text-right">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[var(--gold)] to-[var(--gold-soft)] flex items-center justify-center text-black">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div className="text-[11px] text-muted-foreground">До Black —<br />4 визита</div>
            </div>
          </div>
        </GlassCard>

        {/* Wallet stack */}
        <div className="relative h-[420px] md:h-[480px] flex items-start justify-center mb-4">
          <div className="relative w-full max-w-md">
            {cards.map((c, i) => {
              const offset = i - activeIdx;
              const isActive = offset === 0;
              return (
                <motion.button
                  key={c.id}
                  layoutId={c.id}
                  onClick={() => {
                    if (isActive) setExpandedId(c.id);
                    else setActiveIdx(i);
                  }}
                  initial={false}
                  animate={{
                    y: offset >= 0 ? offset * 56 : -32,
                    scale: 1 - Math.abs(offset) * 0.04,
                    opacity: Math.abs(offset) > 4 ? 0 : 1,
                    zIndex: 100 - Math.abs(offset),
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute left-0 right-0 mx-auto block w-full"
                  style={{ pointerEvents: Math.abs(offset) > 4 ? "none" : "auto" }}
                >
                  <CardFront card={c} />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tickets */}
        <SectionTitle title="Билеты на события" subtitle="Билеты сохраняются здесь автоматически" />
        {tickets.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <p className="text-muted-foreground text-sm">Билетов пока нет</p>
            <Link to="/events" className="text-[var(--gold)] text-sm hover:underline mt-2 inline-block">
              Открыть афишу →
            </Link>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {tickets.map((t) => (
              <GlassCard key={t.id} variant="medium" className="p-4 flex items-center gap-4">
                <img src={t.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{t.eventTitle}</h3>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(t.date).toLocaleDateString("ru-RU")} · {t.time} · {t.ticketTypeName}
                  </p>
                  <Tag variant="gold" className="mt-1.5">×{t.qty} билет</Tag>
                </div>
                <Ticket className="w-5 h-5 text-[var(--gold)]" />
              </GlassCard>
            ))}
          </div>
        )}

        {/* Expanded card modal */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setExpandedId(null)}
            >
              <motion.div
                layoutId={expanded.id}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <div className="relative">
                  <CardFront card={expanded} />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-3xl glass-medium p-4">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                        QR оплаты
                      </p>
                      <QrPattern payload={expanded.qrPayload} />
                      <p className="text-[10px] text-muted-foreground mt-2 text-center">
                        Покажите официанту, чтобы списать баллы
                      </p>
                    </div>
                    <div className="rounded-3xl glass-medium p-4 flex flex-col">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                        Баллы
                      </p>
                      <div className="text-3xl font-semibold gold-text">
                        {expanded.points.toLocaleString("ru-RU")}
                      </div>
                      <p className="text-[12px] text-muted-foreground mt-1">
                        конвертация 1 балл = 1 ₸
                      </p>
                      <div className="mt-auto pt-3">
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                          Срок
                        </p>
                        <p className="text-sm">{expanded.validUntil}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedId(null)}
                    className="mt-3 w-full glass rounded-2xl py-3 text-sm hover:bg-white/[0.07] transition"
                  >
                    Закрыть
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </PageShell>
    </Authed>
  );
}

function CardFront({ card }: { card: ReturnType<typeof useAppStore.getState>["cards"][number] }) {
  return (
    <div className={cn(
      "rounded-3xl overflow-hidden relative aspect-[1.6/1] bg-gradient-to-br shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
      card.bgGradient,
    )}>
      <img
        src={card.imageUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/60" />

      <div className="relative h-full p-5 flex flex-col justify-between text-left">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">Hostess Elite</p>
            <h3 className="text-xl md:text-2xl font-semibold text-white mt-1 tracking-tight">
              {card.restaurantName}
            </h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-[10px] uppercase tracking-[0.22em] text-white/85 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            {card.tier}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/55">Карта</p>
            <p className="text-base font-mono tracking-widest text-white/95 mt-1">{card.cardNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/55">Баллов</p>
            <p className="text-base font-semibold text-white mt-1">
              {card.points.toLocaleString("ru-RU")}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/60" />
        </div>
      </div>
    </div>
  );
}
