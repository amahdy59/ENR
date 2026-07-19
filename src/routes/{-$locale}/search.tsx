import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  MapPin,
  Pencil,
  Sun,
  CloudSun,
  Moon,
  Sunrise,
  Zap,
  TrainFront,
  Ticket,
  Filter,
  Accessibility,
  Heart,
  Repeat,
  Ban,
  FileText,
  CalendarDays,
  Mail,
  Clock,
  Coins,
  SlidersHorizontal,
  Check,
} from "lucide-react";

import { LocaleLink } from "@/i18n/LocaleLink";
import { useBi } from "@/i18n/bi";
import { TrainRow, MobileTrainCard } from "@/components/search/TrainRow";
import { useLocale } from "@/i18n/locale-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  findTrips,
  TRAIN_KIND_LABEL,
  FARE_CLASS_LABEL,
  type TripMatch,
  type TrainKind,
  type FareClassCode,
} from "@/lib/trips";
import { findStation, stationLabel, STATIONS } from "@/lib/stations";

/**
 * Accept station id, English/Arabic name, or code from the URL and
 * resolve to the canonical station id used by findTrips().
 */
function resolveStationId(input: string | undefined): string {
  if (!input) return "";
  const raw = input.trim();
  if (!raw) return "";
  const lower = raw.toLowerCase();
  const hit = STATIONS.find(
    (s) =>
      s.id === lower ||
      s.code.toLowerCase() === lower ||
      s.name.en.toLowerCase() === lower ||
      s.name.ar === raw ||
      s.city.en.toLowerCase() === lower ||
      s.city.ar === raw,
  );
  return hit?.id ?? "";
}

type SearchParams = {
  from?: string;
  to?: string;
  date?: string;
  pax?: string;
  returnDate?: string;
};

export const Route = createFileRoute("/{-$locale}/search")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    from: typeof s.from === "string" ? s.from : undefined,
    to: typeof s.to === "string" ? s.to : undefined,
    date: typeof s.date === "string" ? s.date : undefined,
    pax: typeof s.pax === "string" ? s.pax : undefined,
    returnDate: typeof s.returnDate === "string" ? s.returnDate : undefined,
  }),
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        { title: isAr ? "نتائج البحث | سكك حديد مصر" : "Search results | ENR" },
        {
          name: "description",
          content: isAr
            ? "قارن قطارات الهيئة القومية لسكك حديد مصر ورشّح النتائج حسب موعد المغادرة ونوع القطار والدرجة والسعر."
            : "Compare Egyptian Railway trains — filter by departure time, train type, class, and price.",
        },
        {
          property: "og:title",
          content: isAr ? "نتائج البحث | سكك حديد مصر" : "Search results | ENR",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: SearchResultsPage,
});

const NAVY = "var(--color-brand-primary)";
const NAVY_DEEP = "var(--color-brand-navy-deep)";
const GOLD = "var(--color-brand-secondary)";
const AMBER = "var(--color-interactive-cta)";
const TEXT_PRIMARY = "var(--color-text-primary)";
const TEXT_SECONDARY = "var(--color-text-secondary)";
const TEXT_TERTIARY = "var(--color-text-tertiary)";
const TEXT_INVERSE = "var(--color-text-inverse)";
const TEXT_NAV_INACTIVE = "var(--color-text-nav-inactive)";
const TEXT_PRICE = "var(--color-text-price-accent)";
const BORDER = "var(--color-border-default)";
const SURFACE = "var(--color-background-surface)";
const TINT = "var(--color-brand-primary-tint)";
const SUCCESS = "var(--color-status-success-text)";
const WARNING = "var(--color-status-warning)";

// ─── Filter model ────────────────────────────────────────────────
type TimeBucket = "morning" | "afternoon" | "evening" | "night";
type StopMode = "any" | "direct" | "one";
type SortKey = "departure" | "arrival" | "price" | "duration";

type FilterState = {
  times: Set<TimeBucket>; // empty = all
  kinds: Set<TrainKind>; // empty = all
  classes: Set<FareClassCode>; // empty = all
  stops: StopMode;
  maxPrice: number;
  sort: SortKey;
};

const ALL_KINDS: TrainKind[] = ["vip-talgo", "spanish-ac", "russian-ac", "russian", "sleeper"];
const ALL_CLASSES: FareClassCode[] = [
  "3rd",
  "2nd-ac",
  "1st-ac",
  "vip",
  "sleeper-double",
  "sleeper-single",
];
const PRICE_MIN = 50;
const PRICE_MAX = 2500;

