import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  HelpCircle,
  Lock,
  Clock,
  Plus,
  Info,
} from "lucide-react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useBi } from "@/i18n/bi";
import { useLocale } from "@/i18n/locale-context";
import { BookingProgress } from "@/components/site/BookingProgress";

export const Route = createFileRoute("/{-$locale}/passenger")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        { title: isAr ? "بيانات الراكب — حجز سكك حديد مصر" : "Passenger Details — ENR Booking" },
        {
          name: "description",
          content: isAr
            ? "أدخل بيانات الراكب لإتمام حجز رحلتك بالقطار. الخطوة ٣ من ٤."
            : "Enter passenger details to complete your Egyptian Railway booking. Step 3 of 4.",
        },
        { property: "og:title", content: isAr ? "بيانات الراكب — حجز سكك حديد مصر" : "Passenger Details — ENR Booking" },
        {
          property: "og:description",
          content: isAr ? "أدخل بيانات الراكب لإتمام الحجز." : "Enter passenger details to complete your Egyptian Railway booking.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PassengerPage,
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
        <LocaleLink to="/" className="text-[20px] font-bold tracking-wide" style={{ color: TEXT_INVERSE }}>
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
        <LocaleLink to="/passenger" targetLocale={otherLocale} className="text-[13px]" style={{ color: TEXT_INVERSE }}>
          {bi("العربية", "English")}
        </LocaleLink>
      </div>
    </header>
  );
}

type StepState = "done" | "current" | "todo";

function Stepper() {
  return <BookingProgress current={3} />;
}

function Label({
  children,
  required,
  optional,
}: {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  const bi = useBi();
  return (
    <label className="mb-1.5 block text-[13px] font-medium" style={{ color: TEXT_PRIMARY }}>
      {children}
      {required && <span style={{ color: AMBER_TEXT }}> *</span>}
      {optional && (
        <span className="font-normal" style={{ color: TEXT_TERTIARY }}>
          {" "}
          ({bi("optional", "اختياري")})
        </span>
      )}
    </label>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-[12px]" style={{ color: TEXT_TERTIARY }}>
      {children}
    </p>
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
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-md border px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-[color:var(--color-brand-primary)]"
        style={{ borderColor: BORDER, background: "var(--color-background-elevated)", color: TEXT_PRIMARY }}
      />
      <HelpCircle
        className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4"
        style={{ color: TEXT_TERTIARY }}
      />
    </div>
  );
}

function Checkbox({
  id,
  checked,
  label,
}: {
  id: string;
  checked?: boolean;
  label: React.ReactNode;
}) {
  const [on, setOn] = useState(!!checked);
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer">
      <button
        type="button"
        id={id}
        onClick={() => setOn((v) => !v)}
        className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-[4px] border transition-colors"
        style={{
          background: on ? NAVY : "var(--color-background-elevated)",
          borderColor: on ? NAVY : BORDER,
        }}
        aria-pressed={on}
      >
        {on && <Check className="h-3.5 w-3.5" style={{ color: TEXT_INVERSE }} />}
      </button>
      <span className="text-[13px]" style={{ color: TEXT_PRIMARY }}>
        {label}
      </span>
    </label>
  );
}

