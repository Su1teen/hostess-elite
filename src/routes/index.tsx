import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CategoryPills } from "@/components/layout/CategoryPills";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { VenueListCard } from "@/components/venue/VenueListCard";
import { mockVenues } from "@/data/mockVenues";
import { CATEGORY_CONFIG, type VenueCategory } from "@/types/venue.types";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export const Route = createFileRoute("/")({
  component: DiscoveryPage,
  head: () => ({
    meta: [
      { title: "Hostess — Discover Premium Experiences" },
      { name: "description", content: "Find and book the finest restaurants, lounges, beauty salons and auto spas in your city." },
      { property: "og:title", content: "Hostess — Premium Lifestyle Booking" },
      { property: "og:description", content: "Your elite lifestyle companion for curated experiences." },
    ],
  }),
});

function DiscoveryPage() {
  const [selectedCategory, setSelectedCategory] = useState<VenueCategory | "all">("all");

  const filteredVenues = selectedCategory === "all"
    ? mockVenues
    : mockVenues.filter((v) => v.category === selectedCategory);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Mock Map Background */}
      <div className="absolute inset-0">
        {/* Ambient glow backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.5_0.2_15/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,oklch(0.78_0.15_195/0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,oklch(0.65_0.28_320/0.05),transparent_50%)]" />

        {/* City grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid-lg" width="300" height="300" patternUnits="userSpaceOnUse">
              <path d="M 300 0 L 0 0 0 300" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#grid-lg)" />
        </svg>

        {/* "Roads" */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="white" strokeWidth="3" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="4" />
          <line x1="80%" y1="0" x2="80%" y2="100%" stroke="white" strokeWidth="2" />
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="white" strokeWidth="3" />
          <line x1="0" y1="60%" x2="100%" y2="60%" stroke="white" strokeWidth="4" />
          <line x1="0" y1="85%" x2="100%" y2="85%" stroke="white" strokeWidth="2" />
        </svg>

        {/* Venue markers */}
        {mockVenues.map((venue) => {
          const config = CATEGORY_CONFIG[venue.category];
          return (
            <div
              key={venue.id}
              className="absolute hidden md:block"
              style={{ left: `${venue.coordinates.x}%`, top: `${venue.coordinates.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <div className={cn("relative w-3 h-3 rounded-full animate-pulse-glow", config.dotClass)}>
                <div className={cn("absolute inset-0 rounded-full opacity-40 animate-ping", config.dotClass)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top bar: search + pills */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-[max(1rem,env(safe-area-inset-top))] md:pt-20 px-4">
        {/* Search bar */}
        <div className="glass rounded-xl flex items-center gap-3 px-4 py-2.5 mb-3 max-w-xl mx-auto md:mx-0">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search venues, cuisines, services..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
        </div>

        <div className="max-w-xl mx-auto md:mx-0">
          <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>
      </div>

      {/* Bottom Sheet with venue list */}
      <BottomSheet>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {selectedCategory === "all" ? "Nearby" : CATEGORY_CONFIG[selectedCategory].label}
          </h2>
          <span className="text-xs text-muted-foreground">{filteredVenues.length} venues</span>
        </div>
        <div className="flex flex-col gap-3">
          {filteredVenues.map((venue) => (
            <VenueListCard key={venue.id} venue={venue} />
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
