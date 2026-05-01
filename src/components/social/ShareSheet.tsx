import { AnimatePresence, motion } from "framer-motion";
import { X, Copy, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/layout/GlassCard";
import { FRIENDS } from "@/data/social";
import { useAppStore } from "@/store/app-store";

export function ShareSheet({
  open,
  onClose,
  title,
  subtitle,
  image,
  url,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  image: string;
  url: string;
}) {
  const sendMessage = useAppStore((s) => s.sendMessage);

  const send = (friendId: string, friendName: string) => {
    const id = `m-${Date.now()}`;
    sendMessage(friendId, {
      id,
      fromMe: true,
      type: "venue-share",
      attachmentTitle: title,
      attachmentSubtitle: subtitle,
      attachmentImage: image,
      timestamp: new Date().toISOString(),
    });
    toast.success(`Отправлено · ${friendName}`);
    onClose();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${url}`);
    } catch {
      // ignore
    }
    toast.success("Ссылка скопирована");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard variant="heavy" rim className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Поделиться</h3>
                  <p className="text-xs text-muted-foreground">{title}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {FRIENDS.slice(0, 8).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => send(f.id, f.name)}
                    className="shrink-0 flex flex-col items-center gap-1.5 group"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/[0.08] group-hover:ring-[var(--gold)]/60 transition">
                      <img src={f.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-foreground/85 max-w-[60px] truncate">
                      {f.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  onClick={copyLink}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] transition"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-[11px]">Скопировать</span>
                </button>
                <button
                  onClick={() => {
                    toast.success("Открываю Telegram...");
                    onClose();
                  }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] transition"
                >
                  <Send className="w-4 h-4" />
                  <span className="text-[11px]">Telegram</span>
                </button>
                <button
                  onClick={() => {
                    toast.success("Открываю WhatsApp...");
                    onClose();
                  }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[11px]">WhatsApp</span>
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