function BookingSummary() {
  const bi = useBi();
  return (
    <aside className="rounded-lg border p-5" style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}>
      <h2 className="text-[16px] font-bold" style={{ color: TEXT_PRIMARY }}>{bi("Booking Summary", "ملخص الحجز")}</h2>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[20px] font-bold" style={{ color: TEXT_PRIMARY }} dir="ltr">09:45</span>
        <ArrowRight className="h-4 w-4 rtl-flip" style={{ color: TEXT_TERTIARY }} />
        <span className="text-[20px] font-bold" style={{ color: TEXT_PRIMARY }} dir="ltr">12:30</span>
      </div>
      <div className="mt-1 text-[12px]" style={{ color: TEXT_TERTIARY }}>{bi("Cairo Central → Alexandria Misr", "القاهرة الرئيسية ← الإسكندرية مصر")}</div>
      <div className="text-[12px]" style={{ color: TEXT_TERTIARY }}>{bi("Direct • 2h 45m", "مباشر • ٢س ٤٥د")}</div>

      <div className="my-4 h-px w-full" style={{ background: BORDER }} />

      <div className="text-[13px]" style={{ color: TEXT_PRIMARY }}>{bi("Tuesday 15 October 2025", "الثلاثاء ١٥ أكتوبر ٢٠٢٥")}</div>
      <div className="text-[13px]" style={{ color: TEXT_SECONDARY }}>{bi("1 Adult", "١ بالغ")}</div>
      <div className="text-[13px]" style={{ color: TEXT_SECONDARY }}>{bi("Economy Class", "الدرجة الاقتصادية")}</div>

      <div className="my-4 h-px w-full" style={{ background: BORDER }} />

      <div className="flex items-center justify-between text-[13px]">
        <span style={{ color: TEXT_SECONDARY }}>{bi("1× Economy", "١× اقتصادية")}</span>
        <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>{bi("245 EGP", "٢٤٥ ج.م")}</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[13px]">
        <span style={{ color: TEXT_SECONDARY }}>{bi("Booking fee", "رسوم الحجز")}</span>
        <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>{bi("10 EGP", "١٠ ج.م")}</span>
      </div>

      <div className="my-4 h-px w-full" style={{ background: BORDER }} />

      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold" style={{ color: TEXT_PRIMARY }}>{bi("Total", "الإجمالي")}</span>
        <span className="text-[22px] font-bold" style={{ color: TEXT_PRICE }}>{bi("255 EGP", "٢٥٥ ج.م")}</span>
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
          {bi("Your seats are held for ", "مقاعدك محجوزة لمدة ")}<strong dir="ltr">14:28</strong>{bi(". Need more time? Tap to extend.", ". تحتاج وقتاً إضافياً؟ اضغط للتمديد.")}
        </span>
      </div>
    </aside>
  );
}

