/**
 * Central fare-class catalogue. Class labels, tier descriptions and
 * baseline prices used by the search-results and class-selection screens.
 */
export type FareClassId = "economy" | "first" | "business" | "sleeper";

export type FareClass = {
  id: FareClassId;
  label: { en: string; ar: string };
  description: { en: string; ar: string };
  /** Multiplier applied to the route's economy base fare. */
  multiplier: number;
};

export const FARE_CLASSES: readonly FareClass[] = [
  {
    id: "economy",
    label: { en: "Economy", ar: "اقتصادية" },
    description: { en: "Reserved seat, air-conditioned coach.", ar: "مقعد محجوز في عربة مكيّفة." },
    multiplier: 1,
  },
  {
    id: "first",
    label: { en: "First Class", ar: "الدرجة الأولى" },
    description: { en: "Larger seat, complimentary refreshments.", ar: "مقعد أوسع مع مرطبات مجانية." },
    multiplier: 2,
  },
  {
    id: "business",
    label: { en: "Business", ar: "درجة الأعمال" },
    description: { en: "Priority boarding, at-seat service, Wi-Fi.", ar: "أولوية الصعود وخدمة على المقعد وواي فاي." },
    multiplier: 2.6,
  },
  {
    id: "sleeper",
    label: { en: "Sleeper", ar: "عربة النوم" },
    description: { en: "Private cabin with berth for overnight trains.", ar: "كابينة خاصة بسرير للقطارات الليلية." },
    multiplier: 2.55,
  },
];

export function findFareClass(id: FareClassId | string): FareClass | undefined {
  return FARE_CLASSES.find((c) => c.id === id);
}

/** Booking fee applied to every purchase (EGP). */
export const BOOKING_FEE_EGP = 10;
