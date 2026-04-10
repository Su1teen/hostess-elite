import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, Check, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/layout/GlassCard";
import { mockVenues } from "@/data/mockVenues";
import { mockMenus } from "@/data/mockMenus";
import { mockTables } from "@/data/mockBookings";
import { CATEGORY_CONFIG } from "@/types/venue.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/venue/$venueId_/book")({
  component: BookingPage,
  head: ({ params }) => {
    const venue = mockVenues.find((v) => v.id === params.venueId);
    return {
      meta: [
        { title: venue ? `Book ${venue.name} — Hostess` : "Book — Hostess" },
        { name: "description", content: "Select your table, guests and pre-order from the menu." },
      ],
    };
  },
});

function BookingPage() {
  const { venueId } = Route.useParams();
  const navigate = useNavigate();
  const venue = mockVenues.find((v) => v.id === venueId);
  const tables = mockTables.filter((t) => t.venueId === venueId);
  const menuItems = mockMenus.filter((m) => m.venueId === venueId);

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [duration, setDuration] = useState(2);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState<string>("all");

  if (!venue) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Venue not found</p>
      </div>
    );
  }

  const config = CATEGORY_CONFIG[venue.category];
  const menuCategories = [...new Set(menuItems.map((m) => m.category))];

  const filteredMenu = activeMenuTab === "all" ? menuItems : menuItems.filter((m) => m.category === activeMenuTab);

  const addToCart = (id: string) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart((prev) => {
    const next = { ...prev };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  });

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((m) => m.id === id);
    return sum + (item?.price || 0) * qty;
  }, 0);
  const deposit = Math.max(20, Math.round(cartTotal * 0.3));
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handlePay = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate({ to: "/" });
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            className={cn("w-20 h-20 rounded-full flex items-center justify-center", config.glowClass)}
            style={{ background: `var(--neon-${venue.category === "restaurant" ? "gold" : venue.category === "nightlife" ? "purple" : venue.category === "beauty" ? "burgundy" : "cyan"})` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Check className="w-10 h-10 text-background" />
          </motion.div>
          <motion.h2
            className="text-xl font-bold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Booking Confirmed!
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Your table at {venue.name} is reserved.<br />See you soon!
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-36 md:pt-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 md:pt-4 max-w-4xl mx-auto">
        <Link to="/venue/$venueId" params={{ venueId }} className="glass w-10 h-10 rounded-full flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold tracking-tight">Book at {venue.name}</h1>
          <p className="text-xs text-muted-foreground">Select table, guests & pre-order</p>
        </div>
      </div>

      <div className="px-4 max-w-4xl mx-auto">
        {/* Floor Plan */}
        <GlassCard className="p-4 mb-4">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            Floor Plan
            <span className="text-[10px] text-muted-foreground font-normal">· Tap to select</span>
          </h2>
          <div className="relative w-full overflow-x-auto">
            <svg viewBox="0 0 520 420" className="w-full min-w-[320px]" style={{ maxHeight: "300px" }}>
              {/* Background */}
              <rect width="520" height="420" rx="12" fill="oklch(0.12 0.015 270)" />

              {/* Entrance marker */}
              <text x="260" y="408" textAnchor="middle" fill="oklch(0.5 0.02 270)" fontSize="10" fontFamily="system-ui">ENTRANCE</text>
              <line x1="220" y1="400" x2="300" y2="400" stroke="oklch(0.4 0.02 270)" strokeWidth="2" />

              {/* Bar area */}
              <rect x="10" y="10" width="500" height="40" rx="6" fill="oklch(0.15 0.02 270)" stroke="oklch(0.25 0.015 270)" />
              <text x="260" y="35" textAnchor="middle" fill="oklch(0.5 0.02 270)" fontSize="11" fontFamily="system-ui">BAR</text>

              {/* Tables */}
              {tables.map((table) => {
                const isSelected = selectedTable === table.id;
                const isAvail = table.isAvailable;

                let fill = "oklch(0.2 0.015 270)";
                let stroke = "oklch(0.3 0.015 270)";
                if (isSelected) {
                  fill = "oklch(0.8 0.16 80 / 30%)";
                  stroke = "oklch(0.8 0.16 80)";
                } else if (isAvail) {
                  fill = "oklch(0.3 0.1 150 / 20%)";
                  stroke = "oklch(0.6 0.15 150)";
                }

                return (
                  <g
                    key={table.id}
                    onClick={() => isAvail && setSelectedTable(isSelected ? null : table.id)}
                    style={{ cursor: isAvail ? "pointer" : "not-allowed" }}
                  >
                    {table.shape === "circle" ? (
                      <circle
                        cx={table.x + table.width / 2}
                        cy={table.y + table.height / 2}
                        r={table.width / 2}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isSelected ? 2 : 1}
                      />
                    ) : (
                      <rect
                        x={table.x}
                        y={table.y}
                        width={table.width}
                        height={table.height}
                        rx="6"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isSelected ? 2 : 1}
                      />
                    )}
                    <text
                      x={table.x + table.width / 2}
                      y={table.y + table.height / 2 + 4}
                      textAnchor="middle"
                      fill={isSelected ? "oklch(0.9 0.1 80)" : isAvail ? "oklch(0.8 0.05 150)" : "oklch(0.4 0.02 270)"}
                      fontSize="12"
                      fontWeight="600"
                      fontFamily="system-ui"
                    >
                      {table.number}
                    </text>
                    {/* Seats indicator */}
                    <text
                      x={table.x + table.width / 2}
                      y={table.y + table.height / 2 + 16}
                      textAnchor="middle"
                      fill="oklch(0.5 0.02 270)"
                      fontSize="8"
                      fontFamily="system-ui"
                    >
                      {table.seats}p
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.6_0.15_150)]" /> Available</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.2_0.015_270)]" /> Taken</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.8_0.16_80)]" /> Selected</span>
          </div>
        </GlassCard>

        {/* Guests & Duration */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <GlassCard className="p-3">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Guests</span>
            <div className="flex items-center justify-between mt-2">
              <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xl font-bold">{guests}</span>
              <button onClick={() => setGuests(Math.min(10, guests + 1))} className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
          <GlassCard className="p-3">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</span>
            <div className="flex items-center justify-between mt-2">
              <button onClick={() => setDuration(Math.max(1, duration - 0.5))} className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xl font-bold">{duration}<span className="text-xs text-muted-foreground ml-0.5">h</span></span>
              <button onClick={() => setDuration(Math.min(5, duration + 0.5))} className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Pre-order Menu */}
        {menuItems.length > 0 && (
          <GlassCard className="p-4 mb-4">
            <h2 className="text-sm font-semibold mb-3">Pre-order Menu</h2>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto mb-3 scrollbar-hide">
              <button
                onClick={() => setActiveMenuTab("all")}
                className={cn("px-3 py-1 rounded-full text-xs shrink-0 transition-all", activeMenuTab === "all" ? "glass-heavy text-foreground" : "text-muted-foreground")}
              >
                All
              </button>
              {menuCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveMenuTab(cat)}
                  className={cn("px-3 py-1 rounded-full text-xs shrink-0 capitalize transition-all", activeMenuTab === cat ? "glass-heavy text-foreground" : "text-muted-foreground")}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu items */}
            <div className="flex flex-col gap-2">
              {filteredMenu.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                  </div>
                  <span className="text-xs font-semibold shrink-0">${item.price}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <AnimatePresence>
                      {cart[item.id] && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 rounded-md glass flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                    {cart[item.id] && <span className="text-xs font-bold w-4 text-center">{cart[item.id]}</span>}
                    <button onClick={() => addToCart(item.id)} className="w-6 h-6 rounded-md glass flex items-center justify-center">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Comment */}
        <GlassCard className="p-4 mb-4">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Special Requests</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Allergies, birthday setup, seating preference..."
            className="mt-2 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none resize-none h-20"
          />
        </GlassCard>
      </div>

      {/* Sticky Checkout */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass-heavy border-t border-white/[0.08] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto">
          {/* Summary */}
          <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
            <span>{cartCount} items · ${cartTotal}</span>
            <span>Deposit: <span className="text-foreground font-semibold">${deposit}</span></span>
          </div>

          <button
            onClick={handlePay}
            disabled={!selectedTable}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300",
              selectedTable
                ? `bg-primary text-primary-foreground ${config.glowClass}`
                : "bg-white/10 text-muted-foreground cursor-not-allowed"
            )}
          >
            <CreditCard className="w-4 h-4" />
            {selectedTable ? `Pay $${deposit} Deposit` : "Select a table first"}
          </button>
        </div>
      </div>
    </div>
  );
}
