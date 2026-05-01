import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/otp")({
  component: OtpScreen,
});

const LEN = 6;

function OtpScreen() {
  const phone = useAppStore((s) => s.authPhone) || "+7 (701) 555-44-21";
  const signIn = useAppStore((s) => s.signIn);
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(LEN).fill(""));
  const [error, setError] = useState(false);
  const [seconds, setSeconds] = useState(45);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const onChange = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[i] = ch;
      return next;
    });
    if (ch && i < LEN - 1) inputs.current[i + 1]?.focus();
    setError(false);
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const v = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LEN);
    if (!v) return;
    e.preventDefault();
    const next = Array(LEN).fill("");
    for (let i = 0; i < v.length; i++) next[i] = v[i];
    setCode(next);
    inputs.current[Math.min(v.length, LEN - 1)]?.focus();
  };

  const submit = () => {
    const joined = code.join("");
    if (joined.length === LEN) {
      // Demo: accept anything
      signIn();
      navigate({ to: "/home", replace: true });
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (code.every((c) => c)) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <main className="relative min-h-dvh w-full overflow-hidden flex flex-col">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-5 py-10 max-w-md mx-auto w-full">
        <Link
          to="/auth/phone"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Изменить номер
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 md:mt-16 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-3xl glass-medium glass-rim flex items-center justify-center mb-5">
            <ShieldCheck className="w-7 h-7 text-[var(--gold)]" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Введите код</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Мы отправили 6-значный код на номер
            <br />
            <span className="text-foreground">{phone}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 flex justify-center gap-2 md:gap-3"
        >
          {code.map((c, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              inputMode="numeric"
              type="text"
              maxLength={1}
              value={c}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={onPaste}
              className={cn(
                "w-11 h-14 md:w-14 md:h-16 text-center text-2xl md:text-3xl font-semibold rounded-2xl glass-medium border outline-none caret-[var(--gold)] transition-all",
                error
                  ? "border-destructive ring-1 ring-destructive/50"
                  : c
                    ? "border-[var(--gold)]/60 ring-1 ring-[var(--gold)]/30"
                    : "border-white/[0.1] focus:border-[var(--gold)]/40",
              )}
            />
          ))}
        </motion.div>

        {error && <p className="mt-3 text-sm text-destructive text-center">Неверный код. Попробуйте ещё раз.</p>}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 space-y-3"
        >
          <PrimaryButton fullWidth size="lg" onClick={submit}>
            Подтвердить
          </PrimaryButton>
          <button
            disabled={seconds > 0}
            onClick={() => setSeconds(45)}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {seconds > 0 ? `Запросить новый код через ${seconds} с` : "Отправить код повторно"}
          </button>
        </motion.div>

        <div className="mt-8 glass rounded-2xl p-3.5 flex items-start gap-3">
          <span className="text-xs text-muted-foreground leading-relaxed">
            Подсказка: для демонстрации введите любые 6 цифр — авторизация пройдёт автоматически.
          </span>
        </div>
      </div>
    </main>
  );
}
