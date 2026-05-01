import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "stories", to: "/social", label: "Сторис" },
  { id: "contacts", to: "/social/contacts", label: "Контакты" },
  { id: "chat", to: "/social/chat", label: "Чаты" },
  { id: "map", to: "/social/map", label: "Карта" },
] as const;

export function SocialTabs() {
  const location = useLocation();
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-2 mb-3">
      {TABS.map((t) => {
        const exact = location.pathname === t.to;
        const active =
          exact ||
          (t.to !== "/social" && location.pathname.startsWith(t.to + "/"));
        return (
          <Link
            key={t.id}
            to={t.to}
            className={cn(
              "shrink-0 relative px-4 py-2 rounded-2xl text-sm font-medium border transition",
              active
                ? "text-background border-foreground"
                : "bg-white/[0.04] text-muted-foreground border-white/[0.06] hover:bg-white/[0.07]",
            )}
          >
            {active && (
              <motion.div
                layoutId="social-tab"
                className="absolute inset-0 rounded-2xl bg-foreground"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
