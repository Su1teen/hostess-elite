import { cn } from "@/lib/utils";
import { CATEGORY_CONFIG, type VenueCategory } from "@/types/venue.types";

interface CategoryPillsProps {
  selected: VenueCategory | "all";
  onSelect: (category: VenueCategory | "all") => void;
}

const categories: Array<{ key: VenueCategory | "all"; label: string; emoji: string }> = [
  { key: "all", label: "All", emoji: "✨" },
  { key: "restaurant", label: "Restaurants", emoji: "🍽" },
  { key: "nightlife", label: "Nightlife", emoji: "🍸" },
  { key: "beauty", label: "Beauty", emoji: "💈" },
  { key: "auto", label: "Auto", emoji: "🚗" },
];

export function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-1">
      {categories.map((cat) => {
        const isActive = selected === cat.key;
        const config = cat.key !== "all" ? CATEGORY_CONFIG[cat.key] : null;

        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 shrink-0",
              isActive
                ? "glass-heavy text-foreground shadow-lg"
                : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]",
              isActive && cat.key !== "all" && config?.glowClass
            )}
            style={isActive && config ? {
              borderColor: `var(--neon-${cat.key === "restaurant" ? "gold" : cat.key === "nightlife" ? "purple" : cat.key === "beauty" ? "burgundy" : "cyan"})`,
              borderWidth: "1px",
              borderStyle: "solid",
            } : undefined}
          >
            <span className="text-base">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
