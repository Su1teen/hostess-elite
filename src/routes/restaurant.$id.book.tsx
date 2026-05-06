import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  Minus,
  Plus,
  CalendarDays,
  Clock,
  Users,
} from "lucide-react";
import { Authed } from "@/components/layout/Authed";
import { GlassCard } from "@/components/layout/GlassCard";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Tag } from "@/components/common/Tag";
import { TIME_SLOTS } from "@/data/menus";
import { getFloorPlan } from "@/data/floor-plans";
import { FloorPlan } from "@/components/restaurant/FloorPlan";
import { getRestaurantById } from "@/data/restaurants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/restaurant/$id/book")({
  component: BookPage,
});

function BookPage() {
  const { id } = Route.useParams();
  const r = getRestaurantById(id)!;
  const navigate = useNavigate();

  const plan = getFloorPlan(r.id);
  const tables = plan.tables;

  const [guests, setGuests] = useState(2);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("19:30");
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, []);

  const dayName = (d: Date) => ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][d.getDay()];

  return (
    <Authed>
      <main className="min-h-dvh pt-4 md:pt-20 pb-32 md:pb-12">
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
              <p className="text-xs text-muted-foreground">Бронирование</p>
              <h1 className="text-xl font-semibold tracking-tight">{r.name}</h1>
            </div>
          </div>

          {/* Guests */}
          <GlassCard variant="medium" className="p-5 mb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Гости</p>
                  <p className="text-lg font-semibold">{guests} гостя</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-10 h-10 rounded-full glass border-white/[0.08] flex items-center justify-center hover:bg-white/[0.07]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-7 text-center text-lg font-semibold">{guests}</span>
                <button
                  onClick={() => setGuests((g) => Math.min(12, g + 1))}
                  className="w-10 h-10 rounded-full glass border-white/[0.08] flex items-center justify-center hover:bg-white/[0.07]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Date */}
          <GlassCard variant="medium" className="p-5 mb-3">
            <div className="flex items-center gap-2.5 mb-3">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Дата</p>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
              {dates.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDate(i)}
                  className={cn(
                    "shrink-0 px-3 py-2.5 rounded-xl border text-center min-w-[64px] transition-all",
                    selectedDate === i
                      ? "bg-foreground text-background border-foreground shadow-[0_0_24px_rgba(255,255,255,0.1)]"
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
          </GlassCard>

          {/* Time */}
          <GlassCard variant="medium" className="p-5 mb-3">
            <div className="flex items-center gap-2.5 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Время</p>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {TIME_SLOTS.map((t) => {
                const busy = ["20:00", "21:00", "22:00"].includes(t) && r.occupancy > 80;
                return (
                  <button
                    key={t}
                    disabled={busy}
                    onClick={() => setSelectedTime(t)}
                    className={cn(
                      "py-2.5 rounded-xl text-sm font-medium border transition-all",
                      busy && "opacity-30 line-through cursor-not-allowed",
                      !busy && selectedTime === t &&
                        "bg-foreground text-background border-foreground",
                      !busy && selectedTime !== t &&
                        "bg-white/[0.04] text-foreground border-white/[0.06] hover:bg-white/[0.07]",
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Floor plan */}
          <GlassCard variant="medium" className="p-5 mb-3">
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">План зала</p>
                <p className="text-sm">
                  {selectedTable
                    ? `Стол №${selectedTable} · ${tables.find((t) => t.number === selectedTable)?.zone} · ${tables.find((t) => t.number === selectedTable)?.seats} мест`
                    : "Выберите место на плане"}
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Свободен
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Занят
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold)]" /> Выбран
                </span>
              </div>
            </div>
            <FloorPlan plan={plan} selectedTable={selectedTable} onSelect={setSelectedTable} />
          </GlassCard>

          {/* Comment */}
          <GlassCard variant="medium" className="p-5 mb-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Пожелания</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="День рождения, аллергии, столик у окна..."
              rows={3}
              className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/70 resize-none"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {["День рождения", "Тихий зал", "Столик у окна", "Без вегетарианцев", "Хайчер на ребёнка"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setComment((c) => (c ? `${c}, ${tag}` : tag))}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.06] hover:bg-white/[0.08] transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Recap & continue */}
          <GlassCard variant="heavy" rim className="p-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Tag>{r.name}</Tag>
              <Tag>
                {dayName(dates[selectedDate])} {dates[selectedDate].getDate()} ·{" "}
                {selectedTime}
              </Tag>
              <Tag>{guests} гостя</Tag>
              {selectedTable && <Tag variant="gold">Стол №{selectedTable}</Tag>}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Депозит {Math.round(r.averageBill * guests * 0.3).toLocaleString("ru-RU")} ₸ списывается при подтверждении и зачисляется в счёт ужина.
            </p>
            <div className="flex gap-2">
              <Link
                to="/restaurant/$id/preorder"
                params={{ id: r.id }}
                className="flex-1 rounded-2xl py-3 text-sm font-medium glass border-white/[0.1] text-center hover:bg-white/[0.07] transition"
              >
                Меню для предзаказа
              </Link>
              <PrimaryButton
                fullWidth
                disabled={!selectedTable}
                onClick={() =>
                  navigate({
                    to: "/restaurant/$id/checkout",
                    params: { id: r.id },
                    search: {
                      guests,
                      time: selectedTime,
                      table: selectedTable!,
                      day: selectedDate,
                      comment,
                    },
                  })
                }
              >
                {selectedTable ? "Перейти к оплате" : "Выберите стол"}
              </PrimaryButton>
            </div>
          </GlassCard>
        </div>
      </main>
    </Authed>
  );
}
