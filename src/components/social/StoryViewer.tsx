import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { IconButton } from "@/components/common/IconButton";

export function StoryViewer() {
  const ringId = useAppStore((s) => s.storyViewerOpen.ringId);
  const stories = useAppStore((s) => s.stories);
  const close = useAppStore((s) => s.closeStoryViewer);
  const markViewed = useAppStore((s) => s.markStoryViewed);
  const [itemIdx, setItemIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const ring = stories.find((s) => s.id === ringId) ?? null;
  const item = ring?.items[itemIdx];

  useEffect(() => {
    setItemIdx(0);
    setProgress(0);
  }, [ringId]);

  useEffect(() => {
    if (!item) return;
    const start = Date.now();
    const dur = item.durationSec * 1000;
    const interval = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / dur);
      setProgress(p);
      if (p >= 1) {
        clearInterval(interval);
        if (ring && itemIdx + 1 >= ring.items.length) {
          markViewed(ring.id);
          close();
        } else {
          setItemIdx((i) => i + 1);
          setProgress(0);
        }
      }
    }, 60);
    return () => clearInterval(interval);
  }, [item, itemIdx, ring, close, markViewed]);

  return (
    <AnimatePresence>
      {ring && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            className="relative w-[min(420px,92vw)] aspect-[9/16] rounded-3xl overflow-hidden shadow-[0_30px_120px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

            {/* Progress bars */}
            <div className="absolute top-3 left-3 right-3 flex gap-1">
              {ring.items.map((_, i) => (
                <div
                  key={i}
                  className="h-0.5 flex-1 bg-white/25 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white rounded-full transition-[width] duration-75"
                    style={{
                      width:
                        i < itemIdx ? "100%" : i === itemIdx ? `${progress * 100}%` : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-7 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60">
                  <img src={ring.authorAvatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white drop-shadow">
                    {ring.authorName}
                  </div>
                  {item.venueName && (
                    <div className="text-[11px] text-white/80 drop-shadow">
                      📍 {item.venueName}
                    </div>
                  )}
                </div>
              </div>
              <IconButton size="sm" onClick={close} aria-label="Закрыть">
                <X className="w-4 h-4" />
              </IconButton>
            </div>

            {/* Caption */}
            {item.caption && (
              <div className="absolute bottom-20 left-4 right-4">
                <div className="glass-medium rounded-2xl px-4 py-3">
                  <p className="text-white text-sm">{item.caption}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="absolute bottom-4 left-3 right-3 flex items-center gap-2">
              <div className="flex-1 glass rounded-full px-4 py-2.5 text-sm text-white/85">
                Ответить...
              </div>
              <IconButton size="sm" aria-label="Лайк">
                <Heart className="w-4 h-4" />
              </IconButton>
              <IconButton size="sm" aria-label="Отправить">
                <Send className="w-4 h-4" />
              </IconButton>
            </div>

            {/* Tap zones */}
            <button
              className="absolute inset-y-0 left-0 w-1/3"
              onClick={() => {
                setProgress(0);
                setItemIdx((i) => Math.max(0, i - 1));
              }}
              aria-label="Назад"
            />
            <button
              className="absolute inset-y-0 right-0 w-1/3"
              onClick={() => {
                if (itemIdx + 1 >= ring.items.length) {
                  markViewed(ring.id);
                  close();
                } else {
                  setItemIdx((i) => i + 1);
                  setProgress(0);
                }
              }}
              aria-label="Вперёд"
            />

            {/* Chevrons (desktop hint) */}
            <div className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2">
              <ChevronLeft className="w-8 h-8 text-white/40" />
            </div>
            <div className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2">
              <ChevronRight className="w-8 h-8 text-white/40" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
