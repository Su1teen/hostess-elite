import type { ServicePlace } from "@/types/place";

export const SERVICE_PLACES: ServicePlace[] = [
  // Барбершопы
  {
    id: "blade-quill",
    category: "barber",
    name: "Blade & Quill",
    subtitle: "мужской барбершоп · классическое бритьё",
    description: "Премиальный барбершоп с английской школой бритья и виски-баром.",
    longDescription:
      "Blade & Quill — это не просто стрижка, а ритуал. Мастера школы Truefitt & Hill, бритьё опасной бритвой, кожаные кресла Belmont, виски-бар на 60 этикеток. Чёткая запись, без очереди.",
    address: "ул. Достык, 124",
    district: "Медеуский район",
    distanceKm: 0.6,
    rating: 4.9,
    reviewsCount: 612,
    occupancy: 72,
    hours: "10:00 – 22:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["Премиум", "Виски-бар", "Бритьё опасной"],
    mapXY: { x: 28, y: 22 },
    averagePrice: 18000,
    vipRoom: true,
  },
  {
    id: "atelier-cut",
    category: "barber",
    name: "Atelier Cut",
    subtitle: "унисекс · авторские стрижки",
    description: "Камерное ателье на 4 кресла — стрижка как в редакторском шуте.",
    longDescription:
      "Atelier Cut — это закрытое пространство на 4 кресла. Запись по рекомендации, мастер Алия училась у Sam McKnight в Лондоне. Kerastase, Oribe, парфюм Le Labo на ресепшен.",
    address: "пр. Аль-Фараби, 17/1",
    district: "Бостандыкский район",
    distanceKm: 1.4,
    rating: 4.8,
    reviewsCount: 318,
    occupancy: 88,
    hours: "11:00 – 21:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["Авторская", "Закрытый", "Унисекс"],
    mapXY: { x: 72, y: 28 },
    averagePrice: 22000,
  },
  {
    id: "osnova",
    category: "barber",
    name: "Основа Барбершоп",
    subtitle: "мужской · классика и фейд",
    description: "Алматинская классика — фейд, борода, горячее полотенце.",
    longDescription:
      "Основа открылась в 2014 году и до сих пор остаётся местом, где знают каждого по имени. 6 мастеров, кофе из своей обжарки, ламповый плейлист.",
    address: "ул. Кабанбай батыра, 78",
    district: "Алмалинский район",
    distanceKm: 0.8,
    rating: 4.7,
    reviewsCount: 1240,
    occupancy: 45,
    hours: "10:00 – 21:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["Классика", "Фейд", "Борода"],
    mapXY: { x: 45, y: 45 },
    averagePrice: 9000,
    hasLastMinute: true,
    lastMinuteDiscount: 25,
  },

  // Спа
  {
    id: "azure-retreat",
    category: "spa",
    name: "Azure Retreat",
    subtitle: "спа · хаммам · флоатинг",
    description: "Городской ритрит с хаммамом, бассейном и арома-чайной.",
    longDescription:
      "Azure Retreat — 1 200 м² тишины. Турецкий хаммам, римские термы, флоат-капсула, массаж от мастеров Banyan Tree. Чайная с 24 сортами, тёплый халат и тапочки на выходе.",
    address: "ул. Туркебаева, 88",
    district: "Медеуский район",
    distanceKm: 0.9,
    rating: 4.9,
    reviewsCount: 482,
    occupancy: 64,
    hours: "08:00 – 23:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["Хаммам", "Флоатинг", "Massage"],
    mapXY: { x: 18, y: 35 },
    averagePrice: 38000,
    vipRoom: true,
    hasLastMinute: true,
    lastMinuteDiscount: 30,
  },
  {
    id: "aman-spa",
    category: "spa",
    name: "Aman Spa Almaty",
    subtitle: "спа · ритуалы Aman",
    description: "Авторские ритуалы Aman, выдержанные в духе японской wellness-философии.",
    longDescription:
      "Aman Spa — единственный аутентичный аман в Центральной Азии. Ритуалы Watsu, Kodō, акупрессура. Сеансы по 90–180 минут, тишина обязательна, кими-моно вместо халата.",
    address: "пр. Достык, 240/1",
    district: "Самал",
    distanceKm: 2.1,
    rating: 5.0,
    reviewsCount: 156,
    occupancy: 92,
    hours: "09:00 – 22:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["Aman", "Watsu", "Kodō"],
    mapXY: { x: 78, y: 22 },
    averagePrice: 78000,
    vipRoom: true,
  },
  {
    id: "onsen-house",
    category: "spa",
    name: "Onsen House",
    subtitle: "японские термы · сакэ-чайная",
    description: "Аутентичный онсен с чёрной вулканической водой.",
    longDescription:
      "Onsen House — три бассейна с термальной водой, привезённой из Беппу, кедровые кадки, рётэн-буро под открытым небом. Сакэ-чайная с 12 сортами.",
    address: "ул. Жандосова, 51",
    district: "Бостандыкский район",
    distanceKm: 1.6,
    rating: 4.8,
    reviewsCount: 224,
    occupancy: 38,
    hours: "10:00 – 00:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1583416750470-965b2707b355?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["Онсен", "Сакэ", "Рётэн-буро"],
    mapXY: { x: 62, y: 60 },
    averagePrice: 28000,
  },

  // Мед. центры
  {
    id: "mediq",
    category: "medical",
    name: "MediQ Premium",
    subtitle: "клиника · check-up за 2 часа",
    description: "Премиальная клиника с лаунж-зоной и check-up за 2 часа.",
    longDescription:
      "MediQ Premium — это check-up уровня Mayo Clinic, не выходя из города. КТ Siemens, МРТ 3T, лабораторные анализы за 90 минут. Лаунж с эспрессо-баром и тихими кабинами.",
    address: "ул. Розыбакиева, 247",
    district: "Алмалинский район",
    distanceKm: 1.1,
    rating: 4.9,
    reviewsCount: 542,
    occupancy: 56,
    hours: "08:00 – 21:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["Check-up", "МРТ 3T", "Лаунж"],
    mapXY: { x: 38, y: 50 },
    averagePrice: 95000,
  },
  {
    id: "oasis-clinic",
    category: "medical",
    name: "Клиника «Оазис»",
    subtitle: "семейная клиника · педиатрия",
    description: "Семейная клиника с педиатрией, кардиологией, стоматологией.",
    longDescription:
      "«Оазис» работает с 2009 года — три этажа, 28 врачей, выезд педиатра на дом. Никаких очередей: запись по слотам, СМС-напоминания, электронная карта.",
    address: "ул. Толе би, 285/4",
    district: "Бостандыкский район",
    distanceKm: 1.7,
    rating: 4.7,
    reviewsCount: 880,
    occupancy: 70,
    hours: "08:00 – 20:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["Педиатрия", "Кардиология", "Стоматология"],
    mapXY: { x: 55, y: 70 },
    averagePrice: 22000,
  },

  // Автомойки
  {
    id: "lustro",
    category: "carwash",
    name: "Lustro Auto",
    subtitle: "детейлинг · керамика",
    description: "Детейлинг-центр с керамической защитой и тёплым лаунжем.",
    longDescription:
      "Lustro — детейлинг-студия Pelle Pelle, керамика 9H, полировка ARP, химчистка салона эспрессо-машиной. Лаунж с эспрессо и Wi-Fi, ждать одно удовольствие.",
    address: "пр. Райымбека, 348",
    district: "Достыкский",
    distanceKm: 3.2,
    rating: 4.8,
    reviewsCount: 412,
    occupancy: 44,
    hours: "09:00 – 22:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["Детейлинг", "Керамика", "Лаунж"],
    mapXY: { x: 80, y: 80 },
    averagePrice: 35000,
    hasLastMinute: true,
    lastMinuteDiscount: 20,
  },
  {
    id: "crystal-wash",
    category: "carwash",
    name: "Кристалл Авто",
    subtitle: "автомойка · быстро · 25 мин",
    description: "Контактная мойка за 25 минут, без очередей и грубых щёток.",
    longDescription:
      "«Кристалл» — самая быстрая премиум-мойка в городе. 6 постов, бесконтактная пена, ручная сушка, защитный воск Sonax. В лаунже — стандартный американо.",
    address: "ул. Сейфуллина, 412",
    district: "Алмалинский район",
    distanceKm: 1.9,
    rating: 4.6,
    reviewsCount: 2104,
    occupancy: 82,
    hours: "07:00 – 23:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1605618313023-d3b9f7e62a14?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["25 мин", "Sonax", "Без щёток"],
    mapXY: { x: 15, y: 75 },
    averagePrice: 6500,
  },

  // Стоматологии
  {
    id: "diamond-dental",
    category: "dentistry",
    name: "Diamond Dental",
    subtitle: "стоматология · CAD/CAM керамика",
    description: "Эстетическая стоматология с CAD/CAM-керамикой за один визит.",
    longDescription:
      "Diamond Dental — клиника эстетической стоматологии. Циркониевые виниры за один визит на CAD/CAM Cerec, седация Nitronox, чай-меню в кресле.",
    address: "пр. Назарбаева, 187",
    district: "Бостандыкский район",
    distanceKm: 1.3,
    rating: 4.9,
    reviewsCount: 366,
    occupancy: 60,
    hours: "09:00 – 21:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["CAD/CAM", "Виниры", "Седация"],
    mapXY: { x: 70, y: 50 },
    averagePrice: 120000,
    vipRoom: true,
  },
  {
    id: "smile-suite",
    category: "dentistry",
    name: "Smile Suite",
    subtitle: "стоматология · отбеливание Zoom",
    description: "Концепт-клиника по отбеливанию и гигиене.",
    longDescription:
      "Smile Suite — это spa-формат стоматологии: отбеливание Zoom 4, гигиена AirFlow, ботокс, заполнение губ. Тихий зал, парфюм Diptyque, всё по часам.",
    address: "ул. Кабанбай батыра, 50",
    district: "Самал",
    distanceKm: 0.7,
    rating: 4.8,
    reviewsCount: 198,
    occupancy: 50,
    hours: "10:00 – 22:00",
    isOpenNow: true,
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1559757175-7cb036e0d465?w=1200&q=80&auto=format&fit=crop",
    ],
    tags: ["Zoom 4", "AirFlow", "Spa-формат"],
    mapXY: { x: 88, y: 30 },
    averagePrice: 65000,
  },
];

export function getServicePlaceById(id: string) {
  return SERVICE_PLACES.find((p) => p.id === id);
}
