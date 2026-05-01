import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, CalendarRange, Wallet, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

const NAV = [
  { to: "/home", label: "Главная", icon: Home, match: ["/home"] },
  { to: "/events", label: "События", icon: CalendarRange, match: ["/events", "/event"] },
  { to: "/wallet", label: "Кошелёк", icon: Wallet, match: ["/wallet"] },
  { to: "/social", label: "Друзья", icon: Users, match: ["/social"] },
  { to: "/profile", label: "Профиль", icon: User, match: ["/profile"] },
] as const;

export function BottomNav() {
  const location = useLocation();
  const isAuth = useAppStore((s) => s.isAuthenticated);
  const onAuthRoute = location.pathname.startsWith("/auth") || location.pathname === "/";

  if (!isAuth || onAuthRoute) return null;

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 pointer-events-none">
        <div className="glass-heavy glass-rim rounded-3xl px-2 py-1.5 pointer-events-auto noise">
          <div className="flex items-center justify-around">
            {NAV.map((item) => {
              const active = item.match.some((m) => location.pathname.startsWith(m));
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-300 flex-1",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      className="absolute inset-0 rounded-2xl bg-white/[0.07] border border-white/[0.08]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <item.icon className={cn("w-5 h-5 relative z-10 transition-colors", active && "text-[var(--gold)]")} />
                  <span className="text-[10px] font-medium tracking-wide relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop top nav */}
      <nav className="hidden md:flex fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[min(960px,92vw)]">
        <div className="glass-heavy glass-rim rounded-2xl w-full px-4 py-2.5 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--gold)] to-[var(--gold-soft)] flex items-center justify-center">
              <span className="text-[10px] font-bold text-black tracking-tight">H</span>
            </div>
            <span className="text-base font-semibold tracking-tight">
              <span className="gold-text">HOSTESS</span>
              <span className="text-foreground/70 font-light"> · ELITE</span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = item.match.some((m) => location.pathname.startsWith(m));
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "text-foreground bg-white/[0.06]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
