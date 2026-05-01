import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Minus, Sparkles, ShoppingBag } from "lucide-react";
import { Authed } from "@/components/layout/Authed";
import { GlassCard } from "@/components/layout/GlassCard";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Tag } from "@/components/common/Tag";
import { useAppStore } from "@/store/app-store";
import { MENUS } from "@/data/menus";
import { getRestaurantById } from "@/data/restaurants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/restaurant/$id/preorder")({
  component: PreorderPage,
});

function PreorderPage() {
  const { id } = Route.useParams();
  const r = getRestaurantById(id)!;
  const items = MENUS[r.id] ?? [];
  const navigate = useNavigate();

  const cart = useAppStore((s) => s.cart);
  const setCartRestaurant = useAppStore((s) => s.setCartRestaurant);
  const add = useAppStore((s) => s.addToCart);
  const remove = useAppStore((s) => s.removeFromCart);

  useEffect(() => {
    setCartRestaurant(r.id);
  }, [r.id, setCartRestaurant]);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return Array.from(set);
  }, [items]);

  const [active, setActive] = useState(categories[0]);

  const total = useMemo(() => {
    if (cart.restaurantId !== r.id) return { sum: 0, count: 0 };
    let sum = 0;
    let count = 0;
    for (const [iid, qty] of Object.entries(cart.items)) {
      const it = items.find((m) => m.id === iid);
      if (!it) continue;
      sum += it.price * qty;
      count += qty;
    }
    return { sum, count };
  }, [cart, items, r.id]);

  return (
    <Authed>
      <main className="min-h-dvh pt-4 md:pt-20 pb-40 md:pb-12">
        <div className="mx-auto w-full max-w-[900px] px-4 md:px-6">
          <div className="flex items-center gap-3 mb-3">
            <Link
              to="/restaurant/$id"
              params={{ id: r.id }}
              className="w-10 h-10 rounded-full glass border-white/[0.08] flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs text-muted-foreground">Предзаказ</p>
              <h1 className="text-xl font-semibold tracking-tight">{r.name}</h1>
            </div>
          </div>

          <div className="sticky top-2 md:top-20 z-10 -mx-4 px-4 md:mx-0 md:px-0 mb-3 backdrop-blur-md bg-background/40">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setActive(c);
                    document.getElementById(`cat-${c}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cn(
                    "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition",
                    active === c
                      ? "bg-foreground text-background border-foreground"
                      : "bg-white/[0.04] text-muted-foreground border-white/[0.06] hover:bg-white/[0.07]",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {categories.map((cat) => {
            const list = items.filter((i) => i.category === cat);
            return (
              <section key={cat} id={`cat-${cat}`} className="scroll-mt-24 mt-5">
                <h2 className="text-base font-semibold tracking-tight mb-3 flex items-center gap-2">
                  {cat === "Сигнатурные" && <Sparkles className="w-4 h-4 text-[var(--gold)]" />}
                  {cat}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {list.map((it, i) => {
                    const qty = cart.restaurantId === r.id ? cart.items[it.id] ?? 0 : 0;
                    return (
                      <motion.div
                        key={it.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                        className="glass rounded-2xl p-3 flex gap-3 border border-white/[0.06]"
                      >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 relative">
                          <img src={it.imageUrl} alt="" className="w-full h-full object-cover" />
                          {it.isSignature && (
                            <div className="absolute top-1 right-1">
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--gold)] text-black font-semibold">★</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="text-sm font-semibold leading-snug">{it.name}</div>
                          <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{it.description}</div>
                          <div className="mt-auto flex items-center justify-between">
                            <div>
                              <span className="text-base font-semibold">{it.price.toLocaleString("ru-RU")} ₸</span>
                              {it.weight && <span className="text-[11px] text-muted-foreground ml-2">{it.weight}</span>}
                            </div>
                            {qty === 0 ? (
                              <button
                                onClick={() => add(r.id, it.id)}
                                className="w-9 h-9 rounded-full bg-[var(--gold)] text-black flex items-center justify-center hover:scale-105 transition"
                              >
                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => remove(it.id)}
                                  className="w-9 h-9 rounded-full glass border-white/[0.1] flex items-center justify-center hover:bg-white/[0.07]"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-7 text-center font-semibold">{qty}</span>
                                <button
                                  onClick={() => add(r.id, it.id)}
                                  className="w-9 h-9 rounded-full bg-[var(--gold)] text-black flex items-center justify-center hover:scale-105 transition"
                                >
                                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <AnimatePresence>
          {total.count > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-20 md:bottom-6 left-0 right-0 z-30 px-4 pointer-events-none"
            >
              <div className="mx-auto max-w-md glass-heavy glass-rim rounded-2xl p-3 flex items-center gap-3 pointer-events-auto">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[var(--gold)] text-black flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground">{total.count} позиций</div>
                    <div className="text-base font-semibold">{total.sum.toLocaleString("ru-RU")} ₸</div>
                  </div>
                </div>
                <PrimaryButton
                  onClick={() => navigate({ to: "/restaurant/$id/book", params: { id: r.id } })}
                >
                  К бронированию
                </PrimaryButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Tag className="hidden">__</Tag>
      </main>
    </Authed>
  );
}
