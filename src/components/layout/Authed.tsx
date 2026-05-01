import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAppStore } from "@/store/app-store";

export function Authed({ children }: { children: ReactNode }) {
  const isAuth = useAppStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuth) navigate({ to: "/", replace: true });
  }, [isAuth, navigate, hydrated]);

  if (!hydrated) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--gold)]/30 border-t-[var(--gold)] animate-spin" />
      </div>
    );
  }

  if (!isAuth) return null;
  return <>{children}</>;
}