function timeBucket(hhmm: string): TimeBucket {
  const h = parseInt(hhmm.slice(0, 2), 10);
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

function minFare(t: TripMatch): number {
  return Math.min(...t.fares.map((f) => f.priceEgp));
}

function durationMinutes(t: TripMatch): number {
  const [dh, dm] = t.depart.split(":").map(Number);
  const [ah, am] = t.arrive.split(":").map(Number);
  let mins = ah * 60 + am - (dh * 60 + dm);
  if (mins <= 0 || t.nextDayArrival) mins += 24 * 60;
  return mins;
}

function applyFilters(trips: TripMatch[], f: FilterState): TripMatch[] {
  let out = trips.filter((t) => {
    if (f.times.size && !f.times.has(timeBucket(t.depart))) return false;
    if (f.kinds.size && !f.kinds.has(t.kind)) return false;
    if (f.classes.size && !t.fares.some((fare) => f.classes.has(fare.klass))) return false;
    if (f.stops === "direct" && !t.direct) return false;
    if (f.stops === "one" && t.intermediateStops > 1) return false;
    if (minFare(t) > f.maxPrice) return false;
    return true;
  });
  out = [...out].sort((a, b) => {
    switch (f.sort) {
      case "arrival":
        return a.arrive.localeCompare(b.arrive);
      case "price":
        return minFare(a) - minFare(b);
      case "duration":
        return durationMinutes(a) - durationMinutes(b);
      default:
        return a.depart.localeCompare(b.depart);
    }
  });
  return out;
}

// ─── Row rendering helpers moved to components/search/TrainRow.tsx ───

function MobilePill({
  icon: Icon,
  label,
  active,
  count,
  onClick,
}: {
  icon: typeof Zap;
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="press-scale inline-flex h-10 min-h-[40px] items-center gap-1.5 rounded-full border px-4 text-[13px] font-semibold shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        background: active ? "transparent" : "rgba(255,255,255,0.04)",
        borderColor: active ? GOLD : "rgba(255,255,255,0.14)",
        color: TEXT_INVERSE,
      }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
      {count > 0 && (
        <span
          className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold"
          style={{ background: GOLD, color: NAVY }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function SheetActions({
  onClear,
  onApply,
  bi,
}: {
  onClear: () => void;
  onApply: () => void;
  bi: (en: string, ar: string) => string;
}) {
  return (
    <div
      className="grid grid-cols-2 gap-3 px-5 pt-2 pb-6 border-t"
      style={{ borderColor: "rgba(255,255,255,0.1)" }}
    >
      <button
        type="button"
        onClick={onClear}
        className="press-scale inline-flex h-11 min-h-[44px] items-center justify-center rounded-lg border-2 text-[14px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-secondary)]"
        style={{ borderColor: GOLD, color: TEXT_INVERSE, background: "transparent" }}
      >
        {bi("Clear", "مسح")}
      </button>
      <button
        type="button"
        onClick={onApply}
        className="press-scale inline-flex h-11 min-h-[44px] items-center justify-center rounded-lg text-[14px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{ background: AMBER, color: NAVY }}
      >
        {bi("Apply", "تطبيق")}
      </button>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  label,
  count,
  variant = "light",
}: {
  icon: typeof Zap;
  label: string;
  count: number;
  variant?: "light" | "dark";
}) {
  const bi = useBi();
  const isDark = variant === "dark";
  // Icon uses GOLD in both variants: on dark navy it reads as the brand accent,
  // and on the light surface it still clears WCAG 1.4.11 (3:1) for non-text UI.
  // The previous NAVY-on-surface pairing collapsed in dark mode where
  // --color-background-surface itself resolves to dark navy, hiding the icon.
  return (
    <div
      className="flex items-center justify-between rounded-t-lg px-4 py-3"
      style={{
        background: isDark ? NAVY : "var(--color-background-surface)",
        color: isDark ? TEXT_INVERSE : TEXT_PRIMARY,
        borderLeft: `4px solid ${GOLD}`,
      }}
    >
      <div className="flex items-center gap-2 text-[15px] font-semibold">
        <span
          aria-hidden="true"
          className="inline-flex h-6 w-6 items-center justify-center rounded-full"
          style={{
            background: isDark ? "rgba(255,255,255,0.10)" : "var(--color-brand-primary-tint)",
          }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: GOLD }} />
        </span>
        {label}
      </div>
      <span
        className="rounded-full px-2.5 py-0.5 text-[12px] font-semibold"
        style={{
          background: isDark ? "#ffffff" : "var(--color-brand-primary)",
          color: isDark ? "#0d1f3c" : "#ffffff",
        }}
      >
        {count} {bi("trains", "قطارات")}
      </span>
    </div>
  );
}

// ─── Sidebar controlled by filter state ─────────────────────────
function TimeButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Sun;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="inline-flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-[12px] font-medium"
      style={{
        borderColor: active ? NAVY : BORDER,
        background: active ? NAVY : "var(--color-background-elevated)",
        color: active ? TEXT_INVERSE : TEXT_SECONDARY,
      }}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function CheckRow({
  icon: Icon,
  label,
  count,
  checked,
  onChange,
}: {
  icon?: typeof Zap;
  label: string;
  count: number;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between py-1.5 cursor-pointer">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border"
          style={{ accentColor: NAVY }}
        />
        {Icon && <Icon className="h-3.5 w-3.5" style={{ color: TEXT_TERTIARY }} />}
        <span className="text-[13px]" style={{ color: TEXT_PRIMARY }}>
          {label}
        </span>
      </div>
      <span className="text-[12px]" style={{ color: TEXT_TERTIARY }}>
        ({count})
      </span>
    </label>
  );
}

function Sidebar({
  filter,
  setFilter,
  allTrips,
}: {
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  allTrips: TripMatch[];
}) {
  const bi = useBi();
  const toggle = <T,>(set: Set<T>, v: T): Set<T> => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v);
    else n.add(v);
    return n;
  };

  const kindCount = (k: TrainKind) => allTrips.filter((t) => t.kind === k).length;
  const classCount = (c: FareClassCode) =>
    allTrips.filter((t) => t.fares.some((f) => f.klass === c)).length;
  const reset: FilterState = {
    times: new Set(),
    kinds: new Set(),
    classes: new Set(),
    stops: "any",
    maxPrice: PRICE_MAX,
    sort: filter.sort,
  };

  const activeCount =
    filter.times.size +
    filter.kinds.size +
    filter.classes.size +
    (filter.stops !== "any" ? 1 : 0) +
    (filter.maxPrice < PRICE_MAX ? 1 : 0);

  return (
    <aside
      className="rounded-lg border p-4 flex flex-col gap-6"
      style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold" style={{ color: TEXT_PRIMARY }}>
            {bi("Active Filters", "الفلاتر النشطة")} ({activeCount})
          </span>
          <button
            type="button"
            onClick={() => setFilter(reset)}
            className="text-[12px] font-medium"
            style={{ color: TEXT_PRICE }}
          >
            {bi("Clear all", "مسح الكل")}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold mb-2" style={{ color: TEXT_PRIMARY }}>
          {bi("Departure Time", "موعد المغادرة")}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["morning", Sun, bi("Morning", "الصباح")],
              ["afternoon", CloudSun, bi("Afternoon", "بعد الظهر")],
              ["evening", Sunrise, bi("Evening", "المساء")],
              ["night", Moon, bi("Night", "الليل")],
            ] as const
          ).map(([id, Icon, label]) => (
            <TimeButton
              key={id}
              active={filter.times.has(id)}
              icon={Icon}
              label={label}
              onClick={() => setFilter({ ...filter, times: toggle(filter.times, id) })}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold mb-1" style={{ color: TEXT_PRIMARY }}>
          {bi("Train Type", "نوع القطار")}
        </h3>
        <CheckRow
          icon={Zap}
          label={bi("VIP / Talgo", "في آي بي / تالجو")}
          count={kindCount("vip-talgo")}
          checked={filter.kinds.has("vip-talgo")}
          onChange={() => setFilter({ ...filter, kinds: toggle(filter.kinds, "vip-talgo") })}
        />
        <CheckRow
          icon={Zap}
          label={bi("Spanish AC", "إسباني مكيّف")}
          count={kindCount("spanish-ac")}
          checked={filter.kinds.has("spanish-ac")}
          onChange={() => setFilter({ ...filter, kinds: toggle(filter.kinds, "spanish-ac") })}
        />
        <CheckRow
          icon={TrainFront}
          label={bi("Russian AC", "روسي مكيّف")}
          count={kindCount("russian-ac")}
          checked={filter.kinds.has("russian-ac")}
          onChange={() => setFilter({ ...filter, kinds: toggle(filter.kinds, "russian-ac") })}
        />
        <CheckRow
          icon={TrainFront}
          label={bi("Russian", "روسي")}
          count={kindCount("russian")}
          checked={filter.kinds.has("russian")}
          onChange={() => setFilter({ ...filter, kinds: toggle(filter.kinds, "russian") })}
        />
        <CheckRow
          icon={Moon}
          label={bi("Sleeper", "عربة نوم")}
          count={kindCount("sleeper")}
          checked={filter.kinds.has("sleeper")}
          onChange={() => setFilter({ ...filter, kinds: toggle(filter.kinds, "sleeper") })}
        />
      </div>

      <div>
        <h3 className="text-[13px] font-semibold mb-1" style={{ color: TEXT_PRIMARY }}>
          {bi("Class", "الدرجة")}
        </h3>
        {ALL_CLASSES.filter((c) => classCount(c) > 0).map((c) => (
          <CheckRow
            key={c}
            label={FARE_CLASS_LABEL[c][bi("en", "ar") as "en" | "ar"]}
            count={classCount(c)}
            checked={filter.classes.has(c)}
            onChange={() => setFilter({ ...filter, classes: toggle(filter.classes, c) })}
          />
        ))}
      </div>

      <div>
        <h3 className="text-[13px] font-semibold mb-2" style={{ color: TEXT_PRIMARY }}>
          {bi("Stops", "التوقفات")}
        </h3>
        <div
          className="inline-flex rounded-md border overflow-hidden"
          style={{ borderColor: BORDER }}
        >
          {(
            [
              ["direct", bi("Direct", "مباشر")],
              ["one", bi("≤ 1 Stop", "توقّف واحد")],
              ["any", bi("Any", "أي")],
            ] as const
          ).map(([id, label], i) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter({ ...filter, stops: id })}
              className="px-3 py-1.5 text-[12px] font-medium"
              style={{
                background: filter.stops === id ? NAVY : "var(--color-background-elevated)",
                color: filter.stops === id ? TEXT_INVERSE : TEXT_SECONDARY,
                borderLeft: i > 0 ? `1px solid ${BORDER}` : undefined,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold mb-2" style={{ color: TEXT_PRIMARY }}>
          {bi("Max Price", "أقصى سعر")}
        </h3>
        <div className="flex justify-between text-[11px] mb-1" style={{ color: TEXT_TERTIARY }}>
          <span dir="ltr">
            {PRICE_MIN} {bi("EGP", "ج.م")}
          </span>
          <span dir="ltr">
            {filter.maxPrice} {bi("EGP", "ج.م")}
          </span>
        </div>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={25}
          value={filter.maxPrice}
          onChange={(e) => setFilter({ ...filter, maxPrice: Number(e.target.value) })}
          className="w-full"
          style={{ accentColor: NAVY }}
        />
      </div>

      <div>
        <h3 className="text-[13px] font-semibold mb-2" style={{ color: TEXT_PRIMARY }}>
          {bi("Special Requirements", "احتياجات خاصة")}
        </h3>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="flex items-center gap-2 text-[13px]" style={{ color: TEXT_PRIMARY }}>
            <Accessibility className="h-3.5 w-3.5" style={{ color: TEXT_TERTIARY }} />
            {bi("Accessible trains only", "قطارات مهيّأة فقط")}
          </span>
          <input type="checkbox" defaultChecked className="h-4 w-4" style={{ accentColor: NAVY }} />
        </label>
      </div>
    </aside>
  );
}

// ─── FAQs ───────────────────────────────────────────────────────
function useFaqs() {
  const bi = useBi();
  return [
    {
      icon: Heart,
      q: bi("Can I change or cancel my booking?", "هل يمكنني تعديل الحجز أو إلغاؤه؟"),
      a: bi(
        "Yes — changes and cancellations can be made up to 24 hours before departure. A fee may apply.",
        "نعم، يمكن التعديل أو الإلغاء حتى ٢٤ ساعة قبل المغادرة. قد يتم تطبيق رسوم.",
      ),
    },
    {
      icon: Repeat,
      q: bi("What is the baggage allowance?", "ما هو الحد المسموح به من الأمتعة؟"),
      a: bi(
        "Each passenger may bring one large bag (up to 23kg) and one carry-on bag free of charge.",
        "يحق لكل راكب اصطحاب حقيبة كبيرة (حتى ٢٣ كجم) وحقيبة يد صغيرة مجاناً.",
      ),
    },
    {
      icon: Ban,
      q: bi("How do I collect my ticket?", "كيف أستلم تذكرتي؟"),
      a: bi(
        "Show the QR code on your e-ticket at the platform gate, or print your confirmation email.",
        "قدّم رمز الاستجابة السريعة الموجود على تذكرتك الإلكترونية عند بوابة الرصيف، أو اطبع بريد التأكيد.",
      ),
    },
    {
      icon: FileText,
      q: bi("Is there Wi-Fi on the train?", "هل تتوفر شبكة واي فاي على القطار؟"),
      a: bi(
        "Express and Business services include complimentary Wi-Fi throughout the journey.",
        "تشمل خدمات القطارات السريعة ودرجة الأعمال شبكة واي فاي مجانية طوال الرحلة.",
      ),
    },
    {
      icon: CalendarDays,
      q: bi("Can I bring a bicycle?", "هل يمكنني اصطحاب دراجة؟"),
      a: bi(
        "Folded bicycles travel free. Full-size bikes require a reservation in the luggage van.",
        "الدراجات القابلة للطي تُنقل مجاناً. أما الدراجات كاملة الحجم فتتطلب حجزاً في عربة الأمتعة.",
      ),
    },
    {
      icon: Mail,
      q: bi(
        "Are there accessible facilities at stations?",
        "هل تتوفر تجهيزات لذوي الاحتياجات الخاصة في المحطات؟",
      ),
      a: bi(
        "All major stations have step-free access, accessible toilets, and assistance services. Pre-book support at least 24 hours ahead.",
        "جميع المحطات الرئيسية تحتوي على مداخل دون درجات ودورات مياه مهيّأة وخدمات مساعدة. يُنصح بحجز المساعدة قبل السفر بـ٢٤ ساعة على الأقل.",
      ),
    },
  ];
}

// ─── Page ───────────────────────────────────────────────────────
function SearchResultsPage() {
  const bi = useBi();
  const { otherLocale, locale } = useLocale();
  const loc: "en" | "ar" = locale === "ar" ? "ar" : "en";
  const search = Route.useSearch();
  const fromInput = search.from ?? "";
  const toInput = search.to ?? "";
  const from = resolveStationId(fromInput);
  const to = resolveStationId(toInput);
  const fromStation = from ? findStation(from) : undefined;
  const toStation = to ? findStation(to) : undefined;

  const [allTrips, setAllTrips] = useState<TripMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(from && to));
  const [loadError, setLoadError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!from || !to) {
      setAllTrips([]);
      setLoading(false);
      setLoadError(null);
      return;
    }
    setLoading(true);
    setLoadError(null);
    findTrips(from, to)
      .then((r) => {
        if (!cancelled) {
          setAllTrips(r);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(String(e?.message ?? e));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const [filter, setFilter] = useState<FilterState>({
    times: new Set(),
    kinds: new Set(),
    classes: new Set(),
    stops: "any",
    maxPrice: PRICE_MAX,
    sort: "departure",
  });

  const filtered = useMemo(() => applyFilters(allTrips, filter), [allTrips, filter]);

  const groups = {
    express: filtered.filter((t) => t.kind === "vip-talgo" || t.kind === "spanish-ac"),
    regional: filtered.filter((t) => t.kind === "russian-ac" || t.kind === "russian"),
    sleeper: filtered.filter((t) => t.kind === "sleeper"),
  };

  const faqs = useFaqs();
  const fromDisplay = fromStation
    ? stationLabel(fromStation.id, loc)
    : fromInput || bi("Select origin", "اختر المحطة");
  const toDisplay = toStation
    ? stationLabel(toStation.id, loc)
    : toInput || bi("Select destination", "اختر الوجهة");
  const dateDisplay = search.date ?? "";
  const paxDisplay = search.pax ? `${search.pax} ${bi("Adult", "بالغ")}` : bi("1 Adult", "١ بالغ");

  const nav = [
    { label: bi("Plan Journey", "خطط رحلتك"), to: "/", active: true },
    { label: bi("Tickets & Fares", "التذاكر والأسعار"), to: "/tickets/fares" },
    { label: bi("Stations", "المحطات"), to: "/stations" },
    { label: bi("Timetables", "المواعيد"), to: "/timetable" },
    { label: bi("Travel Info", "معلومات السفر"), to: "/travel-info/luggage" },
  ];

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "departure", label: bi("Departure", "المغادرة") },
    { key: "arrival", label: bi("Arrival", "الوصول") },
    { key: "price", label: bi("Price", "السعر") },
    { key: "duration", label: bi("Duration", "المدة") },
  ];

  // Mobile: which filter sheet is open (null = closed)
  const [openSheet, setOpenSheet] = useState<null | "time" | "type" | "price">(null);
  const navigate = useNavigate();

  // Horizontal date strip: 3 days before/after the selected date
  const baseDate = search.date ? new Date(search.date) : new Date();
  const dateStrip = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + (i - 3));
    const iso = d.toISOString().slice(0, 10);
    const weekday = new Intl.DateTimeFormat(loc, { weekday: "short" }).format(d);
    const day = new Intl.DateTimeFormat(loc, { day: "numeric" }).format(d);
    return { iso, weekday, day, active: iso === search.date };
  });

  const timeLabels: Record<TimeBucket, string> = {
    morning: bi("Morning (6:00 – 12:00)", "الصباح (6:00 – 12:00)"),
    afternoon: bi("Afternoon (12:00 – 18:00)", "بعد الظهر (12:00 – 18:00)"),
    evening: bi("Evening (18:00 – 00:00)", "المساء (18:00 – 00:00)"),
    night: bi("Night (00:00 – 6:00)", "الليل (00:00 – 6:00)"),
  };
  const priceBuckets: { id: string; label: string; test: (max: number) => boolean; set: number }[] =
    [
      { id: "u200", label: bi("Under 200 EGP", "أقل من 200 ج.م"), test: (m) => m <= 200, set: 200 },
      {
        id: "200-400",
        label: bi("200 – 400 EGP", "200 – 400 ج.م"),
        test: (m) => m > 200 && m <= 400,
        set: 400,
      },
      {
        id: "400-600",
        label: bi("400 – 600 EGP", "400 – 600 ج.م"),
        test: (m) => m > 400 && m <= 600,
        set: 600,
      },
      {
        id: "600+",
        label: bi("600+ EGP", "أكثر من 600 ج.م"),
        test: (m) => m > 600,
        set: PRICE_MAX,
      },
    ];

  const activeFilterCount =
    filter.times.size +
    filter.kinds.size +
    filter.classes.size +
    (filter.stops !== "any" ? 1 : 0) +
    (filter.maxPrice < PRICE_MAX ? 1 : 0);

  return (
    <div className="min-h-dvh" style={{ background: SURFACE }}>
      {/* Mobile top bar */}
      <header
        className="md:hidden sticky top-0 z-30"
        style={{ background: NAVY, color: TEXT_INVERSE }}
      >
        <div className="flex items-center gap-2 px-4 h-14">
          <LocaleLink
            to="/"
            aria-label={bi("Back", "رجوع")}
            className="inline-flex h-11 w-11 items-center justify-center -ms-2 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 rtl-flip" aria-hidden="true" />
          </LocaleLink>
          <h1 className="flex-1 text-[16px] font-bold truncate" style={{ color: TEXT_INVERSE }}>
            {fromDisplay} {bi("to", "إلى")} {toDisplay}
          </h1>
          <LocaleLink
            to="/"
            aria-label={bi("Edit search", "تعديل البحث")}
            className="inline-flex h-11 w-11 items-center justify-center -me-2 rounded-full"
          >
            <Pencil className="h-[18px] w-[18px]" aria-hidden="true" />
          </LocaleLink>
        </div>
      </header>

      {/* Desktop header */}
      <header className="hidden md:block" style={{ background: NAVY, color: TEXT_INVERSE }}>
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <LocaleLink
            to="/"
            className="text-[20px] font-bold tracking-wide"
            style={{ color: TEXT_INVERSE }}
          >
            {bi("ENR", "س.ح.م")}
          </LocaleLink>
          <nav className="flex items-center gap-8 text-[14px]">
            {nav.map((i) => (
              <LocaleLink
                key={i.label}
                to={i.to}
                className="pb-1 font-medium"
                style={{
                  color: i.active ? TEXT_INVERSE : TEXT_NAV_INACTIVE,
                  borderBottom: i.active ? `2px solid ${GOLD}` : "2px solid transparent",
                }}
              >
                {i.label}
              </LocaleLink>
            ))}
          </nav>
          <LocaleLink
            to="/search"
            targetLocale={otherLocale}
            className="text-[13px]"
            style={{ color: TEXT_INVERSE }}
          >
            {bi("العربية", "English")}
          </LocaleLink>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-4 flex items-center justify-between text-[13px]">
          <LocaleLink
            to="/"
            className="inline-flex items-center gap-1.5"
            style={{ color: TEXT_NAV_INACTIVE }}
          >
            <ArrowLeft className="h-3.5 w-3.5 rtl-flip" /> {bi("Change search", "تعديل البحث")}
          </LocaleLink>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" style={{ color: GOLD }} /> {fromDisplay}
            </span>
            <ArrowRight className="h-3.5 w-3.5 rtl-flip" style={{ color: TEXT_NAV_INACTIVE }} />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" style={{ color: GOLD }} /> {toDisplay}
            </span>
            {dateDisplay && <span style={{ color: TEXT_NAV_INACTIVE }}>{dateDisplay}</span>}
            <span style={{ color: TEXT_NAV_INACTIVE }}>{paxDisplay}</span>
            <span style={{ color: TEXT_NAV_INACTIVE }}>
              {search.returnDate ? bi("Return", "ذهاب وعودة") : bi("One way", "ذهاب فقط")}
            </span>
          </div>
          <LocaleLink to="/" className="inline-flex items-center gap-1.5">
            <Pencil className="h-3.5 w-3.5" /> {bi("Edit", "تعديل")}
          </LocaleLink>
        </div>
      </header>

      {/* Mobile trip summary + date strip + filter pills */}
      <div className="md:hidden" style={{ background: NAVY, color: TEXT_INVERSE }}>
        <div className="flex items-center justify-between px-4 pb-3 text-[13px]">
          <span style={{ color: TEXT_NAV_INACTIVE }}>
            {dateDisplay || bi("Today", "اليوم")} · {paxDisplay} ·{" "}
            {search.returnDate ? bi("Return", "ذهاب وعودة") : bi("One way", "ذهاب فقط")}
          </span>
          <LocaleLink to="/" className="font-semibold" style={{ color: GOLD }}>
            {bi("Modify", "تعديل")}
          </LocaleLink>
        </div>

        <div
          role="tablist"
          aria-label={bi("Travel dates", "تواريخ السفر")}
          className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {dateStrip.map((d) => (
            <button
              key={d.iso}
              type="button"
              role="tab"
              aria-selected={d.active}
              onClick={() =>
                navigate({
                  to: ".",
                  search: (prev: SearchParams) => ({ ...prev, date: d.iso }) as never,
                })
              }
              className="inline-flex flex-col items-center justify-center min-w-[72px] h-14 rounded-xl border shrink-0 press-scale"
              style={{
                background: d.active ? "transparent" : "rgba(255,255,255,0.04)",
                borderColor: d.active ? GOLD : "rgba(255,255,255,0.12)",
                color: TEXT_INVERSE,
              }}
            >
              <span
                className="text-[11px] uppercase tracking-wide"
                style={{ color: TEXT_NAV_INACTIVE }}
              >
                {d.weekday}
              </span>
              <span className="text-[15px] font-bold">{d.day}</span>
            </button>
          ))}
        </div>

        <div
          className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          <MobilePill
            icon={SlidersHorizontal}
            label={bi("Modify", "تعديل")}
            active
            count={activeFilterCount}
            onClick={() => setOpenSheet("time")}
          />
          <MobilePill
            icon={Clock}
            label={bi("Time", "الوقت")}
            active={filter.times.size > 0}
            count={filter.times.size}
            onClick={() => setOpenSheet("time")}
          />
          <MobilePill
            icon={TrainFront}
            label={bi("Type", "النوع")}
            active={filter.kinds.size > 0}
            count={filter.kinds.size}
            onClick={() => setOpenSheet("type")}
          />
          <MobilePill
            icon={Coins}
            label={bi("Price", "السعر")}
            active={filter.maxPrice < PRICE_MAX}
            count={filter.maxPrice < PRICE_MAX ? 1 : 0}
            onClick={() => setOpenSheet("price")}
          />
        </div>
      </div>

      {/* Desktop sort bar */}
      <div
        className="hidden md:block"
        style={{
          background: "var(--color-background-elevated)",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <span className="text-[13px]" style={{ color: TEXT_SECONDARY }}>
            {bi(
              `Showing ${filtered.length} of ${allTrips.length} trains`,
              `عرض ${filtered.length} من ${allTrips.length} قطاراً`,
            )}
          </span>
          <div className="flex items-center gap-4 text-[13px]">
            <span style={{ color: TEXT_TERTIARY }}>{bi("Sort by:", "ترتيب حسب:")}</span>
            {sortOptions.map((s) => {
              const active = filter.sort === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setFilter({ ...filter, sort: s.key })}
                  aria-pressed={active}
                  className="pb-1 font-medium"
                  style={{
                    color: active ? TEXT_PRIMARY : TEXT_TERTIARY,
                    borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <div
          className="mx-auto max-w-7xl px-6 pb-3 flex items-center gap-2 text-[12px]"
          style={{ color: TEXT_TERTIARY }}
        >
          <Filter className="h-3.5 w-3.5" />
          {bi(
            "Use the sidebar to filter by time, train type, class, stops and price.",
            "استخدم الشريط الجانبي للتصفية حسب الوقت ونوع القطار والدرجة والتوقفات والسعر.",
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 md:px-6 py-4 md:py-6 grid gap-6 grid-cols-1 md:grid-cols-[260px_1fr]">
        <div className="hidden md:block">
          <Sidebar filter={filter} setFilter={setFilter} allTrips={allTrips} />
        </div>

        <div className="flex flex-col gap-6" aria-busy={loading}>
          {loading && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg border p-6"
              style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}
            >
              <span className="sr-only">{bi("Loading trains…", "جارٍ تحميل القطارات…")}</span>
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-md motion-reduce:animate-none"
                    style={{ background: "var(--color-background-surface)" }}
                  />
                ))}
              </div>
            </div>
          )}

          {!loading && loadError && (
            <div
              role="alert"
              className="rounded-lg border p-8 text-center"
              style={{
                borderColor: "var(--color-status-error)",
                background: "var(--color-status-error-bg)",
                color: TEXT_PRIMARY,
              }}
            >
              <div className="text-[15px] font-semibold mb-1">
                {bi("Couldn’t load trains.", "تعذّر تحميل القطارات.")}
              </div>
              <div className="text-[13px]">{loadError}</div>
            </div>
          )}

          {!loading && !loadError && from && to && allTrips.length === 0 && (
            <div
              className="rounded-lg border p-8 text-center"
              style={{
                borderColor: BORDER,
                background: "var(--color-background-elevated)",
                color: TEXT_SECONDARY,
              }}
            >
              <div className="text-[15px] font-semibold mb-1" style={{ color: TEXT_PRIMARY }}>
                {bi("No trains found for this route.", "لا توجد قطارات لهذا المسار.")}
              </div>
              <div className="text-[13px]">
                {bi(
                  "The ENR catalogue does not currently include a direct service between these stations. Try a nearby hub such as Cairo, Alexandria, Tanta, Benha, Luxor, Aswan, Port Said or Suez.",
                  "لا يشمل الفهرس الحالي خدمة مباشرة بين هاتين المحطتين. جرّب محطة رئيسية قريبة مثل القاهرة أو الإسكندرية أو طنطا أو بنها أو الأقصر أو أسوان أو بورسعيد أو السويس.",
                )}
              </div>
            </div>
          )}

          {allTrips.length > 0 && filtered.length === 0 && (
            <div
              className="rounded-lg border p-8 text-center"
              style={{
                borderColor: BORDER,
                background: "var(--color-background-elevated)",
                color: TEXT_SECONDARY,
              }}
            >
              <div className="text-[15px] font-semibold mb-1" style={{ color: TEXT_PRIMARY }}>
                {bi("No trains match your filters.", "لا توجد قطارات مطابقة للفلاتر.")}
              </div>
              <button
                type="button"
                onClick={() =>
                  setFilter({
                    times: new Set(),
                    kinds: new Set(),
                    classes: new Set(),
                    stops: "any",
                    maxPrice: PRICE_MAX,
                    sort: filter.sort,
                  })
                }
                className="mt-3 inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-[13px] font-semibold"
                style={{ background: AMBER, color: NAVY }}
              >
                {bi("Clear filters", "مسح الفلاتر")}
              </button>
            </div>
          )}

          {groups.express.length > 0 && (
            <section
              className="rounded-lg md:border"
              style={{ background: "var(--color-background-elevated)", borderColor: BORDER }}
            >
              <SectionHeader
                icon={Zap}
                label={bi("Express Trains", "القطارات السريعة")}
                count={groups.express.length}
              />
              <div className="flex flex-col gap-3 p-0 md:p-3">
                {groups.express.map((t) => (
                  <div key={t.number} className="contents">
                    <TrainRow trip={t} locale={loc} bi={bi} />
                    <MobileTrainCard trip={t} locale={loc} bi={bi} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {groups.regional.length > 0 && (
            <section
              className="rounded-lg md:border"
              style={{ background: "var(--color-background-elevated)", borderColor: BORDER }}
            >
              <SectionHeader
                icon={TrainFront}
                label={bi("Regional / Intercity", "الإقليمية بين المدن")}
                count={groups.regional.length}
              />
              <div className="flex flex-col gap-3 p-0 md:p-3">
                {groups.regional.map((t) => (
                  <div key={t.number} className="contents">
                    <TrainRow trip={t} locale={loc} bi={bi} />
                    <MobileTrainCard trip={t} locale={loc} bi={bi} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {groups.sleeper.length > 0 && (
            <section className="rounded-lg overflow-hidden" style={{ background: TINT }}>
              <SectionHeader
                icon={Moon}
                label={bi("Night / Sleeper Trains", "قطارات النوم / الليلية")}
                count={groups.sleeper.length}
                variant="dark"
              />
              <div className="flex flex-col gap-3 p-0 md:p-3">
                {groups.sleeper.map((t) => (
                  <div key={t.number} className="contents">
                    <TrainRow trip={t} locale={loc} bi={bi} />
                    <MobileTrainCard trip={t} locale={loc} bi={bi} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <section
        className="border-t"
        style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-[28px] font-bold" style={{ color: TEXT_PRIMARY }}>
            {bi("Frequently Asked Questions", "الأسئلة الشائعة")}
          </h2>
          <p className="mt-2 text-[14px]" style={{ color: TEXT_TERTIARY }}>
            {bi(
              "Find answers to common questions about ENR travel",
              "أجوبة على الأسئلة الشائعة حول السفر مع الهيئة",
            )}
          </p>
          <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3 text-start">
            {faqs.map((f) => (
              <div key={f.q} className="flex flex-col items-center text-center gap-2">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full border"
                  style={{ borderColor: BORDER, color: TEXT_SECONDARY }}
                >
                  <f.icon className="h-4 w-4" />
                </div>
                <h3 className="text-[15px] font-semibold" style={{ color: TEXT_PRIMARY }}>
                  {f.q}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: TEXT_TERTIARY }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: NAVY_DEEP, color: TEXT_INVERSE }}>
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-[13px]" style={{ color: TEXT_NAV_INACTIVE }}>
            {bi("© 2026 Egyptian National Railways", "© ٢٠٢٦ الهيئة القومية لسكك حديد مصر")}
          </span>
          <div className="flex items-center gap-6 text-[13px]" style={{ color: TEXT_NAV_INACTIVE }}>
            <LocaleLink to="/accessibility">{bi("Privacy", "الخصوصية")}</LocaleLink>
            <LocaleLink to="/accessibility">{bi("Terms", "الشروط")}</LocaleLink>
            <LocaleLink to="/accessibility">{bi("Accessibility", "إمكانية الوصول")}</LocaleLink>
            <LocaleLink to="/contact">{bi("Contact", "تواصل معنا")}</LocaleLink>
          </div>
        </div>
      </footer>

      {/* Mobile filter sheets */}
      <Sheet open={openSheet === "time"} onOpenChange={(o) => !o && setOpenSheet(null)}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-0 p-0 md:hidden"
          style={{ background: NAVY, color: TEXT_INVERSE }}
        >
          <SheetHeader className="px-5 pt-5 pb-2 text-start">
            <SheetTitle style={{ color: TEXT_INVERSE }}>
              {bi("Departure Time", "موعد المغادرة")}
            </SheetTitle>
          </SheetHeader>
          <div
            role="radiogroup"
            aria-label={bi("Departure time", "موعد المغادرة")}
            className="flex flex-col px-5 pb-3"
          >
            {(Object.keys(timeLabels) as TimeBucket[]).map((t) => {
              const checked = filter.times.has(t);
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => {
                    const next = new Set<TimeBucket>();
                    if (!checked) next.add(t);
                    setFilter({ ...filter, times: next });
                  }}
                  className="flex items-center gap-3 min-h-[44px] text-[15px] text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-secondary)] rounded-md"
                  style={{ color: TEXT_INVERSE }}
                >
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full border-2 shrink-0"
                    style={{ borderColor: checked ? GOLD : "rgba(255,255,255,0.35)" }}
                  >
                    {checked && (
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: GOLD }} />
                    )}
                  </span>
                  {timeLabels[t]}
                </button>
              );
            })}
          </div>
          <SheetActions
            onClear={() => setFilter({ ...filter, times: new Set() })}
            onApply={() => setOpenSheet(null)}
            bi={bi}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={openSheet === "type"} onOpenChange={(o) => !o && setOpenSheet(null)}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-0 p-0 md:hidden"
          style={{ background: NAVY, color: TEXT_INVERSE }}
        >
          <SheetHeader className="px-5 pt-5 pb-2 text-start">
            <SheetTitle style={{ color: TEXT_INVERSE }}>
              {bi("Train Type", "نوع القطار")}
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col px-5 pb-3">
            {ALL_KINDS.map((k) => {
              const checked = filter.kinds.has(k);
              return (
                <label
                  key={k}
                  className="flex items-center gap-3 min-h-[44px] text-[15px] cursor-pointer"
                  style={{ color: TEXT_INVERSE }}
                >
                  <span
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={TRAIN_KIND_LABEL[k][loc]}
                    tabIndex={0}
                    onClick={() => {
                      const next = new Set(filter.kinds);
                      if (checked) next.delete(k);
                      else next.add(k);
                      setFilter({ ...filter, kinds: next });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        const next = new Set(filter.kinds);
                        if (checked) next.delete(k);
                        else next.add(k);
                        setFilter({ ...filter, kinds: next });
                      }
                    }}
                    className="grid h-5 w-5 place-items-center rounded-md border-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-secondary)]"
                    style={{
                      borderColor: checked ? GOLD : "rgba(255,255,255,0.35)",
                      background: checked ? GOLD : "transparent",
                    }}
                  >
                    {checked && <Check className="h-3.5 w-3.5" style={{ color: NAVY }} />}
                  </span>
                  {TRAIN_KIND_LABEL[k][loc]}
                </label>
              );
            })}
          </div>
          <SheetActions
            onClear={() => setFilter({ ...filter, kinds: new Set() })}
            onApply={() => setOpenSheet(null)}
            bi={bi}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={openSheet === "price"} onOpenChange={(o) => !o && setOpenSheet(null)}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-0 p-0 md:hidden"
          style={{ background: NAVY, color: TEXT_INVERSE }}
        >
          <SheetHeader className="px-5 pt-5 pb-2 text-start">
            <SheetTitle style={{ color: TEXT_INVERSE }}>
              {bi("Price Range", "نطاق السعر")}
            </SheetTitle>
          </SheetHeader>
          <div
            role="radiogroup"
            aria-label={bi("Price range", "نطاق السعر")}
            className="flex flex-col px-5 pb-3"
          >
            {priceBuckets.map((p) => {
              const checked = p.test(filter.maxPrice);
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => setFilter({ ...filter, maxPrice: p.set })}
                  className="flex items-center gap-3 min-h-[44px] text-[15px] text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-secondary)] rounded-md"
                  style={{ color: TEXT_INVERSE }}
                >
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full border-2 shrink-0"
                    style={{ borderColor: checked ? GOLD : "rgba(255,255,255,0.35)" }}
                  >
                    {checked && (
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: GOLD }} />
                    )}
                  </span>
                  {p.label}
                </button>
              );
            })}
          </div>
          <SheetActions
            onClear={() => setFilter({ ...filter, maxPrice: PRICE_MAX })}
            onApply={() => setOpenSheet(null)}
            bi={bi}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
