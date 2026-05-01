import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { PrimaryButton } from "@/components/common/PrimaryButton";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const isAuth = useAppStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) navigate({ to: "/home", replace: true });
  }, [isAuth, navigate]);

  return (
    <main className="relative min-h-dvh w-full overflow-hidden">
      {/* Background imagery */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between min-h-dvh px-6 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 md:mt-24 flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/10"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
          <span className="text-[11px] tracking-[0.18em] uppercase gold-text font-medium">
            Closed Beta · Алматы
          </span>
        </motion.div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-md"
        >
          <h1 className="text-[44px] md:text-[64px] leading-[1.02] font-semibold tracking-tighter">
            <span className="block text-foreground">Премиум</span>
            <span className="block gold-shimmer italic" style={{ fontFamily: '"Playfair Display", serif' }}>
              жизнь города
            </span>
            <span className="block text-foreground">в одном приложении</span>
          </h1>
          <p className="mt-5 text-[15px] text-foreground/70 leading-relaxed">
            Бронирование столиков, события, кошелёк лояльностей и социальная сеть закрытых заведений.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm space-y-3"
        >
          <PrimaryButton
            fullWidth
            size="lg"
            onClick={() => navigate({ to: "/auth/phone" })}
          >
            Войти по номеру
          </PrimaryButton>
          <PrimaryButton
            fullWidth
            size="lg"
            variant="ghost"
            onClick={() => navigate({ to: "/auth/phone" })}
          >
            Стать резидентом клуба
          </PrimaryButton>
          <p className="text-center text-[11px] text-muted-foreground mt-3">
            Продолжая, вы принимаете условия пользования и политику конфиденциальности.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
