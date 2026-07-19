import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
  Clock,
  CreditCard,
  Wallet,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useBi } from "@/i18n/bi";
import { useLocale } from "@/i18n/locale-context";
import { BookingProgress } from "@/components/site/BookingProgress";

export const Route = createFileRoute("/{-$locale}/payment")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        { title: isAr ? "الدفع — حجز سكك حديد مصر" : "Payment — ENR Booking" },
        {
          name: "description",
          content: isAr
            ? "أكمل دفع حجز رحلتك بالقطار بأمان. الخطوة ٤ من ٤."
            : "Complete your Egyptian Railway booking payment securely. Step 4 of 4.",
        },
        {
          property: "og:title",
          content: isAr ? "الدفع — حجز سكك حديد مصر" : "Payment — ENR Booking",
        },
        {
          property: "og:description",
          content: isAr ? "أكمل الدفع بأمان." : "Complete your ENR booking payment securely.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PaymentPage,
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
          to="/payment"
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
  return <BookingProgress current={4} />;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium" style={{ color: TEXT_PRIMARY }}>
      {children}
    </label>
  );
}

function TextField({
  id,
  placeholder,
  defaultValue,
  type = "text",
}: {
  id: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full rounded-md border px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-[color:var(--color-brand-primary)]"
      style={{
        borderColor: BORDER,
        background: "var(--color-background-elevated)",
        color: TEXT_PRIMARY,
      }}
    />
  );
}

type Method = "card" | "wallet" | "bank";

