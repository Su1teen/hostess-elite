import type { MenuItem } from "@/types/venue.types";

export const mockMenus: MenuItem[] = [
  // NOIR Steakhouse (id: 1)
  { id: "m1", venueId: "1", name: "Wagyu Tartare", description: "A5 wagyu, quail egg, truffle vinaigrette", price: 32, category: "starters", imageUrl: "https://images.unsplash.com/photo-1625937286930-3c5751108ef8?w=400&q=80", isPopular: true },
  { id: "m2", venueId: "1", name: "Lobster Bisque", description: "Cognac cream, micro herbs", price: 24, category: "starters", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80" },
  { id: "m3", venueId: "1", name: "Tomahawk Ribeye", description: "1.2kg dry-aged 45 days, bone marrow butter", price: 95, category: "mains", imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80", isPopular: true },
  { id: "m4", venueId: "1", name: "Chilean Sea Bass", description: "Miso glaze, bok choy, dashi broth", price: 48, category: "mains", imageUrl: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&q=80" },
  { id: "m5", venueId: "1", name: "Château Margaux 2015", description: "Glass pour, Bordeaux", price: 65, category: "drinks", imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80" },
  { id: "m6", venueId: "1", name: "Old Fashioned", description: "Woodford Reserve, Angostura, orange", price: 18, category: "drinks", imageUrl: "https://images.unsplash.com/photo-1470338745628-171cf53de3a8?w=400&q=80" },
  { id: "m7", venueId: "1", name: "Crème Brûlée", description: "Madagascar vanilla, caramelized sugar", price: 16, category: "desserts", imageUrl: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80" },

  // Ember & Oak (id: 8)
  { id: "m8", venueId: "8", name: "Burrata Salad", description: "Heirloom tomatoes, basil oil, sourdough", price: 19, category: "starters", imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&q=80", isPopular: true },
  { id: "m9", venueId: "8", name: "Smoked Duck Breast", description: "Cherry reduction, root veg purée", price: 38, category: "mains", imageUrl: "https://images.unsplash.com/photo-1432139509613-5c4255a1d608?w=400&q=80" },
  { id: "m10", venueId: "8", name: "Craft Negroni", description: "House-infused gin, Campari, vermouth", price: 15, category: "drinks", imageUrl: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80" },

  // The Blade Studio (id: 3)
  { id: "m11", venueId: "3", name: "Precision Cut", description: "Consultation, wash, cut & style", price: 45, category: "services", imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80", isPopular: true },
  { id: "m12", venueId: "3", name: "Hot Towel Shave", description: "Traditional straight razor shave", price: 35, category: "services", imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80" },
  { id: "m13", venueId: "3", name: "Beard Sculpting", description: "Shape, trim & conditioning treatment", price: 30, category: "services", imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80" },

  // Obsidian Auto Spa (id: 4)
  { id: "m14", venueId: "4", name: "Full Detail Package", description: "Exterior wash, clay bar, wax, interior deep clean", price: 250, category: "services", imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&q=80", isPopular: true },
  { id: "m15", venueId: "4", name: "Ceramic Coating", description: "9H nano ceramic protection, 5-year warranty", price: 800, category: "services", imageUrl: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&q=80" },
];
