import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  Heart,
  Share2,
  Phone,
  Sparkles,
  Flame,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Authed } from "@/components/layout/Authed";
import { GlassCard } from "@/components/layout/GlassCard";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { IconButton } from "@/components/common/IconButton";
import { Tag } from "@/components/common/Tag";
import { ShareSheet } from "@/components/social/ShareSheet";
import { MENUS } from "@/data/menus";
import { getRestaurantById } from "@/data/restaurants";

export const Route = createFileRoute("/restaurant/$id")({
  component: RestaurantDetail,
});

function RestaurantDetail() {
  const { id } = Route.useParams();
  const r = getRestaurantById(id);
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  if (!r) {
    return (
      <Authed>
        <div className="min-h-dvh flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Ресторан не найден</p>
            <Link to="/home" className="text-[var(--gold)] mt-2 inline-block">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </Authed>
    );
  }

  const menu = MENUS[r.id] ?? [];
  const signatureItems = menu.filter((m) => m.isSignature).slice(0, 4);
  const gallery = [r.imageUrl, ...r.galleryUrls];

  return (
    <Authed>
      <main className="min-h-dvh pb-32 md:pt-20">
        {/* Hero */}
        <div className="relative">
          <div className="md:rounded-b-[40px] md:overflow-hidden">
            <div className="aspect-[4/3] md:aspect-[21/8] relative overflow-hidden">
              <img
                src={gallery[activeImg]}
                alt={r.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black" />

              {/* Top bar */}
              <div className="absolute top-3 left-3 right-3 flex items-start justify-between md:hidden">
                <button
                  onClick={() => navigate({ to: "/home" })}
                  className="w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  <IconButton onClick={() => setLiked((v) => !v)} active={liked}>
                    <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                  </IconButton>
                  <IconButton onClick={() => setShareOpen(true)}>
                    <Share2 className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>

              {/* Gallery dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-1 rounded-full transition-all ${
                      i === activeImg ? "w-7 bg-white" : "w-3 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6 -mt-8 relative">
          <GlassCard variant="medium" rim className="p-5 md:p-7 mb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Tag variant="muted">{r.cuisine}</Tag>
                  {r.hasLastMinute && r.lastMinuteDiscount && (
                    <Tag variant="burgundy">
                      <Flame className="w-3 h-3" />-{r.lastMinuteDiscount}% сейчас
                    </Tag>
                  )}
                  {r.vipRoom && <Tag variant="gold">VIP-зал</Tag>}
                </div>
                <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">{r.name}</h1>
                <p className="mt-2 text-[13px] md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {r.longDescription}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <IconButton onClick={() => setLiked((v) => !v)} active={liked}>
                  <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                </IconButton>
                <IconButton onClick={() => setShareOpen(true)}>
                  <Share2 className="w-4 h-4" />
                </IconButton>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <Star className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
                </div>
                <div>
                  <div className="font-semibold">{r.rating}</div>
                  <div className="text-[11px] text-muted-foreground">{r.reviewsCount.toLocaleString("ru-RU")} отзывов</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-foreground/70" />
                </div>
                <div>
                  <div className="font-semibold">{r.distanceKm} км</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">{r.address}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-foreground/70" />
                </div>
                <div>
                  <div className="font-semibold">{r.hours}</div>
                  <div className="text-[11px] text-muted-foreground">{r.isOpenNow ? "сейчас открыто" : "закрыто"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <Users className="w-4 h-4 text-foreground/70" />
                </div>
                <div>
                  <div className="font-semibold">
                    {r.occupancy > 80 ? "Заполнен" : r.occupancy > 50 ? "Свободно" : "Тихо"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{r.occupancy}% загрузки</div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Signature dishes */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                Сигнатурные блюда
              </h2>
              <Link
                to="/restaurant/$id/preorder"
                params={{ id: r.id }}
                className="text-[13px] text-muted-foreground hover:text-foreground transition"
              >
                Полное меню →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {signatureItems.map((it, i) => (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-2xl overflow-hidden border border-white/[0.06]"
                >
                  <div className="aspect-square relative">
                    <img src={it.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <Tag variant="gold">⭐</Tag>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-[13px] font-semibold leading-tight line-clamp-2">{it.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {it.weight} · {it.price.toLocaleString("ru-RU")} ₸
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gallery thumbnails */}
          <GlassCard className="p-4 mb-4">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Атмосфера</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-xl overflow-hidden ring-2 transition-all ${
                    i === activeImg ? "ring-[var(--gold)]" : "ring-transparent hover:ring-white/30"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Reviews preview */}
          <GlassCard className="p-5 mb-4">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Отзывы</h2>
            <div className="space-y-3">
              {[
                {
                  name: "Алия М.",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop",
                  text: "Идеальный вечер. Сомелье подобрал бесподобный пейринг к стейку, шеф вышел поздороваться. Уровень.",
                  rating: 5,
                  date: "вчера",
                },
                {
                  name: "Тимур Ж.",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop",
                  text: "Бронирую сюда всех клиентов. Тихо, респектабельно, безупречная подача.",
                  rating: 5,
                  date: "3 дня назад",
                },
              ].map((rv, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <img src={rv.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">{rv.name}</div>
                      <div className="text-[11px] text-muted-foreground">{rv.date}</div>
                    </div>
                    <div className="flex gap-0.5 my-1">
                      {Array.from({ length: rv.rating }).map((_, k) => (
                        <Star key={k} className="w-3 h-3 fill-[var(--gold)] text-[var(--gold)]" />
                      ))}
                    </div>
                    <p className="text-[13px] text-foreground/85 leading-relaxed">{rv.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sticky bottom action bar */}
        <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-40 px-4 pointer-events-none">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-md glass-heavy glass-rim rounded-2xl p-2.5 flex items-center gap-2 pointer-events-auto"
          >
            <button
              onClick={() => toast.info("Ассистент позвонит в ресторан и отправит подтверждение")}
              className="rounded-xl p-3 bg-white/[0.05] hover:bg-white/[0.08] transition"
            >
              <Phone className="w-4 h-4" />
            </button>
            <Link
              to="/restaurant/$id/waitlist"
              params={{ id: r.id }}
              className="rounded-xl px-3.5 py-3 bg-white/[0.05] text-sm hover:bg-white/[0.08] transition flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Очередь
            </Link>
            <PrimaryButton
              fullWidth
              size="md"
              onClick={() => navigate({ to: "/restaurant/$id/book", params: { id: r.id } })}
            >
              Забронировать
            </PrimaryButton>
          </motion.div>
        </div>

        <ShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title={r.name}
          subtitle={`${r.cuisine} · ${r.address}`}
          image={r.imageUrl}
          url={`hostess.app/r/${r.id}`}
        />
      </main>
    </Authed>
  );
}
