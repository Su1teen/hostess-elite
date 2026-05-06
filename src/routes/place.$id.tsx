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
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Authed } from "@/components/layout/Authed";
import { GlassCard } from "@/components/layout/GlassCard";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { IconButton } from "@/components/common/IconButton";
import { Tag } from "@/components/common/Tag";
import { ShareSheet } from "@/components/social/ShareSheet";
import { getServicePlaceById } from "@/data/places";
import { CATEGORY_LABEL, type ServicePlace } from "@/types/place";
import { OCCUPANCY_TONE, occupancyBucket } from "@/lib/places";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/place/$id")({
  component: PlaceDetail,
});

function PlaceDetail() {
  const { id } = Route.useParams();
  const place = getServicePlaceById(id);
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!place) {
    return (
      <Authed>
        <div className="min-h-dvh flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Заведение не найдено</p>
            <Link to="/home" className="text-[var(--gold)] mt-2 inline-block">
              Вернуться на карту
            </Link>
          </div>
        </div>
      </Authed>
    );
  }

  const gallery = [place.imageUrl, ...place.galleryUrls];
  const occ = OCCUPANCY_TONE[occupancyBucket(place.occupancy)];

  return (
    <Authed>
      <main className="min-h-dvh pb-32 md:pt-20">
        {/* Hero */}
        <div className="relative">
          <div className="md:rounded-b-[40px] md:overflow-hidden">
            <div className="aspect-[4/3] md:aspect-[21/8] relative overflow-hidden">
              <img
                src={gallery[activeImg]}
                alt={place.name}
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
                  <Tag variant="muted">{CATEGORY_LABEL[place.category]}</Tag>
                  {place.hasLastMinute && place.lastMinuteDiscount && (
                    <Tag variant="burgundy">
                      <Sparkles className="w-3 h-3" />
                      -{place.lastMinuteDiscount}% сейчас
                    </Tag>
                  )}
                  {place.vipRoom && <Tag variant="gold">VIP</Tag>}
                </div>
                <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">{place.name}</h1>
                <p className="mt-2 text-[13px] md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {place.longDescription}
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

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <Stat
                icon={<Star className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />}
                value={place.rating}
                label={`${place.reviewsCount.toLocaleString("ru-RU")} отзывов`}
              />
              <Stat
                icon={<MapPin className="w-4 h-4" />}
                value={`${place.distanceKm} км`}
                label={place.address}
              />
              <Stat
                icon={<Clock className="w-4 h-4" />}
                value={place.hours}
                label={place.isOpenNow ? "сейчас открыто" : "сейчас закрыто"}
              />
              <Stat
                icon={
                  <span className={cn("w-2 h-2 rounded-full inline-block", occ.dot)} />
                }
                value={occ.label}
                label={`${place.occupancy}% загрузки`}
              />
            </div>
          </GlassCard>

          {/* Booking slots */}
          <SlotsCard place={place} selected={selectedSlot} onSelect={setSelectedSlot} />

          {/* Gallery thumbnails */}
          <GlassCard variant="default" className="p-4 mb-4">
            <h3 className="text-sm font-semibold tracking-tight mb-3">Галерея</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "aspect-[4/3] rounded-xl overflow-hidden border transition",
                    i === activeImg
                      ? "border-[var(--gold)]/70"
                      : "border-white/[0.08] hover:border-white/[0.16]",
                  )}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sticky CTA */}
        <div className="fixed left-0 right-0 bottom-0 z-30 px-3 pb-[calc(env(safe-area-inset-bottom)+88px)] md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:pb-0 md:max-w-[420px]">
          <div className="glass-heavy glass-rim rounded-2xl p-2.5 flex items-center gap-3">
            <div className="flex-1 px-2 min-w-0">
              <p className="text-[11px] text-muted-foreground leading-tight">
                {selectedSlot ? "Выбран слот" : "Запись от"}
              </p>
              <p className="text-sm font-semibold truncate">
                {selectedSlot ?? `${place.averagePrice.toLocaleString("ru-RU")} ₸`}
              </p>
            </div>
            <PrimaryButton
              onClick={() => {
                if (!selectedSlot) {
                  toast.error("Выберите время визита");
                  return;
                }
                toast.success(`Записаны на ${selectedSlot}. Мы пришлём напоминание.`);
                setSelectedSlot(null);
              }}
            >
              <Calendar className="w-4 h-4" />
              Записаться
            </PrimaryButton>
          </div>
        </div>

        <ShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title={place.name}
          subtitle={place.subtitle}
          image={place.imageUrl}
          url={`hostess.kz/place/${place.id}`}
        />
      </main>
    </Authed>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-white/[0.05] grid place-items-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-tight truncate">{value}</p>
        <p className="text-[11px] text-muted-foreground truncate">{label}</p>
      </div>
    </div>
  );
}

const DAY_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00", "20:30"];

function SlotsCard({
  place,
  selected,
  onSelect,
}: {
  place: ServicePlace;
  selected: string | null;
  onSelect: (slot: string | null) => void;
}) {
  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const [day, setDay] = useState(0);
  const dayName = (d: Date) => ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][d.getDay()];

  // Mark some slots as taken deterministically
  const isTaken = (idx: number) => (idx + day) % 4 === 0;

  return (
    <GlassCard variant="medium" className="p-5 mb-4">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-semibold tracking-tight">Свободные слоты</h3>
        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          подтверждение в течение 1 минуты
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => {
              setDay(i);
              onSelect(null);
            }}
            className={cn(
              "shrink-0 px-3 py-2.5 rounded-xl border min-w-[64px] text-center transition-all",
              day === i
                ? "bg-foreground text-background border-foreground"
                : "bg-white/[0.04] text-foreground border-white/[0.06] hover:bg-white/[0.07]",
            )}
          >
            <div className="text-[10px] uppercase tracking-wider opacity-70">
              {i === 0 ? "Сегодня" : i === 1 ? "Завтра" : dayName(d)}
            </div>
            <div className="text-base font-semibold mt-0.5">{d.getDate()}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4">
        {DAY_SLOTS.map((s, i) => {
          const taken = isTaken(i);
          const sel = selected === `${days[day].toLocaleDateString("ru-RU")} · ${s}`;
          const composed = `${days[day].toLocaleDateString("ru-RU")} · ${s}`;
          return (
            <motion.button
              key={s}
              whileTap={!taken ? { scale: 0.96 } : undefined}
              disabled={taken}
              onClick={() => onSelect(sel ? null : composed)}
              className={cn(
                "py-2.5 rounded-xl text-sm font-medium border transition-all",
                taken && "opacity-30 line-through cursor-not-allowed",
                !taken && sel &&
                  "bg-[var(--gold)] text-black border-[var(--gold)] shadow-[0_0_18px_oklch(0.86_0.13_85/0.4)]",
                !taken && !sel &&
                  "bg-white/[0.04] text-foreground border-white/[0.06] hover:bg-white/[0.07]",
              )}
            >
              {s}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Phone className="w-3.5 h-3.5" />
        Подтверждение по СМС, отмена без штрафа за 4 часа.
      </div>
      <div className="mt-1.5 text-[11px] text-muted-foreground">
        Цена визита: от {place.averagePrice.toLocaleString("ru-RU")} ₸
      </div>
    </GlassCard>
  );
}
