import { motion } from "framer-motion";
import {
  Globe,
  Utensils,
  Wine,
  Scissors,
  Sparkles,
  Stethoscope,
  Car,
  SmilePlus,
  type LucideIcon,
} from "lucide-react";
import type { PlaceCategory } from "@/types/place";
import { cn } from "@/lib/utils";

export type CategoryFilter = "all" | PlaceCategory;

const FILTERS: { id: CategoryFilter; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "Все", icon: Globe },
  { id: "restaurant", label: "Рестораны", icon: Utensils },
  { id: "bar", label: "Бары", icon: Wine },
  { id: "barber", label: "Барбершопы", icon: Scissors },
  { id: "spa", label: "Спа", icon: Sparkles },
  { id: "medical", label: "Мед. центры", icon: Stethoscope },
  { id: "carwash", label: "Автомойки", icon: Car },
  { id: "dentistry", label: "Стоматологии", icon: SmilePlus },
];

interface Props {
  active: CategoryFilter;
  onChange: (id: CategoryFilter) => void;
}

export function CategoryRail({ active, onChange }: Props) {
  return (
    <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-1">
        {FILTERS.map((f) => {
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onChange(f.id)}
              className={cn(
                "relative shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-medium tracking-wide",
                "border transition-all duration-200",
                isActive
                  ? "bg-foreground text-background border-foreground shadow-[0_0_18px_oklch(1_0_0/0.18)]"
                  : "bg-white/[0.04] text-foreground/85 border-white/[0.07] hover:bg-white/[0.07]",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="cat-rail-active"
                  className="absolute inset-0 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                <f.icon className="w-3.5 h-3.5" />
                {f.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
