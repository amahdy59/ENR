import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Wifi,
  Zap,
  Utensils,
  Armchair,
  Users,
  Lock,
  Clock,
} from "lucide-react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useBi } from "@/i18n/bi";
import { useLocale } from "@/i18n/locale-context";
import { BookingProgress } from "@/components/site/BookingProgress";

export const Route = createFileRoute("/{-$locale}/class")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "اختيار الدرجة والمقعد — حجز سكك حديد مصر"
            : "Select Class & Seat — ENR Booking",
        },
        {
          name: "description",
          content: isAr
            ? "اختر درجة السفر والمقعد على قطارات الهيئة القومية لسكك حديد مصر. الخطوة ٢ من ٤."
            : "Choose your travel class and seat on the Egyptian Railway. Step 2 of 4.",
        },
        {
          property: "og:title",
          content: isAr
            ? "اختيار الدرجة والمقعد — حجز سكك حديد مصر"
            : "Select Class & Seat — ENR Booking",
        },
        {
          property: "og:description",
          content: isAr ? "اختر درجة السفر والمقعد." : "Choose your travel class and seat.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ClassPage,
});

const NAVY = "var(--color-brand-primary)";
const GOLD = "var(--color-brand-secondary)";
const AMBER = "var(--color-interactive-cta)";
const AMBER_TEXT = "var(--color-text-cta)";
const TEXT_PRIMARY = "var(--color-text-primary)";
const TEXT_SECONDARY = "var(--color-text-secondary)";
const TEXT_TERTIARY = "var(--color-text-tertiary)";
const TEXT_INVERSE = "var(--color-text-inverse)";
const TEXT_NAV_INACTIVE = "var(--color-text-nav-inactive)";
const TEXT_PRICE = "var(--color-text-price-accent)";
const BORDER = "var(--color-border-default)";
const SURFACE = "var(--color-background-surface)";
const MUTED = "var(--color-background-muted)";
const SUCCESS = "var(--color-status-success-text)";

function SiteHeader() {
  const bi = useBi();
  const { otherLocale } = useLocale();
  const nav = [
    { label: bi("Plan Journey", "خطط رحلتك"), to: "/" },
    { label: bi("Tickets & Fares", "التذاكر والأسعار"), to: "/tickets/fares", active: true },
    { label: bi("Stations", "المحطات"), to: "/stations" },
    { label: bi("Timetables", "المواعيد"), to: "/timetable" },
    { label: bi("Travel Info", "معلومات السفر"), to: "/travel-info/luggage" },
  ];
  return (
    <header style={{ background: NAVY, color: TEXT_INVERSE }}>
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <LocaleLink
          to="/"
          className="text-[20px] font-bold tracking-wide"
          style={{ color: TEXT_INVERSE }}
        >
          {bi("ENR", "س.ح.م")}
        </LocaleLink>
        <nav className="hidden md:flex items-center gap-8 text-[14px]">
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
          to="/class"
          targetLocale={otherLocale}
          className="text-[13px]"
          style={{ color: TEXT_INVERSE }}
        >
          {bi("العربية", "English")}
        </LocaleLink>
      </div>
    </header>
  );
}

type StepState = "done" | "current" | "todo";

function Stepper() {
  return <BookingProgress current={2} />;
}

type ClassOption = {
  id: string;
  name: string;
  price: number;
  tag?: string;
  seatsLeft: number;
  features: { icon: React.ComponentType<{ className?: string }>; label: string }[];
  desc: string;
};

