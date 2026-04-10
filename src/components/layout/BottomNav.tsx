import { Link, useLocation } from "@tanstack/react-router";
import { Compass, Search, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/" as const, label: "Discover", icon: Compass },
  { to: "/" as const, label: "Search", icon: Search },
  { to: "/" as const, label: "Bookings", icon: CalendarDays },
  { to: "/profile" as const, label: "Profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-heavy rounded-t-2xl border-t border-white/[0.08] md:hidden">
        <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to && item.label !== "Search" && item.label !== "Bookings";
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-300",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse-glow" />
                  )}
                </div>
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop top nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass-heavy border-b border-white/[0.08]">
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="text-foreground">HOST</span>
            <span className="text-primary">ESS</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to && item.label !== "Search" && item.label !== "Bookings";
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    isActive ? "text-foreground bg-white/[0.06]" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
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
