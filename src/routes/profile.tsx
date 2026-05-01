import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Heart,
  Bell,
  Shield,
  Globe,
  Sparkles,
  LogOut,
  Star,
  CreditCard,
  Users,
} from "lucide-react";
import { Authed } from "@/components/layout/Authed";
import { PageShell, SectionTitle } from "@/components/layout/PageShell";
import { GlassCard } from "@/components/layout/GlassCard";
import { Tag } from "@/components/common/Tag";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const profile = useAppStore((s) => s.profile);
  const cards = useAppStore((s) => s.cards);
  const bookings = useAppStore((s) => s.bookings);
  const signOut = useAppStore((s) => s.signOut);
  const navigate = useNavigate();

  return (
    <Authed>
      <PageShell>
        <SectionTitle title="Профиль" />

        <GlassCard variant="medium" rim className="p-5 mb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[var(--gold)]/30">
                <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-b from-[var(--gold)] to-[var(--gold-soft)] flex items-center justify-center text-black">
                <Sparkles className="w-3 h-3" />
              </span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-semibold tracking-tight">{profile.name}</h2>
                <Tag variant="gold">{profile.tier}</Tag>
              </div>
              <p className="text-sm text-muted-foreground">{profile.username} · {profile.phone}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5 italic">{profile.bio}</p>
            </div>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <GlassCard className="p-4 text-center">
            <Star className="w-4 h-4 text-[var(--gold)] mx-auto mb-1" />
            <div className="text-xl font-semibold">{profile.visits}</div>
            <div className="text-[11px] text-muted-foreground">визитов</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <CreditCard className="w-4 h-4 text-[var(--gold)] mx-auto mb-1" />
            <div className="text-xl font-semibold">{cards.length}</div>
            <div className="text-[11px] text-muted-foreground">карт</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <Users className="w-4 h-4 text-[var(--gold)] mx-auto mb-1" />
            <div className="text-xl font-semibold">11</div>
            <div className="text-[11px] text-muted-foreground">друзей</div>
          </GlassCard>
        </div>

        <GlassCard className="p-4 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Оборот за год</p>
              <p className="text-2xl font-semibold gold-text">
                {profile.totalSpent.toLocaleString("ru-RU")} ₸
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">С нами с</p>
              <p className="text-sm">{profile.memberSince}</p>
            </div>
          </div>
        </GlassCard>

        {/* Quick links */}
        <SectionTitle title="Быстрые ссылки" />
        <div className="space-y-2 mb-3">
          {[
            { to: "/bookings", label: "Мои брони", desc: `${bookings.length} визитов`, icon: <Heart className="w-4 h-4" /> },
            { to: "/wallet", label: "Кошелёк и карты", desc: `${cards.length} карт лояльности`, icon: <CreditCard className="w-4 h-4" /> },
            { to: "/social/contacts", label: "Контакты", desc: "11 друзей в Hostess", icon: <Users className="w-4 h-4" /> },
          ].map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="block glass rounded-2xl p-3 flex items-center gap-3 hover:bg-white/[0.07] transition"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                {q.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{q.label}</div>
                <div className="text-[11px] text-muted-foreground">{q.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <SectionTitle title="Настройки" />
        <GlassCard variant="medium" className="overflow-hidden">
          {[
            { label: "Уведомления", icon: <Bell className="w-4 h-4" />, value: "Push, СМС" },
            { label: "Конфиденциальность", icon: <Shield className="w-4 h-4" />, value: "Видны друзьям" },
            { label: "Язык", icon: <Globe className="w-4 h-4" />, value: "Русский" },
            { label: "Тема", icon: <Sparkles className="w-4 h-4" />, value: "Тёмная · Liquid" },
          ].map((s, i) => (
            <button
              key={s.label}
              className={`w-full text-left flex items-center gap-3 p-4 hover:bg-white/[0.04] transition ${
                i !== 0 ? "border-t border-white/[0.05]" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{s.label}</div>
                <div className="text-[11px] text-muted-foreground">{s.value}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </GlassCard>

        <button
          onClick={() => {
            signOut();
            navigate({ to: "/" });
          }}
          className="mt-4 w-full glass border-rose-400/30 bg-rose-400/5 hover:bg-rose-400/10 transition rounded-2xl p-3 flex items-center justify-center gap-2 text-rose-300 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Выйти из аккаунта
        </button>

        <p className="text-center text-[10px] text-muted-foreground mt-4">
          HOSTESS ELITE · v1.0 · build 2026.04.30
        </p>
      </PageShell>
    </Authed>
  );
}