function useClasses(): ClassOption[] {
  const bi = useBi();
  return [
    {
      id: "economy",
      name: bi("Economy", "اقتصادية"),
      price: 245,
      seatsLeft: 42,
      desc: bi(
        "Comfortable standard seating with air conditioning.",
        "مقاعد قياسية مريحة مع تكييف الهواء.",
      ),
      features: [
        { icon: Armchair, label: bi("Standard seat", "مقعد قياسي") },
        { icon: Wifi, label: bi("Wi-Fi", "واي فاي") },
      ],
    },
    {
      id: "business",
      name: bi("Business", "الأعمال"),
      price: 385,
      tag: bi("Most popular", "الأكثر طلباً"),
      seatsLeft: 18,
      desc: bi(
        "Wider seats, priority boarding, and complimentary refreshments.",
        "مقاعد أوسع، وأولوية الصعود، ومرطبات مجانية.",
      ),
      features: [
        { icon: Armchair, label: bi("Wider seat", "مقعد أوسع") },
        { icon: Wifi, label: bi("Fast Wi-Fi", "واي فاي سريع") },
        { icon: Zap, label: bi("Power outlet", "منفذ كهرباء") },
        { icon: Utensils, label: bi("Refreshments", "مرطبات") },
      ],
    },
    {
      id: "first",
      name: bi("First Class", "الدرجة الأولى"),
      price: 545,
      seatsLeft: 6,
      desc: bi(
        "Premium reclining seats, meal service, and dedicated attendant.",
        "مقاعد فاخرة قابلة للاستلقاء، وخدمة وجبات، ومضيف مخصّص.",
      ),
      features: [
        { icon: Armchair, label: bi("Reclining seat", "مقعد قابل للاستلقاء") },
        { icon: Wifi, label: bi("Fast Wi-Fi", "واي فاي سريع") },
        { icon: Zap, label: bi("Power outlet", "منفذ كهرباء") },
        { icon: Utensils, label: bi("Full meal", "وجبة كاملة") },
      ],
    },
  ];
}

