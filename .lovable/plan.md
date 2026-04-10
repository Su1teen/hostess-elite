

# Hostess B2C Premium App — Implementation Plan

## Overview
Build a 4-page premium lifestyle booking app with Dark Neon Glassmorphism design. All data is hardcoded mock data. No external map API — styled mock map with CSS.

## Step 1: Dependencies & Design System

**Add dependency:** `framer-motion` for animations and bottom sheet drag gestures.

**Restyle `src/styles.css`:** Replace the light theme with a dark neon theme:
- `:root` becomes OLED black (`#050505`) backgrounds, white foreground
- Add custom CSS variables for category neon colors (burgundy, cyan, gold, purple)
- Add glassmorphism utility classes, glow effects, keyframe animations (pulse-glow, fade-in, slide-up)
- Register all new colors in `@theme inline`

## Step 2: Types & Mock Data (4 files)

**`src/types/venue.types.ts`** — TypeScript interfaces: `Venue`, `MenuItem`, `Table`, `TimeSlot`, `Booking`, `Review`, category enum.

**`src/data/mockVenues.ts`** — 8-10 venues across 4 categories with photos (Unsplash URLs), ratings, coordinates, occupancy percentages, operating hours.

**`src/data/mockMenus.ts`** — Menu items per venue with prices, photos, categories (Starters, Mains, Drinks).

**`src/data/mockBookings.ts`** — Sample past/upcoming bookings, floor plan table layouts (SVG coordinates), user profile data.

## Step 3: Core Layout Components (4 files)

**`src/components/layout/GlassCard.tsx`** — Reusable glassmorphic container (`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl`).

**`src/components/layout/BottomNav.tsx`** — Fixed bottom navigation (Discover, Search, Bookings, Profile) with glassmorphic background, neon active indicator. Responsive: becomes top nav on desktop.

**`src/components/layout/BottomSheet.tsx`** — Framer Motion draggable bottom sheet with snap points (peek, half, full). Drag handle indicator at top.

**`src/components/layout/CategoryPills.tsx`** — Horizontal scrollable filter pills with neon border glow on active state, category color coding.

## Step 4: Discovery Page (`src/routes/index.tsx`)

Replace placeholder. Full-screen dark mock map background with:
- SVG/CSS-based city grid pattern with ambient neon radial gradients
- Pulsing colored dot markers positioned absolutely (matching venue categories)
- Floating `CategoryPills` at top
- `BottomSheet` pulling up from bottom containing vertical list of `VenueListCard` components
- Each card: thumbnail, venue name, distance, star rating, occupancy progress bar, category accent dot

## Step 5: Venue Detail Page (`src/routes/venue.$venueId.tsx`)

- Parallax hero: large venue image with `bg-gradient-to-t from-black` overlay
- Info block: name, rating stars, review count, address, hours, live occupancy badge
- Booking section: horizontal date scroller + time slot grid (glassmorphic cells)
- Menu preview grid with food photos and glassmorphic price labels
- Sticky bottom bar: glassmorphic blur panel with "Book Now" CTA (neon glow) + chat icon
- Back button overlay on hero

## Step 6: Booking Flow (`src/routes/venue.$venueId.book.tsx`)

- Interactive SVG floor plan with numbered tables (green=available, gray=taken, gold=selected)
- Click/tap to select a table
- Bottom configuration panel: guest count selector (1-10), duration picker
- Pre-order menu: scrollable categories with +/- cart buttons, running total
- Checkout summary: visual receipt, deposit amount, comment field
- Mock "Apple Pay" button → success screen with animated checkmark

## Step 7: Profile Page (`src/routes/profile.tsx`)

- VIP header: avatar, name, metallic "Elite" badge with gradient border
- Stats row: total visits, favorite category, total spent
- Booking calendar: visual month grid with past (dimmed) and upcoming (neon-bordered) bookings
- Lifestyle feed: vertical cards for city events/promotions
- Stories/Memories: horizontal scroll of visited venue rings (Instagram-style)

## Step 8: Root Layout Update (`src/routes/__root.tsx`)

- Add `BottomNav` to `RootComponent`
- Set `<body>` class to dark background
- Update meta title to "Hostess"

## Technical Notes

- **No Framer Motion page transitions on routes** — use CSS animations for card/element transitions to avoid SSR issues
- **Framer Motion** used only for: bottom sheet drag, cart item animations, success checkmark
- **Images**: Unsplash URLs for venue/food photos
- **Floor plan SVG**: Hardcoded SVG paths for 8-12 tables with click handlers
- **Responsive**: Mobile-first bottom sheet + bottom nav; desktop gets wider cards, side layout adjustments
- **All routes** get unique `head()` metadata

## File Count
~15 new files, 2 modified files. Estimated implementation: one batch.

