import type { MoodConfig } from "@/types";

export const MOODS: MoodConfig[] = [
  {
    id: "date",
    label: "Свидание",
    emoji: "❤️",
    description: "Интимно, камерно, со свечами",
    gradient: "from-rose-500/30 via-rose-400/10 to-transparent",
  },
  {
    id: "friends",
    label: "Друзья",
    emoji: "🍻",
    description: "Шумно, весело, с большим столом",
    gradient: "from-amber-400/30 via-orange-400/10 to-transparent",
  },
  {
    id: "business",
    label: "Бизнес",
    emoji: "💼",
    description: "Тихо, респектабельно, с приватными ложами",
    gradient: "from-slate-300/25 via-slate-400/10 to-transparent",
  },
  {
    id: "family",
    label: "Семья",
    emoji: "🌿",
    description: "Уютно, спокойно, с детским меню",
    gradient: "from-emerald-400/25 via-teal-400/10 to-transparent",
  },
  {
    id: "celebration",
    label: "Праздник",
    emoji: "🥂",
    description: "Торжественно, с шампанским и десертом",
    gradient: "from-yellow-400/30 via-amber-400/10 to-transparent",
  },
  {
    id: "solo",
    label: "Соло",
    emoji: "📖",
    description: "Барная стойка, кофе, спокойствие",
    gradient: "from-indigo-400/25 via-violet-400/10 to-transparent",
  },
];
