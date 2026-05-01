import type { EventItem } from "@/types";

const today = new Date();
const day = (offset: number, hour = 20, minute = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const EVENTS: EventItem[] = [
  {
    id: "ev-jazz",
    title: "Ночь джаза в NOIR",
    type: "Концерт",
    venueName: "NOIR",
    venueId: "noir",
    imageUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740106531-4243f3831c78?w=1200&q=80&auto=format&fit=crop",
    ],
    date: day(2),
    time: "21:00",
    description: "Камерный концерт квартета с программой Майлза Дэвиса.",
    longDescription:
      "Квартет Almaty Jazz Project представит избранное из репертуара Майлза Дэвиса. Тёплый ламповый звук, бархат, бургундия. Минимальный заказ 18 000 ₸ за гостя.",
    priceFrom: 18000,
    ticketsLeft: 12,
    totalTickets: 60,
    artistsOrHosts: ["Almaty Jazz Project", "Вокал: Алия Мукашева"],
    ticketTypes: [
      { id: "tt-jazz-std", name: "Стандарт", price: 18000, perks: ["Депозит на меню", "Welcome-коктейль"], left: 8 },
      { id: "tt-jazz-vip", name: "VIP столик", price: 45000, perks: ["VIP-столик у сцены", "Бутылка шампанского", "Депозит 30 000 ₸"], left: 4 },
    ],
    tags: ["Live", "Камерно", "Винтаж"],
  },
  {
    id: "ev-tech",
    title: "Techno Sunrise · Velvet Lounge",
    type: "Вечеринка",
    venueName: "VELVET LOUNGE",
    venueId: "velvet",
    imageUrl:
      "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200&q=80&auto=format&fit=crop",
    ],
    date: day(4, 23, 0),
    time: "23:00",
    description: "Берлинские резиденты на руфтопе с восходом над горами.",
    longDescription:
      "Резиденты берлинского Tresor — Marc Schneider и Lena Voss. Сет на 6 часов, восход над Заилийским Алатау. Дресс-код: total black, allure.",
    priceFrom: 12000,
    ticketsLeft: 38,
    totalTickets: 220,
    artistsOrHosts: ["Marc Schneider (Berlin)", "Lena Voss", "Local: Aisha"],
    ticketTypes: [
      { id: "tt-tech-std", name: "Стандарт", price: 12000, perks: ["Welcome-drink"], left: 22 },
      { id: "tt-tech-bar", name: "Бар-зона", price: 25000, perks: ["Доступ в бар-зону", "Скип очереди"], left: 12 },
      { id: "tt-tech-vip", name: "VIP-ложа", price: 90000, perks: ["Ложа на 6 гостей", "Бутылка Cristal", "Личный официант"], left: 4 },
    ],
    tags: ["Techno", "Руфтоп", "Sunrise"],
  },
  {
    id: "ev-wine",
    title: "Дегустация Бургундии",
    type: "Дегустация",
    venueName: "САЛОН №7",
    venueId: "salon",
    imageUrl:
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200&q=80&auto=format&fit=crop",
    ],
    date: day(1, 19, 0),
    time: "19:00",
    description: "8 пино-нуар из Бургундии вслепую с сомелье.",
    longDescription:
      "Александра Кан — победительница чемпионата СНГ — проведёт слепую дегустацию 8 пино-нуар: от Кот-де-Нюи до Кот-де-Бон. Парный сет канапе.",
    priceFrom: 28000,
    ticketsLeft: 4,
    totalTickets: 28,
    artistsOrHosts: ["Сомелье Александра Кан"],
    ticketTypes: [
      { id: "tt-wine-std", name: "Дегустация", price: 28000, perks: ["8 вин", "Канапе", "Сертификат"], left: 4 },
    ],
    tags: ["Wine", "Sommelier", "Educational"],
  },
  {
    id: "ev-omakase",
    title: "Omakase × Sake Pairing",
    type: "Ужин",
    venueName: "SAKURA OMAKASE",
    venueId: "sakura",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80&auto=format&fit=crop",
    ],
    date: day(7, 19, 30),
    time: "19:30",
    description: "12 курсов от шефа Накамуры с парным саке.",
    longDescription:
      "Закрытый ужин для 8 гостей. Кенджи Накамура подготовил эксклюзивное меню с пятью сортами саке и тремя редкими сортами рыбы из Тоёсу.",
    priceFrom: 95000,
    ticketsLeft: 3,
    totalTickets: 8,
    artistsOrHosts: ["Шеф Кенджи Накамура"],
    ticketTypes: [
      { id: "tt-om", name: "Место у стойки", price: 95000, perks: ["12 курсов", "5 саке", "Подарок шефа"], left: 3 },
    ],
    tags: ["Эксклюзив", "Sake", "Закрытое"],
  },
  {
    id: "ev-stand",
    title: "Stand-up Night × Атаулы",
    type: "Стендап",
    venueName: "ДОМ ТБИЛИСИ",
    venueId: "tbilisi",
    imageUrl:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=80&auto=format&fit=crop",
    ],
    date: day(3, 21, 0),
    time: "21:00",
    description: "Лучшие стендаперы Алматы. 18+, чёрный юмор.",
    longDescription:
      "Open mic с местными звёздами. Хедлайнер — Айдар Бекеев. Минимальный заказ 8 000 ₸. 18+.",
    priceFrom: 6000,
    ticketsLeft: 22,
    totalTickets: 80,
    artistsOrHosts: ["Айдар Бекеев", "Дина Сатпаева", "Тимур Жоров"],
    ticketTypes: [
      { id: "tt-stand-std", name: "Стандарт", price: 6000, perks: ["Welcome-shot"], left: 18 },
      { id: "tt-stand-front", name: "Первый ряд", price: 14000, perks: ["Первый ряд", "Депозит 10 000 ₸"], left: 4 },
    ],
    tags: ["Stand-up", "18+", "Live"],
  },
  {
    id: "ev-show",
    title: "Закрытый показ ателье Asylkhan",
    type: "Закрытый показ",
    venueName: "SKY GARDEN",
    venueId: "rooftop",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80&auto=format&fit=crop",
    ],
    date: day(10, 20, 0),
    time: "20:00",
    description: "Премьера новой коллекции couture с шампанским.",
    longDescription:
      "Закрытый показ couture-коллекции «Aurora» дизайнера Асылхана Камысова. Шампанское Krug, dj-set, after-party. Только по приглашениям.",
    priceFrom: 60000,
    ticketsLeft: 9,
    totalTickets: 50,
    artistsOrHosts: ["Атeлье Asylkhan", "DJ Mira"],
    ticketTypes: [
      { id: "tt-show", name: "Приглашение +1", price: 60000, perks: ["+1 гость", "Шампанское Krug", "Подарок коллекции"], left: 9 },
    ],
    tags: ["Couture", "VIP", "Закрытое"],
  },
  {
    id: "ev-fest",
    title: "Bourbon & Cigars Night",
    type: "Дегустация",
    venueName: "TARTUFO",
    venueId: "tartufo",
    imageUrl:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200&q=80&auto=format&fit=crop",
    ],
    date: day(5, 19, 30),
    time: "19:30",
    description: "5 бурбонов и парные сигары Cohiba и Davidoff.",
    longDescription:
      "Сигар-сомелье и бурбон-эксперт проведут парную дегустацию: 5 бурбонов 12+ выдержки и 3 сигары. Лимитированно — 16 гостей.",
    priceFrom: 42000,
    ticketsLeft: 7,
    totalTickets: 16,
    artistsOrHosts: ["Сигар-эксперт Алмат Касенов"],
    ticketTypes: [
      { id: "tt-bourbon", name: "Дегустация", price: 42000, perks: ["5 бурбонов", "3 сигары", "Канапе"], left: 7 },
    ],
    tags: ["Bourbon", "Cigars", "Men only"],
  },
  {
    id: "ev-perfo",
    title: "Перформанс «Гора»",
    type: "Перформанс",
    venueName: "ATELIER 11",
    venueId: "atelier",
    imageUrl:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=1200&q=80&auto=format&fit=crop",
    ],
    date: day(14, 20, 0),
    time: "20:00",
    description: "Гастрономический перформанс из 9 курсов.",
    longDescription:
      "Шеф Тимур Бексултанов и хореограф Гульнара представят гастро-перформанс «Гора» — 9 курсов, синхронные с музыкой и светом.",
    priceFrom: 78000,
    ticketsLeft: 5,
    totalTickets: 11,
    artistsOrHosts: ["Шеф Тимур Бексултанов", "Хореограф Гульнара"],
    ticketTypes: [
      { id: "tt-perfo", name: "Шеф-стол", price: 78000, perks: ["9 курсов", "Парные напитки", "Книга-меню"], left: 5 },
    ],
    tags: ["Performance", "Шеф-стол", "Эксклюзив"],
  },
];

export const getEventById = (id: string) => EVENTS.find((e) => e.id === id);
