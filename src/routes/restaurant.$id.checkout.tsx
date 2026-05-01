import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CreditCard,
  Lock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Authed } from "@/components/layout/Authed";
import { GlassCard } from "@/components/layout/GlassCard";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { useAppStore } from "@/store/app-store";
import { MENUS } from "@/data/menus";
import { getRestaurantById } from "@/data/restaurants";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  guests: z.coerce.number().min(1).max(20).default(2),
  time: z.string().default("19:30"),
  table: z.coerce.number().default(1),
  day: z.coerce.number().default(0),
  comment: z.string().default(""),
});

export const Route = createFileRoute("/restaurant/$id/checkout")({
  component: CheckoutPage,
  validateSearch: searchSchema.parse,
});

function CheckoutPage() {
  const { id } = Route.useParams();
  const r = getRestaurantById(id)!;
  const search = Route.useSearch();
  const navigate = useNavigate();

  const cart = useAppStore((s) => s.cart);
  const items = MENUS[r.id] ?? [];
  const addBooking = useAppStore((s) => s.addBooking);
  const clearCart = useAppStore((s) => s.clearCart);

  const preorder = useMemo(() => {
    if (cart.restaurantId !== r.id) return { items: [] as { itemId: string; name: string; qty: number; price: number }[], sum: 0 };
    const out: { itemId: string; name: string; qty: number; price: number }[] = [];
    let sum = 0;
    for (const [iid, qty] of Object.entries(cart.items)) {
      const it = items.find((m) => m.id === iid);
      if (!it) continue;
      out.push({ itemId: iid, name: it.name, qty, price: it.price });
      sum += it.price * qty;
    }
    return { items: out, sum };
  }, [cart, items, r.id]);

  const deposit = Math.round(r.averageBill * search.guests * 0.3);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "kaspi">("card");
  const [cardNumber, setCardNumber] = useState("4400 4300 ");
  const [cvv, setCvv] = useState("");
  const [exp, setExp] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const dateObj = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + search.day);
    return d;
  }, [search.day]);

  const dateLabel = useMemo(() => {
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]}`;
  }, [dateObj]);

  const submit = () => {
    setProcessing(true);
    setTimeout(() => {
      const id = `bk-${Date.now()}`;
      addBooking({
        id,
        restaurantId: r.id,
        restaurantName: r.name,
        imageUrl: r.imageUrl,
        date: dateObj.toISOString(),
        time: search.time,
        guests: search.guests,
        tableNumber: search.table,
        zone: "Зал",
        status: "confirmed",
        deposit,
        preorderTotal: preorder.sum,
        preorderItems: preorder.items,
        comment: search.comment,
        createdAt: new Date().toISOString(),
      });
      clearCart();
      setProcessing(false);
      setDone(true);
      toast.success("Бронь подтверждена");
    }, 1400);
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
              <h1 className="text-2xl font-semibold tracking-tight">Бронь подтверждена</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {r.name} · {dateLabel} в {search.time} · стол №{search.table}
              </p>
              <div className="my-5 p-4 bg-white/[0.04] rounded-2xl text-left text-sm space-y-1.5">
                <div className="flex justify-between"><span className="text-muted-foreground">Гости</span><span>{search.guests}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Депозит списан</span><span>{deposit.toLocaleString("ru-RU")} ₸</span></div>
                {preorder.sum > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Предзаказ</span><span>{preorder.sum.toLocaleString("ru-RU")} ₸</span></div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t border-white/[0.08]">
                  <span>В счёт ужина</span>
                  <span>{deposit.toLocaleString("ru-RU")} ₸ зачтено</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/bookings"
                  className="flex-1 rounded-2xl py-3 text-sm font-medium glass border-white/[0.1] text-center hover:bg-white/[0.07] transition"
                >
                  Мои брони
                </Link>
                <PrimaryButton
                  fullWidth
                  onClick={() => navigate({ to: "/home" })}
                >
                  На главную
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
      <main className="min-h-dvh pt-4 md:pt-20 pb-32 md:pb-12">
        <div className="mx-auto w-full max-w-[820px] px-4 md:px-6">
          <div className="flex items-center gap-3 mb-3">
            <Link
              to="/restaurant/$id/book"
              params={{ id: r.id }}
              className="w-10 h-10 rounded-full glass border-white/[0.08] flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs text-muted-foreground">Оплата депозита</p>
              <h1 className="text-xl font-semibold tracking-tight">{r.name}</h1>
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr_360px] gap-4">
            <div className="space-y-3">
              <GlassCard variant="medium" className="p-5">
                <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Способ оплаты</h2>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: "card", label: "Карта", desc: "Visa · Master · Amex" },
                    { id: "apple", label: "Apple Pay", desc: "Touch ID" },
                    { id: "kaspi", label: "Kaspi", desc: "QR · авто" },
                  ] as const).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={cn(
                        "p-3 rounded-2xl text-left border transition",
                        paymentMethod === m.id
                          ? "bg-foreground/10 border-[var(--gold)]/40 ring-1 ring-[var(--gold)]/30"
                          : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07]",
                      )}
                    >
                      <div className="text-sm font-semibold">{m.label}</div>
                      <div className="text-[11px] text-muted-foreground">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </GlassCard>

              {paymentMethod === "card" && (
                <GlassCard variant="medium" className="p-5">
                  <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Данные карты</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-muted-foreground">Номер карты</label>
                      <input
                        value={cardNumber}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                          setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
                        }}
                        placeholder="0000 0000 0000 0000"
                        className="mt-1 w-full bg-white/[0.05] rounded-xl px-3.5 py-2.5 outline-none border border-white/[0.08] focus:border-[var(--gold)]/40 transition tracking-widest"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-muted-foreground">Срок (мм/гг)</label>
                        <input
                          value={exp}
                          onChange={(e) => {
                            const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                            setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                          }}
                          placeholder="12/27"
                          className="mt-1 w-full bg-white/[0.05] rounded-xl px-3.5 py-2.5 outline-none border border-white/[0.08] focus:border-[var(--gold)]/40 transition"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted-foreground">CVC</label>
                        <input
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                          placeholder="•••"
                          className="mt-1 w-full bg-white/[0.05] rounded-xl px-3.5 py-2.5 outline-none border border-white/[0.08] focus:border-[var(--gold)]/40 transition"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Защищено 3-D Secure. Платёж проходит через банк-эквайер.
                  </p>
                </GlassCard>
              )}

              <GlassCard className="p-4 flex items-start gap-3 bg-[var(--gold)]/5 border-[var(--gold)]/20">
                <Sparkles className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" />
                <p className="text-[12px] text-foreground/85 leading-relaxed">
                  Депозит — невозвратный. При визите засчитывается в счёт ужина 1:1. При отмене позже чем за 6 часов депозит сгорает.
                </p>
              </GlassCard>
            </div>

            <div className="space-y-3">
              <GlassCard variant="heavy" rim className="p-5 sticky top-24">
                <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Сводка</h2>
                <div className="rounded-2xl overflow-hidden mb-3">
                  <img src={r.imageUrl} alt={r.name} className="w-full aspect-[16/10] object-cover" />
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дата</span>
                    <span>{dateLabel} · {search.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Гости</span>
                    <span>{search.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Стол</span>
                    <span>№{search.table}</span>
                  </div>
                  {preorder.sum > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Предзаказ</span>
                      <span>{preorder.sum.toLocaleString("ru-RU")} ₸</span>
                    </div>
                  )}
                  <div className="border-t border-white/[0.08] my-2" />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Депозит</span>
                    <span>{deposit.toLocaleString("ru-RU")} ₸</span>
                  </div>
                </div>

                <PrimaryButton
                  fullWidth
                  size="lg"
                  className="mt-4"
                  onClick={submit}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Оплатить {deposit.toLocaleString("ru-RU")} ₸
                    </>
                  )}
                </PrimaryButton>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </Authed>
  );
}
