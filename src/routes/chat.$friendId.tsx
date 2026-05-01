import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Phone,
  Video,
  Send,
  Plus,
  Image as ImageIcon,
  Calendar,
  Mic,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Authed } from "@/components/layout/Authed";
import { useAppStore } from "@/store/app-store";
import { FRIENDS } from "@/data/social";
import { RESTAURANTS } from "@/data/restaurants";
import type { ChatMessage } from "@/types";
import { statusTone, venueName } from "@/lib/social-helpers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$friendId")({
  component: ChatPage,
});

function ChatPage() {
  const { friendId } = Route.useParams();
  const friend = FRIENDS.find((f) => f.id === friendId);
  const chats = useAppStore((s) => s.chats);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const markRead = useAppStore((s) => s.markChatRead);
  const navigate = useNavigate();
  const chat = chats.find((c) => c.friendId === friendId);
  const [draft, setDraft] = useState("");
  const [showActions, setShowActions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markRead(friendId);
  }, [friendId, markRead]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat?.messages.length]);

  const messagesByDay = useMemo(() => {
    if (!chat) return [] as { day: string; items: ChatMessage[] }[];
    const groups = new Map<string, ChatMessage[]>();
    chat.messages.forEach((m) => {
      const d = new Date(m.timestamp);
      const key = d.toLocaleDateString("ru-RU", { day: "2-digit", month: "long" });
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(m);
    });
    return Array.from(groups, ([day, items]) => ({ day, items }));
  }, [chat]);

  if (!friend) {
    return (
      <Authed>
        <div className="min-h-dvh flex items-center justify-center">Контакт не найден</div>
      </Authed>
    );
  }

  const send = () => {
    if (!draft.trim()) return;
    sendMessage(friendId, {
      id: `m-${Date.now()}`,
      fromMe: true,
      type: "text",
      text: draft.trim(),
      timestamp: new Date().toISOString(),
    });
    setDraft("");
    // Auto-reply simulation
    const replies = [
      "Принято!",
      "Тоже думала об этом 👌",
      "Давай в 20:00?",
      "Уже бронирую стол",
      "Я в 5 минутах",
    ];
    setTimeout(() => {
      sendMessage(friendId, {
        id: `m-${Date.now() + 1}`,
        fromMe: false,
        type: "text",
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toISOString(),
      });
    }, 1500 + Math.random() * 800);
  };

  const sendVenue = () => {
    const r = RESTAURANTS[Math.floor(Math.random() * RESTAURANTS.length)];
    sendMessage(friendId, {
      id: `m-${Date.now()}`,
      fromMe: true,
      type: "venue-share",
      attachmentTitle: r.name,
      attachmentSubtitle: `${r.cuisine} · ${r.district}`,
      attachmentImage: r.imageUrl,
      timestamp: new Date().toISOString(),
    });
    setShowActions(false);
  };

  const sendVoice = () => {
    sendMessage(friendId, {
      id: `m-${Date.now()}`,
      fromMe: true,
      type: "voice",
      voiceSeconds: Math.floor(Math.random() * 25) + 5,
      timestamp: new Date().toISOString(),
    });
    setShowActions(false);
  };

  const sendBookingInvite = () => {
    sendMessage(friendId, {
      id: `m-${Date.now()}`,
      fromMe: true,
      type: "booking-share",
      attachmentTitle: "Ужин в NOIR",
      attachmentSubtitle: "Завтра, 20:00 · стол №3",
      timestamp: new Date().toISOString(),
    });
    setShowActions(false);
  };

  return (
    <Authed>
      <main className="min-h-dvh flex flex-col bg-background">
        {/* Header */}
        <div className="sticky top-0 z-30 glass-heavy border-b border-white/[0.06]">
          <div className="mx-auto max-w-2xl px-4 py-2.5 flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/social/chat" })}
              className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Link
              to="/social/contacts"
              className="flex items-center gap-2.5 flex-1 min-w-0"
            >
              <div className="relative">
                <img src={friend.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                {statusTone(friend.status) !== "offline" && (
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-background",
                      statusTone(friend.status) === "online" && "bg-emerald-400",
                      statusTone(friend.status) === "venue" && "bg-[var(--gold)]",
                      statusTone(friend.status) === "busy" && "bg-rose-400",
                    )}
                  />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{friend.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {friend.statusLabel}
                  {venueName(friend.statusVenue) ? ` · ${venueName(friend.statusVenue)}` : ""}
                </div>
              </div>
            </Link>
            <button className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 px-3 max-w-2xl w-full mx-auto">
          {messagesByDay.map((g) => (
            <div key={g.day}>
              <div className="text-center my-4">
                <span className="text-[11px] text-muted-foreground bg-white/[0.04] rounded-full px-3 py-1 capitalize">
                  {g.day}
                </span>
              </div>
              <div className="space-y-1.5">
                {g.items.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
                {chat?.typing && (
                  <div className="flex">
                    <div className="bg-white/[0.06] rounded-2xl px-4 py-2.5 flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse [animation-delay:0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse [animation-delay:0.3s]" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div className="sticky bottom-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 max-w-2xl w-full mx-auto">
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="mb-2 glass-medium rounded-3xl p-3 grid grid-cols-4 gap-2"
              >
                <ActionTile icon={<MapPin />} label="Место" onClick={sendVenue} />
                <ActionTile icon={<Calendar />} label="Бронь" onClick={sendBookingInvite} />
                <ActionTile icon={<ImageIcon />} label="Фото" onClick={() => setShowActions(false)} />
                <ActionTile icon={<Sparkles />} label="Стори" onClick={() => setShowActions(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass-heavy glass-rim rounded-full p-1.5 flex items-center gap-1.5">
            <button
              onClick={() => setShowActions((v) => !v)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition",
                showActions ? "bg-[var(--gold)] text-black rotate-45" : "bg-white/[0.06]",
              )}
            >
              <Plus className="w-4 h-4" />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Сообщение..."
              className="flex-1 bg-transparent outline-none text-sm px-2 placeholder:text-muted-foreground"
            />
            {draft ? (
              <button
                onClick={send}
                className="w-10 h-10 rounded-full bg-[var(--gold)] text-black flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={sendVoice}
                className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </Authed>
  );
}

function ActionTile({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] transition"
    >
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-white/[0.1] to-white/[0.04] flex items-center justify-center text-foreground">
        {icon}
      </div>
      <span className="text-[11px] text-foreground/85">{label}</span>
    </button>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const time = new Date(message.timestamp).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (message.type === "text") {
    return (
      <div className={cn("flex", message.fromMe ? "justify-end" : "justify-start")}>
        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-3.5 py-2 text-[14px]",
            message.fromMe
              ? "bg-[var(--gold)] text-black rounded-br-md"
              : "bg-white/[0.06] text-foreground rounded-bl-md border border-white/[0.06]",
          )}
        >
          <p>{message.text}</p>
          <div
            className={cn(
              "text-[10px] text-right mt-0.5",
              message.fromMe ? "text-black/55" : "text-muted-foreground",
            )}
          >
            {time}
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "voice") {
    return (
      <div className={cn("flex", message.fromMe ? "justify-end" : "justify-start")}>
        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5",
            message.fromMe
              ? "bg-[var(--gold)] text-black rounded-br-md"
              : "bg-white/[0.06] text-foreground rounded-bl-md border border-white/[0.06]",
          )}
        >
          <button
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              message.fromMe ? "bg-black/15" : "bg-white/[0.1]",
            )}
          >
            ▶
          </button>
          <div className="flex-1 flex items-center gap-px h-6">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className={cn("w-0.5 rounded-full", message.fromMe ? "bg-black/30" : "bg-white/40")}
                style={{ height: `${30 + Math.sin(i * 0.7) * 30 + Math.random() * 20}%` }}
              />
            ))}
          </div>
          <span className={cn("text-[11px]", message.fromMe ? "text-black/60" : "text-muted-foreground")}>
            0:{(message.voiceSeconds ?? 12).toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    );
  }

  if (message.type === "image") {
    return (
      <div className={cn("flex", message.fromMe ? "justify-end" : "justify-start")}>
        <div
          className={cn(
            "max-w-[70%] overflow-hidden rounded-2xl",
            message.fromMe ? "rounded-br-md" : "rounded-bl-md",
          )}
        >
          <img src={message.attachmentImage} alt="" className="w-full h-auto" />
          <div
            className={cn(
              "px-3 py-1.5 text-[10px]",
              message.fromMe ? "bg-[var(--gold)] text-black/60" : "bg-white/[0.06] text-muted-foreground",
            )}
          >
            {time}
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "venue-share" || message.type === "booking-share" || message.type === "event-share") {
    return (
      <div className={cn("flex", message.fromMe ? "justify-end" : "justify-start")}>
        <div
          className={cn(
            "max-w-[80%] rounded-2xl border bg-white/[0.04] p-2.5 w-[260px]",
            message.fromMe ? "border-[var(--gold)]/40 rounded-br-md" : "border-white/[0.08] rounded-bl-md",
          )}
        >
          {message.attachmentImage && (
            <div className="aspect-[16/10] rounded-xl overflow-hidden mb-2.5">
              <img src={message.attachmentImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {message.type === "venue-share" && <MapPin className="w-3 h-3" />}
            {message.type === "booking-share" && <Calendar className="w-3 h-3" />}
            {message.type === "event-share" && <Sparkles className="w-3 h-3" />}
            {message.type === "venue-share" && "Заведение"}
            {message.type === "booking-share" && "Приглашение на ужин"}
            {message.type === "event-share" && "Событие"}
          </div>
          <h4 className="text-sm font-semibold mt-1">{message.attachmentTitle}</h4>
          <p className="text-[11px] text-muted-foreground">{message.attachmentSubtitle}</p>
          <div className="flex items-center justify-between mt-2.5">
            <button className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--gold)] text-black font-medium">
              Открыть
            </button>
            <span className="text-[10px] text-muted-foreground">{time}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