function ClassCard({
  opt,
  selected,
  onSelect,
}: {
  opt: ClassOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const bi = useBi();
  return (
    <button
      type="button"
      onClick={onSelect}
      className="text-start rounded-lg border p-5 transition-shadow hover:shadow-md w-full"
      style={{
        borderColor: selected ? NAVY : BORDER,
        background: "var(--color-background-elevated)",
        boxShadow: selected ? `0 0 0 2px ${NAVY} inset` : undefined,
      }}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-bold" style={{ color: TEXT_PRIMARY }}>
              {opt.name}
            </h3>
            {opt.tag && (
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{
                  background: `color-mix(in oklab, ${GOLD} 20%, transparent)`,
                  color: AMBER_TEXT,
                }}
              >
                {opt.tag}
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px]" style={{ color: TEXT_SECONDARY }}>
            {opt.desc}
          </p>
        </div>
        <div className="text-end">
          <div className="text-[22px] font-bold" style={{ color: TEXT_PRICE }}>
            {opt.price} <span className="text-[13px] font-medium">{bi("EGP", "ج.م")}</span>
          </div>
          <div className="text-[11px]" style={{ color: TEXT_TERTIARY }}>
            {bi("per passenger", "لكل راكب")}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {opt.features.map((f) => (
          <span
            key={f.label}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px]"
            style={{ background: MUTED, color: TEXT_SECONDARY }}
          >
            <f.icon className="h-3.5 w-3.5" /> {f.label}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px]">
        <span
          className="inline-flex items-center gap-1.5"
          style={{ color: opt.seatsLeft < 10 ? "#b91c1c" : TEXT_TERTIARY }}
        >
          <Users className="h-3.5 w-3.5" /> {opt.seatsLeft} {bi("seats left", "مقاعد متبقية")}
        </span>
        <span
          className="inline-flex items-center gap-1 text-[12px] font-semibold"
          style={{ color: selected ? NAVY : TEXT_TERTIARY }}
        >
          {selected ? (
            <>
              <Check className="h-3.5 w-3.5" /> {bi("Selected", "تم الاختيار")}
            </>
          ) : (
            bi("Select", "اختيار")
          )}
        </span>
      </div>
    </button>
  );
}

const COACH_ROWS = 10;
const COACH_COLS = ["A", "B", "C", "D"];

function SeatMap({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (s: string) => void;
}) {
  const bi = useBi();
  const taken = new Set(["1A", "2C", "3B", "4D", "5A", "6C", "7B", "8D", "9A"]);

  return (
    <div
      className="rounded-lg border p-5"
      style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-bold" style={{ color: TEXT_PRIMARY }}>
          {bi("Choose your seat", "اختر مقعدك")}
        </h3>
        <div className="flex items-center gap-3 text-[11px]" style={{ color: TEXT_TERTIARY }}>
          <span className="inline-flex items-center gap-1">
            <span
              className="h-3 w-3 rounded-sm"
              style={{
                background: "var(--color-background-elevated)",
                border: `1px solid ${BORDER}`,
              }}
            />
            {bi("Available", "متاح")}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm" style={{ background: NAVY }} />
            {bi("Selected", "المختار")}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm" style={{ background: MUTED }} />
            {bi("Taken", "محجوز")}
          </span>
        </div>
      </div>

      <div className="mt-4 text-center text-[11px]" style={{ color: TEXT_TERTIARY }}>
        {bi("Front of coach", "مقدمة العربة")}
      </div>
      <div className="mt-2 flex flex-col items-center gap-2">
        {Array.from({ length: COACH_ROWS }).map((_, r) => {
          const row = r + 1;
          return (
            <div key={row} className="flex items-center gap-3">
              <span className="w-4 text-end text-[11px]" style={{ color: TEXT_TERTIARY }}>
                {row}
              </span>
              <div className="flex items-center gap-1.5">
                {COACH_COLS.slice(0, 2).map((c) => {
                  const id = `${row}${c}`;
                  const isTaken = taken.has(id);
                  const isSel = selected === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={isTaken}
                      onClick={() => onSelect(id)}
                      className="h-8 w-8 rounded-md text-[11px] font-medium transition-colors"
                      style={{
                        background: isTaken
                          ? MUTED
                          : isSel
                            ? NAVY
                            : "var(--color-background-elevated)",
                        color: isTaken ? TEXT_TERTIARY : isSel ? TEXT_INVERSE : TEXT_PRIMARY,
                        border: `1px solid ${isSel ? NAVY : BORDER}`,
                        cursor: isTaken ? "not-allowed" : "pointer",
                      }}
                      aria-label={`${bi("Seat", "مقعد")} ${id}${isTaken ? ` (${bi("taken", "محجوز")})` : ""}`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              <span className="w-6 text-center text-[10px]" style={{ color: TEXT_TERTIARY }}>
                {bi("aisle", "ممر")}
              </span>
              <div className="flex items-center gap-1.5">
                {COACH_COLS.slice(2).map((c) => {
                  const id = `${row}${c}`;
                  const isTaken = taken.has(id);
                  const isSel = selected === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={isTaken}
                      onClick={() => onSelect(id)}
                      className="h-8 w-8 rounded-md text-[11px] font-medium transition-colors"
                      style={{
                        background: isTaken
                          ? MUTED
                          : isSel
                            ? NAVY
                            : "var(--color-background-elevated)",
                        color: isTaken ? TEXT_TERTIARY : isSel ? TEXT_INVERSE : TEXT_PRIMARY,
                        border: `1px solid ${isSel ? NAVY : BORDER}`,
                        cursor: isTaken ? "not-allowed" : "pointer",
                      }}
                      aria-label={`${bi("Seat", "مقعد")} ${id}${isTaken ? ` (${bi("taken", "محجوز")})` : ""}`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookingSummary({ price, seat }: { price: number; seat: string | null }) {
  const bi = useBi();
  const fee = 10;
  return (
    <aside
      className="rounded-lg border p-5"
      style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}
    >
      <h2 className="text-[16px] font-bold" style={{ color: TEXT_PRIMARY }}>
        {bi("Booking Summary", "ملخص الحجز")}
      </h2>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[20px] font-bold" style={{ color: TEXT_PRIMARY }} dir="ltr">
          09:45
        </span>
        <ArrowRight className="h-4 w-4 rtl-flip" style={{ color: TEXT_TERTIARY }} />
        <span className="text-[20px] font-bold" style={{ color: TEXT_PRIMARY }} dir="ltr">
          12:30
        </span>
      </div>
      <div className="mt-1 text-[12px]" style={{ color: TEXT_TERTIARY }}>
        {bi("Cairo Central → Alexandria Misr", "القاهرة الرئيسية ← الإسكندرية مصر")}
      </div>
      <div className="text-[12px]" style={{ color: TEXT_TERTIARY }}>
        {bi("Direct • 2h 45m", "مباشر • ٢س ٤٥د")}
      </div>

      <div className="my-4 h-px w-full" style={{ background: BORDER }} />

      <div className="text-[13px]" style={{ color: TEXT_PRIMARY }}>
        {bi("Tuesday 15 October 2025", "الثلاثاء ١٥ أكتوبر ٢٠٢٥")}
      </div>
      <div className="text-[13px]" style={{ color: TEXT_SECONDARY }}>
        {bi("1 Adult", "١ بالغ")}
      </div>
      <div className="text-[13px]" style={{ color: TEXT_SECONDARY }}>
        {bi("Seat", "المقعد")} {seat ?? "—"}
      </div>

      <div className="my-4 h-px w-full" style={{ background: BORDER }} />

      <div className="flex items-center justify-between text-[13px]">
        <span style={{ color: TEXT_SECONDARY }}>{bi("1× fare", "١× التذكرة")}</span>
        <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>
          {price} {bi("EGP", "ج.م")}
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[13px]">
        <span style={{ color: TEXT_SECONDARY }}>{bi("Booking fee", "رسوم الحجز")}</span>
        <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>
          {fee} {bi("EGP", "ج.م")}
        </span>
      </div>

      <div className="my-4 h-px w-full" style={{ background: BORDER }} />

      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold" style={{ color: TEXT_PRIMARY }}>
          {bi("Total", "الإجمالي")}
        </span>
        <span className="text-[22px] font-bold" style={{ color: TEXT_PRICE }}>
          {price + fee} {bi("EGP", "ج.م")}
        </span>
      </div>

      <div
        className="mt-4 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium"
        style={{ background: MUTED, color: TEXT_SECONDARY }}
      >
        <Lock className="h-3.5 w-3.5" style={{ color: SUCCESS }} />
        {bi("Secure checkout", "دفع آمن")}
      </div>

      <div
        className="mt-3 flex items-start gap-2 rounded-md p-3 text-[12px]"
        style={{ background: "color-mix(in oklab, #ef4444 8%, transparent)", color: TEXT_PRIMARY }}
      >
        <Clock className="h-4 w-4 mt-0.5" style={{ color: "var(--color-status-error-vivid)" }} />
        <span>
          {bi("Your seats are held for ", "مقاعدك محجوزة لمدة ")}
          <strong dir="ltr">14:28</strong>
          {bi(". Need more time? Tap to extend.", ". تحتاج وقتاً إضافياً؟ اضغط للتمديد.")}
        </span>
      </div>
    </aside>
  );
}

function ClassPage() {
  const bi = useBi();
  const CLASSES = useClasses();
  const [classId, setClassId] = useState("business");
  const [seat, setSeat] = useState<string | null>("4B");
  const selected = CLASSES.find((c) => c.id === classId)!;

  return (
    <div className="min-h-dvh" style={{ background: SURFACE }}>
      <SiteHeader />
      <Stepper />

      <div className="mx-auto max-w-7xl px-6 pt-5 text-[12px]" style={{ color: TEXT_TERTIARY }}>
        <span>{bi("Home", "الرئيسية")}</span>
        <span className="mx-1.5">›</span>
        <span>{bi("Book", "الحجز")}</span>
        <span className="mx-1.5">›</span>
        <span style={{ color: TEXT_SECONDARY }}>{bi("Class & Seat", "الدرجة والمقعد")}</span>
      </div>

      <main
        className="mx-auto max-w-7xl grid gap-8 px-6 pb-16 pt-4"
        style={{ gridTemplateColumns: "1fr 340px" }}
      >
        <section>
          <h1 className="text-[32px] font-bold" style={{ color: TEXT_PRIMARY }}>
            {bi("Select class & seat", "اختر الدرجة والمقعد")}
          </h1>
          <p className="mt-3 text-[14px]" style={{ color: TEXT_SECONDARY }}>
            {bi(
              "Pick the travel class that suits you, then choose an available seat on the coach map.",
              "اختر درجة السفر المناسبة لك، ثم حدّد مقعداً متاحاً على مخطط العربة.",
            )}
          </p>

          <div className="mt-6 grid gap-4">
            {CLASSES.map((c) => (
              <ClassCard
                key={c.id}
                opt={c}
                selected={classId === c.id}
                onSelect={() => setClassId(c.id)}
              />
            ))}
          </div>

          <div className="mt-8">
            <SeatMap selected={seat} onSelect={setSeat} />
          </div>

          <LocaleLink
            to="/passenger"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md py-3.5 text-[15px] font-semibold shadow-sm transition-[filter] hover:brightness-95"
            style={{
              background: AMBER,
              color: AMBER_TEXT,
              boxShadow: `0 4px 12px color-mix(in oklab, ${GOLD} 25%, transparent)`,
            }}
          >
            {bi("Continue to Passenger Details", "المتابعة إلى بيانات الراكب")}{" "}
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </LocaleLink>

          <div className="mt-4 text-center">
            <LocaleLink
              to="/search"
              className="inline-flex items-center gap-1.5 text-[13px]"
              style={{ color: TEXT_SECONDARY }}
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />{" "}
              {bi("Back to search results", "العودة إلى نتائج البحث")}
            </LocaleLink>
          </div>
        </section>

        <BookingSummary price={selected.price} seat={seat} />
      </main>
    </div>
  );
}