function MethodTab({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  id: Method;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3 text-[13px] font-semibold transition-colors"
      style={{
        borderColor: active ? NAVY : BORDER,
        background: active
          ? "color-mix(in oklab, var(--color-brand-primary) 6%, transparent)"
          : "var(--color-background-elevated)",
        color: active ? NAVY : TEXT_SECONDARY,
      }}
      aria-pressed={active}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function BookingSummary() {
  const bi = useBi();
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
        {bi("1 Adult • Business • Seat 4B", "١ بالغ • درجة الأعمال • مقعد ٤ب")}
      </div>
      <div className="text-[13px]" style={{ color: TEXT_SECONDARY }}>
        {bi("Ahmed Mansour", "أحمد منصور")}
      </div>

      <div className="my-4 h-px w-full" style={{ background: BORDER }} />
      <div className="flex items-center justify-between text-[13px]">
        <span style={{ color: TEXT_SECONDARY }}>{bi("1× Business", "١× درجة الأعمال")}</span>
        <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>
          {bi("385 EGP", "٣٨٥ ج.م")}
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[13px]">
        <span style={{ color: TEXT_SECONDARY }}>{bi("Booking fee", "رسوم الحجز")}</span>
        <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>
          {bi("10 EGP", "١٠ ج.م")}
        </span>
      </div>
      <div className="my-4 h-px w-full" style={{ background: BORDER }} />
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold" style={{ color: TEXT_PRIMARY }}>
          {bi("Total", "الإجمالي")}
        </span>
        <span className="text-[22px] font-bold" style={{ color: TEXT_PRICE }}>
          {bi("395 EGP", "٣٩٥ ج.م")}
        </span>
      </div>

      <div
        className="mt-4 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium"
        style={{ background: MUTED, color: TEXT_SECONDARY }}
      >
        <Lock className="h-3.5 w-3.5" style={{ color: SUCCESS }} />
        {bi("Secure 256-bit SSL", "اتصال SSL آمن ٢٥٦-بت")}
      </div>

      <div
        className="mt-3 flex items-start gap-2 rounded-md p-3 text-[12px]"
        style={{ background: "color-mix(in oklab, #ef4444 8%, transparent)", color: TEXT_PRIMARY }}
      >
        <Clock className="h-4 w-4 mt-0.5" style={{ color: "var(--color-status-error-vivid)" }} />
        <span>
          {bi("Your seats are held for ", "مقاعدك محجوزة لمدة ")}
          <strong dir="ltr">12:03</strong>
          {bi(". Complete payment to confirm.", ". أكمل الدفع للتأكيد.")}
        </span>
      </div>
    </aside>
  );
}

function PaymentPage() {
  const bi = useBi();
  const [method, setMethod] = useState<Method>("card");

  return (
    <div className="min-h-dvh" style={{ background: SURFACE }}>
      <SiteHeader />
      <Stepper />

      <div className="mx-auto max-w-7xl px-6 pt-5 text-[12px]" style={{ color: TEXT_TERTIARY }}>
        <span>{bi("Home", "الرئيسية")}</span>
        <span className="mx-1.5">›</span>
        <span>{bi("Book", "الحجز")}</span>
        <span className="mx-1.5">›</span>
        <span style={{ color: TEXT_SECONDARY }}>{bi("Payment", "الدفع")}</span>
      </div>

      <main
        className="mx-auto max-w-7xl grid gap-8 px-6 pb-16 pt-4"
        style={{ gridTemplateColumns: "1fr 340px" }}
      >
        <section>
          <h1 className="text-[32px] font-bold" style={{ color: TEXT_PRIMARY }}>
            {bi("Payment", "الدفع")}
          </h1>
          <p className="mt-3 text-[14px]" style={{ color: TEXT_SECONDARY }}>
            {bi(
              "Choose how you'd like to pay. All transactions are processed over a secure SSL connection.",
              "اختر طريقة الدفع المناسبة لك. جميع المعاملات تتم عبر اتصال SSL آمن.",
            )}
          </p>

          <div className="mt-6 flex gap-2">
            <MethodTab
              id="card"
              label={bi("Credit / Debit Card", "بطاقة ائتمان / خصم")}
              icon={CreditCard}
              active={method === "card"}
              onClick={() => setMethod("card")}
            />
            <MethodTab
              id="wallet"
              label={bi("Mobile Wallet", "محفظة الهاتف")}
              icon={Wallet}
              active={method === "wallet"}
              onClick={() => setMethod("wallet")}
            />
            <MethodTab
              id="bank"
              label={bi("Bank Transfer", "تحويل بنكي")}
              icon={Building2}
              active={method === "bank"}
              onClick={() => setMethod("bank")}
            />
          </div>

          {method === "card" && (
            <div
              className="mt-6 rounded-lg border p-6"
              style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}
            >
              <div className="grid gap-5">
                <div>
                  <Label>{bi("Cardholder name", "اسم حامل البطاقة")}</Label>
                  <TextField id="cardname" placeholder={bi("Ahmed Mansour", "أحمد منصور")} />
                </div>
                <div>
                  <Label>{bi("Card number", "رقم البطاقة")}</Label>
                  <TextField id="cardnum" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{bi("Expiry (MM/YY)", "تاريخ الانتهاء (ش/س)")}</Label>
                    <TextField id="exp" placeholder="09/28" />
                  </div>
                  <div>
                    <Label>{bi("CVV", "رمز CVV")}</Label>
                    <TextField id="cvv" placeholder="123" />
                  </div>
                </div>
                <label
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: TEXT_SECONDARY }}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[color:var(--color-brand-primary)]"
                  />
                  {bi("Save this card for future bookings", "حفظ هذه البطاقة للحجوزات المستقبلية")}
                </label>
              </div>
            </div>
          )}

          {method === "wallet" && (
            <div
              className="mt-6 rounded-lg border p-6"
              style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}
            >
              <Label>{bi("Mobile wallet number", "رقم محفظة الهاتف")}</Label>
              <TextField id="wallet" placeholder="+20 100 123 4567" />
              <p className="mt-3 text-[12px]" style={{ color: TEXT_TERTIARY }}>
                {bi(
                  "Supported: Vodafone Cash, Orange Money, Etisalat Cash, WE Pay.",
                  "المحافظ المدعومة: فودافون كاش، أورانج موني، اتصالات كاش، WE Pay.",
                )}
              </p>
            </div>
          )}

          {method === "bank" && (
            <div
              className="mt-6 rounded-lg border p-6 text-[13px]"
              style={{
                borderColor: BORDER,
                background: "var(--color-background-elevated)",
                color: TEXT_SECONDARY,
              }}
            >
              <p style={{ color: TEXT_PRIMARY }} className="font-semibold">
                {bi("Transfer to:", "التحويل إلى:")}
              </p>
              <p className="mt-2">
                {bi(
                  "National Bank of Egypt — ENR Bookings",
                  "البنك الأهلي المصري — حجوزات سكك حديد مصر",
                )}
              </p>
              <p dir="ltr">IBAN: EG38 0019 0005 0000 0001 2345 6789</p>
              <p className="mt-3">
                {bi("Use booking reference ", "استخدم رقم الحجز ")}
                <strong dir="ltr">ENR-4B-395</strong>
                {bi(
                  " as the transfer note. Your ticket will be issued once the transfer is confirmed (usually within 1 hour).",
                  " كملاحظة للتحويل. سيتم إصدار تذكرتك فور تأكيد التحويل (عادةً خلال ساعة).",
                )}
              </p>
            </div>
          )}

          <div
            className="mt-6 flex items-start gap-2 rounded-md border px-4 py-3 text-[13px]"
            style={{ borderColor: BORDER, background: MUTED, color: TEXT_SECONDARY }}
          >
            <ShieldCheck className="h-4 w-4 mt-0.5" style={{ color: SUCCESS }} />
            <span>
              {bi(
                "Your payment details are encrypted and never stored on our servers. ENR does not charge any additional card fees.",
                "بيانات الدفع الخاصة بك مشفّرة ولا يتم تخزينها على خوادمنا. لا تفرض الهيئة أي رسوم إضافية على البطاقات.",
              )}
            </span>
          </div>

          <LocaleLink
            to="/confirmation"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md py-3.5 text-[15px] font-semibold shadow-sm transition-[filter] hover:brightness-95"
            style={{
              background: AMBER,
              color: AMBER_TEXT,
              boxShadow: `0 4px 12px color-mix(in oklab, ${GOLD} 25%, transparent)`,
            }}
          >
            {bi("Pay 395 EGP", "ادفع ٣٩٥ ج.م")} <ArrowRight className="h-4 w-4 rtl-flip" />
          </LocaleLink>

          <div className="mt-4 text-center">
            <LocaleLink
              to="/passenger"
              className="inline-flex items-center gap-1.5 text-[13px]"
              style={{ color: TEXT_SECONDARY }}
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />{" "}
              {bi("Back to passenger details", "العودة إلى بيانات الراكب")}
            </LocaleLink>
          </div>
        </section>

        <BookingSummary />
      </main>
    </div>
  );
}
