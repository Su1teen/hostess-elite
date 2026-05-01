import { Plus } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export function StoriesBar() {
  const stories = useAppStore((s) => s.stories);
  const open = useAppStore((s) => s.openStoryViewer);

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-1.5">
      {stories.map((ring, i) => (
        <button
          key={ring.id}
          onClick={() => open(ring.id)}
          className="group flex flex-col items-center gap-1.5 shrink-0"
        >
          <div className="relative">
            <div
              className={cn(
                "p-[2px] rounded-full transition-all",
                ring.viewed
                  ? "bg-white/15"
                  : "bg-gradient-to-tr from-[var(--gold)] via-amber-400 to-rose-300",
              )}
            >
              <div className="p-[2px] bg-background rounded-full">
                <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full overflow-hidden">
                  <img
                    src={ring.authorAvatar}
                    alt={ring.authorName}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
            {ring.isMe && (
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[var(--gold)] text-black flex items-center justify-center border-2 border-background">
                <Plus className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
            )}
            {!ring.viewed && !ring.isMe && i < 3 && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-[var(--gold)] rounded-full ring-2 ring-background animate-pulse-soft" />
            )}
          </div>
          <span className="text-[11px] text-foreground/85 max-w-[70px] truncate">
            {ring.isMe ? "Ваша" : ring.authorName.split(" ")[0]}
          </span>
        </button>
      ))}
    </div>
  );
}
