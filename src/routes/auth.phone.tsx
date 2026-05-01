import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronLeft, Phone } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { PrimaryButton } from "@/components/common/PrimaryButton";

export const Route = createFileRoute("/auth/phone")({
  component: PhoneScreen,
});

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  const d = digits.startsWith("8") ? "7" + digits.slice(1) : digits;
  const parts = [
    "+7",
    d.length > 1 ? "(" + d.slice(1, 4) : "",
    d.length >= 4 ? ") " + d.slice(4, 7) : "",
    d.length >= 7 ? "-" + d.slice(7, 9) : "",
    d.length >= 9 ? "-" + d.slice(9, 11) : "",
  ];
  return parts.join("");
}

function PhoneScreen() {
  const navigate = useNavigate();
  const setPhone = useAppStore((s) => s.setAuthPhone);
  const [val, setVal] = useState("+7");
  const [touched, setTouched] = useState(false);
  const isValid = val.replace(/\D/g, "").length === 11;

  const submit = () => {
    if (!isValid) {
      setTouched(true);
      return;
    }
    setPhone(val);
    navigate({ to: "/auth/otp" });
  };

  return (
    <main className="relative min-h-dvh w-full overflow-hidden flex flex-col">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-5 py-10 max-w-md mx-auto w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 md:mt-16 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-3xl glass-medium glass-rim flex items-center justify-center mb-5">
            <Phone className="w-7 h-7 text-[var(--gold)]" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Введите номер</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Мы отправим код подтверждения по СМС. Номер не передаётся третьим лицам.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 glass-medium rounded-3xl p-6 glass-rim"
        >
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Номер телефона
          </label>
          <input
            type="tel"
            value={val}
            onChange={(e) => setVal(formatPhone(e.target.value))}
            onBlur={() => setTouched(true)}
            placeholder="+7 (___) ___-__-__"
            className="mt-2 w-full bg-transparent text-2xl font-medium tracking-tight outline-none placeholder:text-foreground/30"
          />
          {touched && !isValid && (
            <p className="mt-1.5 text-xs text-destructive">Введите 11 цифр номера</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 space-y-3"
        >
          <PrimaryButton fullWidth size="lg" onClick={submit} disabled={!isValid && touched}>
            Получить код
          </PrimaryButton>
          <p className="text-center text-[11px] text-muted-foreground">
            Нажимая «Получить код», вы соглашаетесь с условиями обслуживания и политикой данных.
          </p>
        </motion.div>

        <div className="mt-auto pt-10 flex items-center justify-center gap-3">
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Apple ID
          </button>
          <span className="text-muted-foreground/40">·</span>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Google
          </button>
          <span className="text-muted-foreground/40">·</span>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            VK
          </button>
        </div>
      </div>
    </main>
  );
}