function PassengerPage() {
  const bi = useBi();
  return (
    <div className="min-h-dvh" style={{ background: SURFACE }}>
      <SiteHeader />
      <Stepper />

      <div className="mx-auto max-w-7xl px-6 pt-5 text-[12px]" style={{ color: TEXT_TERTIARY }}>
        <span>{bi("Home", "الرئيسية")}</span>
        <span className="mx-1.5">›</span>
        <span>{bi("Book", "الحجز")}</span>
        <span className="mx-1.5">›</span>
        <span style={{ color: TEXT_SECONDARY }}>{bi("Passenger Details", "بيانات الراكب")}</span>
      </div>

      <main
        className="mx-auto max-w-7xl grid gap-8 px-6 pb-16 pt-4"
        style={{ gridTemplateColumns: "1fr 340px" }}
      >
        <section>
          <h1 className="text-[32px] font-bold" style={{ color: TEXT_PRIMARY }}>{bi("Passenger Details", "بيانات الراكب")}</h1>
          <p className="mt-3 text-[14px]" style={{ color: TEXT_SECONDARY }}>
            {bi(
              "Enter the lead passenger's details to complete your booking. Ensure the name matches your National ID or passport exactly.",
              "أدخل بيانات الراكب الرئيسي لإتمام حجزك. تأكد من أن الاسم مطابق تماماً لما هو موجود على الرقم القومي أو جواز السفر.",
            )}
          </p>
          <p className="mt-3 text-[13px]" style={{ color: TEXT_TERTIARY }}>
            <span style={{ color: AMBER_TEXT }}>*</span>{" "}
            {bi("Required fields are marked with an asterisk", "الحقول المطلوبة مميّزة بعلامة نجمة")}
          </p>

          <div className="mt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold" style={{ background: NAVY, color: TEXT_INVERSE }}>
                1
              </div>
              <h2 className="text-[18px] font-bold" style={{ color: TEXT_PRIMARY }}>
                {bi("Passenger 1 — Primary Contact", "الراكب ١ — جهة الاتصال الرئيسية")}
              </h2>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label required>{bi("First Name", "الاسم الأول")}</Label>
                <TextField id="fname" placeholder={bi("e.g. Ahmed", "مثلاً: أحمد")} />
                <Hint>{bi("As shown on your National ID or passport", "كما هو مدوّن على الرقم القومي أو جواز السفر")}</Hint>
              </div>
              <div>
                <Label required>{bi("Last Name", "اسم العائلة")}</Label>
                <TextField id="lname" placeholder={bi("e.g. Mansour", "مثلاً: منصور")} />
                <Hint>{bi("As shown on your National ID or passport", "كما هو مدوّن على الرقم القومي أو جواز السفر")}</Hint>
              </div>
            </div>

            <div className="mt-5">
              <Label required>{bi("Email Address", "البريد الإلكتروني")}</Label>
              <TextField id="email" type="email" placeholder="ahmed.m@example.com" />
              <Hint>
                {bi(
                  "e.g. ahmed.saad@example.com — your e-ticket will be sent here",
                  "مثلاً: ahmed.saad@example.com — سيتم إرسال تذكرتك الإلكترونية على هذا البريد",
                )}
              </Hint>
            </div>

            <div className="mt-5">
              <Label optional>{bi("Phone Number", "رقم الهاتف")}</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label={bi("Change country code", "تغيير رمز الدولة")}
                  onClick={() => import("sonner").then(({ toast }) => toast(bi("Country code picker — prototype", "قائمة رموز الدول — نموذج تجريبي")))}
                  className="inline-flex items-center gap-1 rounded-md border px-3 py-2.5 text-[14px]"
                  style={{ borderColor: BORDER, background: "var(--color-background-elevated)", color: TEXT_PRIMARY }}
                >
                  <span dir="ltr">+20</span> <ChevronDown className="h-4 w-4" />
                </button>

                <div className="flex-1">
                  <TextField id="phone" placeholder="01X XXXX XXXX" />
                </div>
              </div>
              <Hint>{bi("e.g. +20 100 123 4567 (include country code)", "مثلاً: +20 100 123 4567 (مع رمز الدولة)")}</Hint>
            </div>

            <div className="mt-5">
              <Label required>{bi("National ID / Passport", "الرقم القومي / جواز السفر")}</Label>
              <TextField id="natid" placeholder={bi("Enter ID number", "أدخل رقم الهوية")} />
              <Hint>{bi("14-digit Egyptian National ID, or passport number", "الرقم القومي المصري المكوّن من ١٤ رقماً، أو رقم جواز السفر")}</Hint>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-[16px] font-bold" style={{ color: TEXT_PRIMARY }}>
              {bi("Communication Preferences", "تفضيلات التواصل")}
            </h3>

            <div className="mt-4 space-y-3">
              <Checkbox
                id="cp-email"
                checked
                label={bi("Send booking confirmation to ahmed.m@example.com", "إرسال تأكيد الحجز إلى ahmed.m@example.com")}
              />
              <Checkbox id="cp-sms" label={bi("Receive journey updates by SMS", "تلقّي تحديثات الرحلة عبر الرسائل النصية")} />
            </div>

            <p className="mt-3 text-[12px]" style={{ color: TEXT_TERTIARY }}>
              {bi(
                "Message and data rates may apply. You can change preferences in My Account.",
                "قد يتم تطبيق رسوم الرسائل والبيانات. يمكنك تغيير التفضيلات من حسابي.",
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => import("sonner").then(({ toast }) => toast(bi("We'll email an accessibility form within 24 hours.", "سنرسل لك نموذج المساعدة خلال ٢٤ ساعة.")))}
            className="mt-8 flex w-full items-center gap-3 rounded-md border px-4 py-3 text-start text-[14px] font-medium"
            style={{ borderColor: BORDER, background: "var(--color-background-elevated)", color: AMBER_TEXT }}
          >
            <Plus className="h-4 w-4" />
            {bi(
              "Do you need accessibility assistance? (Pre-book required, 24 hours before travel)",
              "هل تحتاج إلى مساعدة لذوي الاحتياجات الخاصة؟ (يلزم الحجز المسبق قبل السفر بـ٢٤ ساعة)",
            )}
          </button>

          <div
            className="mt-6 flex items-start gap-2 rounded-md border px-4 py-3 text-[13px]"
            style={{ borderColor: BORDER, background: MUTED, color: TEXT_SECONDARY }}
          >
            <Info className="h-4 w-4 mt-0.5" style={{ color: "var(--color-text-brand)" }} />
            <span>
              {bi(
                "You will receive a booking confirmation email immediately after payment. No account required.",
                "ستتلقى بريد تأكيد الحجز فور إتمام الدفع. لا يلزم إنشاء حساب.",
              )}
            </span>
          </div>

          <LocaleLink
            to="/payment"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md py-3.5 text-[15px] font-semibold shadow-sm transition-[filter] hover:brightness-95"
            style={{
              background: AMBER,
              color: AMBER_TEXT,
              boxShadow: `0 4px 12px color-mix(in oklab, ${GOLD} 25%, transparent)`,
            }}
          >
            {bi("Continue to Payment", "المتابعة إلى الدفع")} <ArrowRight className="h-4 w-4 rtl-flip" />
          </LocaleLink>

          <div className="mt-4 text-center">
            <LocaleLink
              to="/class"
              className="inline-flex items-center gap-1.5 text-[13px]"
              style={{ color: TEXT_SECONDARY }}
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl-flip" /> {bi("Back to class selection", "العودة إلى اختيار الدرجة")}
            </LocaleLink>
          </div>
        </section>

        <BookingSummary />
      </main>
    </div>
  );
}
