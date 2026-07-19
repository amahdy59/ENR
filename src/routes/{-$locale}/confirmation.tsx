import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Download,
  Mail,
  Calendar,
  MapPin,
  Ticket,
  Share2,
  Home,
  QrCode,
  ArrowRight,
} from "lucide-react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useBi } from "@/i18n/bi";
import { useLocale } from "@/i18n/locale-context";

export const Route = createFileRoute("/{-$locale}/confirmation")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        {
          title: isAr ? "تم تأكيد الحجز — الهيئة القومية لسكك حديد مصر" : "Booking Confirmed — ENR",
        },
        {
          name: "description",
          content: isAr
            ? "تم تأكيد حجزك في سكك حديد مصر. اعرض تذكرتك الإلكترونية أو أضفها إلى التقويم أو قم بتنزيلها."
            : "Your Egyptian Railway booking is confirmed. View your e-ticket, add it to your calendar, or download it.",
        },
        {
          property: "og:title",
          content: isAr ? "تم تأكيد الحجز — سكك حديد مصر" : "Booking Confirmed — ENR",
        },
        {
          property: "og:description",
          content: isAr ? "تم تأكيد حجزك." : "Your ENR booking is confirmed.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ConfirmationPage,
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
          to="/"
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

function ConfirmationPage() {
  const bi = useBi();
  const reference = "ENR-4B-2510-0395";
  return (
    <div className="min-h-dvh" style={{ background: SURFACE }}>
      <SiteHeader />

      <div style={{ background: NAVY, color: TEXT_INVERSE }}>
        <div className="mx-auto max-w-4xl px-6 py-10 text-center">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: SUCCESS, color: TEXT_INVERSE }}
          >
            <Check className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-[30px] font-bold">
            {bi("Booking confirmed", "تم تأكيد الحجز")}
          </h1>
          <p className="mt-2 text-[14px]" style={{ color: TEXT_NAV_INACTIVE }}>
            {bi(
              "Thank you, Ahmed. Your e-ticket has been sent to ",
              "شكراً لك يا أحمد. تم إرسال تذكرتك الإلكترونية إلى ",
            )}
            <span style={{ color: TEXT_INVERSE }} dir="ltr">
              ahmed.m@example.com
            </span>
            .
          </p>
          <div
            className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] font-semibold"
            style={{
              borderColor: "color-mix(in oklab, #ffffff 20%, transparent)",
              color: TEXT_INVERSE,
            }}
          >
            <Ticket className="h-3.5 w-3.5" style={{ color: GOLD }} />
            {bi("Booking reference", "رقم الحجز")} <span dir="ltr">{reference}</span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div
          className="print-ticket rounded-xl border overflow-hidden"
          style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ background: MUTED, borderBottom: `1px solid ${BORDER}` }}
          >
            <div className="text-[13px] font-semibold" style={{ color: TEXT_PRIMARY }}>
              {bi("E-Ticket", "تذكرة إلكترونية")}
            </div>
            <div className="text-[11px]" style={{ color: TEXT_TERTIARY }}>
              {bi("Present this at the platform gate", "قدّم هذه التذكرة عند بوابة الرصيف")}
            </div>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-[1fr_180px]">
            <div>
              <div
                className="text-[12px] font-semibold uppercase tracking-wide"
                style={{ color: TEXT_TERTIARY }}
              >
                {bi("Cairo Central → Alexandria Misr", "القاهرة الرئيسية ← الإسكندرية مصر")}
              </div>
              <div className="mt-3 flex items-baseline gap-4">
                <div>
                  <div className="text-[28px] font-bold" style={{ color: TEXT_PRIMARY }} dir="ltr">
                    09:45
                  </div>
                  <div className="text-[12px]" style={{ color: TEXT_TERTIARY }}>
                    {bi("Cairo Central", "القاهرة الرئيسية")}
                  </div>
                </div>
                <div className="flex-1 border-t border-dashed" style={{ borderColor: BORDER }} />
                <div className="text-end">
                  <div className="text-[28px] font-bold" style={{ color: TEXT_PRIMARY }} dir="ltr">
                    12:30
                  </div>
                  <div className="text-[12px]" style={{ color: TEXT_TERTIARY }}>
                    {bi("Alexandria Misr", "الإسكندرية مصر")}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-[12px]" style={{ color: TEXT_TERTIARY }}>
                {bi("Direct • 2h 45m • Train ENR-928", "مباشر • ٢س ٤٥د • قطار ENR-928")}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-[13px] md:grid-cols-4">
                <div>
                  <div style={{ color: TEXT_TERTIARY }} className="text-[11px]">
                    {bi("Date", "التاريخ")}
                  </div>
                  <div className="font-semibold" style={{ color: TEXT_PRIMARY }}>
                    {bi("15 Oct 2025", "١٥ أكتوبر ٢٠٢٥")}
                  </div>
                </div>
                <div>
                  <div style={{ color: TEXT_TERTIARY }} className="text-[11px]">
                    {bi("Class", "الدرجة")}
                  </div>
                  <div className="font-semibold" style={{ color: TEXT_PRIMARY }}>
                    {bi("Business", "الأعمال")}
                  </div>
                </div>
                <div>
                  <div style={{ color: TEXT_TERTIARY }} className="text-[11px]">
                    {bi("Seat", "المقعد")}
                  </div>
                  <div className="font-semibold" style={{ color: TEXT_PRIMARY }}>
                    {bi("Coach 3 • 4B", "عربة ٣ • ٤ب")}
                  </div>
                </div>
                <div>
                  <div style={{ color: TEXT_TERTIARY }} className="text-[11px]">
                    {bi("Passenger", "الراكب")}
                  </div>
                  <div className="font-semibold" style={{ color: TEXT_PRIMARY }}>
                    {bi("Ahmed Mansour", "أحمد منصور")}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex flex-col items-center justify-center rounded-lg border p-4"
              style={{ borderColor: BORDER, background: MUTED }}
            >
              <div
                className="flex h-32 w-32 items-center justify-center rounded-md"
                style={{
                  background: "var(--color-background-elevated)",
                  border: `1px solid ${BORDER}`,
                }}
              >
                <QrCode className="h-24 w-24" style={{ color: "var(--color-text-brand)" }} />
              </div>
              <div className="mt-2 text-[10px]" style={{ color: TEXT_TERTIARY }}>
                {bi("Scan at gate", "امسح ضوئياً عند البوابة")}
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ background: MUTED, borderTop: `1px solid ${BORDER}` }}
          >
            <div className="text-[12px]" style={{ color: TEXT_TERTIARY }}>
              {bi("Total paid", "الإجمالي المدفوع")}
            </div>
            <div className="text-[18px] font-bold" style={{ color: TEXT_PRICE }}>
              {bi("395 EGP", "٣٩٥ ج.م")}
            </div>
          </div>
        </div>

        <div className="no-print mt-6 grid gap-3 sm:grid-cols-4">
          {[
            {
              icon: Download,
              label: bi("Print / Save PDF", "طباعة / حفظ PDF"),
              action: () => window.print(),
            },
            { icon: Download, label: bi("Download PDF", "تنزيل PDF") },
            { icon: Mail, label: bi("Resend email", "إعادة إرسال البريد") },
            { icon: Calendar, label: bi("Add to calendar", "إضافة إلى التقويم") },
          ].map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => {
                if ("action" in a && typeof (a as { action?: () => void }).action === "function") {
                  (a as { action: () => void }).action();
                  return;
                }
                import("sonner").then(({ toast }) =>
                  toast.success(`${a.label} — ${bi("done", "تم")}`),
                );
              }}

              className="flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-[13px] font-semibold transition-colors hover:bg-[color:var(--color-background-muted)]"
              style={{
                borderColor: BORDER,
                background: "var(--color-background-elevated)",
                color: TEXT_PRIMARY,
              }}
            >
              <a.icon className="h-4 w-4" style={{ color: "var(--color-text-brand)" }} />
              {a.label}
            </button>
          ))}
        </div>

        <div
          className="mt-8 rounded-lg border p-6"
          style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}
        >
          <h2 className="text-[16px] font-bold" style={{ color: TEXT_PRIMARY }}>
            {bi("What happens next", "الخطوات التالية")}
          </h2>
          <ul className="mt-4 space-y-3 text-[13px]" style={{ color: TEXT_SECONDARY }}>
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5" style={{ color: "var(--color-text-brand)" }} />
              {bi(
                "Arrive at Cairo Central at least 20 minutes before departure. Boarding closes 3 minutes before the train leaves.",
                "احرص على الوصول إلى محطة القاهرة الرئيسية قبل موعد المغادرة بـ٢٠ دقيقة على الأقل. تُغلق أبواب الصعود قبل تحرك القطار بـ٣ دقائق.",
              )}
            </li>
            <li className="flex items-start gap-3">
              <Ticket className="h-4 w-4 mt-0.5" style={{ color: "var(--color-text-brand)" }} />
              {bi(
                "Present the QR code above or your booking reference at the platform gate. A photo of your National ID or passport is required.",
                "قدّم رمز الاستجابة السريعة أعلاه أو رقم الحجز عند بوابة الرصيف. يُشترط تقديم صورة من الرقم القومي أو جواز السفر.",
              )}
            </li>
            <li className="flex items-start gap-3">
              <Share2 className="h-4 w-4 mt-0.5" style={{ color: "var(--color-text-brand)" }} />
              {bi(
                "Need to change or cancel? Free changes up to 24 hours before departure from your booking reference.",
                "تريد تعديل الحجز أو إلغاءه؟ التعديل مجاني حتى ٢٤ ساعة قبل المغادرة عبر رقم الحجز.",
              )}
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          <LocaleLink
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-[14px] font-semibold shadow-sm transition-[filter] hover:brightness-95"
            style={{
              background: AMBER,
              color: AMBER_TEXT,
              boxShadow: `0 4px 12px color-mix(in oklab, ${GOLD} 25%, transparent)`,
            }}
          >
            <Home className="h-4 w-4" /> {bi("Back to home", "العودة إلى الرئيسية")}
          </LocaleLink>
          <LocaleLink
            to="/search"
            className="inline-flex items-center gap-1.5 text-[13px]"
            style={{ color: TEXT_SECONDARY }}
          >
            {bi("Book another journey", "احجز رحلة أخرى")}{" "}
            <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
          </LocaleLink>
        </div>
      </main>
    </div>
  );
}
