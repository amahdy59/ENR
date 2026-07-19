import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useId, useRef, useState } from "react";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileTabBar } from "@/components/site/MobileTabBar";
import { BackToTop } from "@/components/site/BackToTop";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useBi } from "@/i18n/bi";
import { STATIONS } from "@/lib/stations";

import { StationCombobox } from "@/components/site/StationCombobox";

import {
  Bell,
  MapPin,
  Clock,
  Accessibility,
  AlertTriangle,
  X,
  ArrowUpDown,
  Calendar,
  Users,
  Plus,
  Search,
  Briefcase,
  TrainFront,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

import heroImg from "@/assets/enr-hero.jpg";
import routeAlex from "@/assets/route-alexandria.jpg";
import routeLuxor from "@/assets/route-luxor.jpg";
import routeAswan from "@/assets/route-aswan.jpg";
import routeMatrouh from "@/assets/route-matrouh.jpg";
import newsHighspeed from "@/assets/news-highspeed.jpg";
import newsAccessibility from "@/assets/news-accessibility.jpg";
import newsMobile from "@/assets/news-mobile.jpg";

export const Route = createFileRoute("/{-$locale}/")({
  head: ({ params }: { params: { locale?: string } }) => {
    const isAr = params.locale === "ar";
    const title = isAr
      ? "الهيئة القومية لسكك حديد مصر — خطط لرحلتك"
      : "ENR — Plan your journey across Egypt";
    const description = isAr
      ? "احجز تذاكر السكك الحديدية المصرية وتحقق من الجداول عبر أكثر من 350 محطة."
      : "Book Egyptian Railway tickets, plan journeys, and check timetables across 350+ stations connecting Cairo, Alexandria, Luxor, Aswan and beyond.";
    const canonical = isAr ? "/ar" : "/";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: heroImg },
        { property: "og:locale", content: isAr ? "ar_EG" : "en_US" },
        { property: "og:locale:alternate", content: isAr ? "en_US" : "ar_EG" },
      ],
      links: [
        { rel: "canonical", href: canonical },
        { rel: "alternate", hrefLang: "en", href: "/" },
        { rel: "alternate", hrefLang: "ar", href: "/ar" },
        { rel: "alternate", hrefLang: "x-default", href: "/" },
        { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" },
      ],
    };
  },

  component: Index,
});

type RoutePath =
  | "/"
  | "/tickets/fares"
  | "/tickets/passes"
  | "/tickets/discounts"
  | "/stations"
  | "/timetable"
  | "/timetable/live"
  | "/travel-info/luggage"
  | "/travel-info/safety"
  | "/travel-info/lost-property"
  | "/accessibility"
  | "/help"
  | "/contact"
  | "/news"
  | "/search"
  | "/auth";

const navLinks: { label: string; to: RoutePath; active?: boolean }[] = [
  { label: "Plan Journey", to: "/", active: true },
  { label: "Tickets & Fares", to: "/tickets/fares" },
  { label: "Stations", to: "/stations" },
  { label: "Timetables", to: "/timetable" },
  { label: "Travel Info", to: "/travel-info/luggage" },
];

const routes = [
  { from: "Cairo", to: "Alexandria", meta: "2h 45m · Trains every 30 min", price: "From 75 EGP", img: routeAlex, tags: [{ label: "WiFi" }, { label: "AC" }] },
  { from: "Cairo", to: "Luxor", meta: "9h 30m · 3 services daily", price: "From 180 EGP", img: routeLuxor, tags: [{ label: "Sleeper available", variant: "success" as const }] },
  { from: "Cairo", to: "Aswan", meta: "12h · Overnight service", price: "From 210 EGP", img: routeAswan, tags: [{ label: "Sleeper cabin", variant: "navy" as const }] },
  { from: "Alexandria", to: "Marsa Matrouh", meta: "3h 20m · Summer seasonal", price: "From 95 EGP", img: routeMatrouh, tags: [{ label: "Scenic coastal route" }] },
];

const news = [
  {
    tag: "New Service",
    date: "12 Oct 2025",
    title: "New high-speed service launched on Cairo–Alexandria corridor",
    body: "Egypt's rail network takes a massive leap forward with the integration of modern high-speed infrastructure.",
    img: newsHighspeed,
  },
  {
    tag: "Accessibility",
    date: "8 Oct 2025",
    title: "Station accessibility upgrades completed at 15 major stations across Egypt",
    body: "ENR has completed a major upgrade programme installing step-free ramps, audio announcements and tactile paths.",
    img: newsAccessibility,
  },
  {
    tag: "App Update",
    date: "1 Oct 2025",
    title: "ENR launches mobile e-ticketing — book, pay and board with your phone",
    body: "Passengers can now purchase, manage and validate tickets entirely on the ENR mobile app — no printer needed.",
    img: newsMobile,
  },
];

const planCards: { icon: typeof Briefcase; title: string; body: string; cta: string; to: RoutePath }[] = [
  { icon: Briefcase, title: "Baggage Allowance", body: "1 large bag free per passenger · Bicycles by reservation.", cta: "View baggage rules →", to: "/travel-info/luggage" },
  { icon: Accessibility, title: "Accessibility & Assistance", body: "Pre-book wheelchair assistance, priority seating, audio guides.", cta: "Book assistance →", to: "/accessibility" },
  { icon: Calendar, title: "Timetables & Maps", body: "Download the full October 2025 timetable as PDF.", cta: "Download →", to: "/timetable" },
  { icon: Users, title: "Group Bookings", body: "Groups of 10+ receive 15% discount. Free group coordinator support.", cta: "Get group rates →", to: "/help" },
];

const quickLinks: { title: string; sub: string; to: RoutePath }[] = [
  { title: "Service Alerts", sub: "2 active", to: "/timetable" },
  { title: "Station Finder", sub: "350+ stations", to: "/stations" },
  { title: "Timetables", sub: "Live & downloadable", to: "/timetable/live" },
  { title: "Travel Assistance", sub: "Pre-book support", to: "/accessibility" },
];

const footerQuick: { label: string; to: RoutePath }[] = [
  { label: "Plan a Journey", to: "/" },
  { label: "Buy Tickets", to: "/tickets/fares" },
  { label: "Station Finder", to: "/stations" },
  { label: "Timetables", to: "/timetable" },
  { label: "Travel Passes", to: "/tickets/passes" },
];

const footerHelp: { label: string; to: RoutePath }[] = [
  { label: "Help Centre", to: "/help" },
  { label: "Accessibility", to: "/accessibility" },
  { label: "Lost Property", to: "/travel-info/lost-property" },
  { label: "Refunds & Changes", to: "/help" },
  { label: "Contact Us", to: "/contact" },
];

const footerLegal: { label: string; to: RoutePath }[] = [
  { label: "Privacy Policy", to: "/accessibility" },
  { label: "Terms of Use", to: "/accessibility" },
  { label: "Accessibility Statement", to: "/accessibility" },
  { label: "Cookie Settings", to: "/accessibility" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

const plannerSchema = (trip: "one" | "return") =>
  z
    .object({
      from: z.string().trim().min(2, "Enter a departure station").max(80, "Departure is too long"),
      to: z.string().trim().min(2, "Enter an arrival station").max(80, "Arrival is too long"),
      date: z
        .string()
        .min(1, "Choose a travel date")
        .refine((d) => d >= todayISO(), "Travel date can't be in the past"),
      returnDate: z.string().optional().or(z.literal("")),
      passengers: z
        .string()
        .min(1, "Enter number of passengers")
        .refine((v) => {
          const n = Number(v);
          return Number.isInteger(n) && n >= 1 && n <= 9;
        }, "Between 1 and 9 passengers"),
    })
    .superRefine((val, ctx) => {
      if (val.from.trim().toLowerCase() === val.to.trim().toLowerCase() && val.from.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["to"],
          message: "Arrival must differ from departure",
        });
      }
      if (trip === "return") {
        if (!val.returnDate) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["returnDate"], message: "Choose a return date" });
        } else if (val.returnDate < val.date) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["returnDate"],
            message: "Return date must be on or after travel date",
          });
        }
      }
    });

type PlannerErrors = Partial<Record<"from" | "to" | "date" | "returnDate" | "passengers", string>>;

function Index() {
  const navigate = useNavigate();
  const { t } = useTranslation(["home", "common"]);
  const bi = useBi();

  const routes = [
    { from: bi("Cairo", "القاهرة"), to: bi("Alexandria", "الإسكندرية"), meta: bi("2h 45m · Trains every 30 min", "2س 45د · قطارات كل 30 دقيقة"), price: bi("From 75 EGP", "تبدأ من 75 ج.م"), img: routeAlex, tags: [{ label: bi("WiFi", "واي فاي") }, { label: bi("AC", "تكييف") }] },
    { from: bi("Cairo", "القاهرة"), to: bi("Luxor", "الأقصر"), meta: bi("9h 30m · 3 services daily", "9س 30د · 3 رحلات يوميًا"), price: bi("From 180 EGP", "تبدأ من 180 ج.م"), img: routeLuxor, tags: [{ label: bi("Sleeper available", "عربة نوم متاحة"), variant: "success" as const }] },
    { from: bi("Cairo", "القاهرة"), to: bi("Aswan", "أسوان"), meta: bi("12h · Overnight service", "12س · رحلة ليلية"), price: bi("From 210 EGP", "تبدأ من 210 ج.م"), img: routeAswan, tags: [{ label: bi("Sleeper cabin", "كابينة نوم"), variant: "navy" as const }] },
    { from: bi("Alexandria", "الإسكندرية"), to: bi("Marsa Matrouh", "مرسى مطروح"), meta: bi("3h 20m · Summer seasonal", "3س 20د · موسمي صيفي"), price: bi("From 95 EGP", "تبدأ من 95 ج.م"), img: routeMatrouh, tags: [{ label: bi("Scenic coastal route", "مسار ساحلي خلاب") }] },
  ];

  const news = [
    { tag: bi("New Service", "خدمة جديدة"), date: bi("12 Oct 2025", "12 أكتوبر 2025"), title: bi("New high-speed service launched on Cairo–Alexandria corridor", "إطلاق خدمة قطار سريع جديد على خط القاهرة – الإسكندرية"), body: bi("Egypt's rail network takes a massive leap forward with the integration of modern high-speed infrastructure.", "شبكة السكك الحديدية المصرية تخطو خطوة كبيرة إلى الأمام بدمج بنية تحتية حديثة للقطارات السريعة."), img: newsHighspeed },
    { tag: bi("Accessibility", "إتاحة الوصول"), date: bi("8 Oct 2025", "8 أكتوبر 2025"), title: bi("Station accessibility upgrades completed at 15 major stations across Egypt", "الانتهاء من ترقيات إتاحة الوصول في 15 محطة رئيسية عبر مصر"), body: bi("ENR has completed a major upgrade programme installing step-free ramps, audio announcements and tactile paths.", "أكملت الهيئة برنامج ترقيات شاملًا يتضمن منحدرات، وإعلانات صوتية، ومسارات لمسية."), img: newsAccessibility },
    { tag: bi("App Update", "تحديث التطبيق"), date: bi("1 Oct 2025", "1 أكتوبر 2025"), title: bi("ENR launches mobile e-ticketing — book, pay and board with your phone", "الهيئة تطلق التذاكر الإلكترونية عبر الهاتف — احجز وادفع واستقل بهاتفك"), body: bi("Passengers can now purchase, manage and validate tickets entirely on the ENR mobile app — no printer needed.", "يمكن للركاب الآن شراء التذاكر وإدارتها والتحقق منها بالكامل عبر تطبيق الهيئة على الهاتف — دون الحاجة إلى طابعة."), img: newsMobile },
  ];

  const planCards: { icon: typeof Briefcase; title: string; body: string; cta: string; to: RoutePath }[] = [
    { icon: Briefcase, title: bi("Baggage Allowance", "السماح بالأمتعة"), body: bi("1 large bag free per passenger · Bicycles by reservation.", "حقيبة كبيرة مجانًا لكل راكب · الدراجات بحجز مسبق."), cta: bi("View baggage rules →", "عرض قواعد الأمتعة →"), to: "/travel-info/luggage" },
    { icon: Accessibility, title: bi("Accessibility & Assistance", "إتاحة الوصول والمساعدة"), body: bi("Pre-book wheelchair assistance, priority seating, audio guides.", "احجز مسبقًا خدمات الكراسي المتحركة، والمقاعد ذات الأولوية، والأدلة الصوتية."), cta: bi("Book assistance →", "احجز المساعدة →"), to: "/accessibility" },
    { icon: Calendar, title: bi("Timetables & Maps", "الجداول والخرائط"), body: bi("Download the full October 2025 timetable as PDF.", "قم بتحميل جدول أكتوبر 2025 الكامل بصيغة PDF."), cta: bi("Download →", "تحميل →"), to: "/timetable" },
    { icon: Users, title: bi("Group Bookings", "حجوزات المجموعات"), body: bi("Groups of 10+ receive 15% discount. Free group coordinator support.", "خصم 15% للمجموعات من 10 أشخاص فأكثر مع دعم منسق مجموعة مجاني."), cta: bi("Get group rates →", "احصل على أسعار المجموعات →"), to: "/help" },
  ];

  const quickLinks: { key: "alerts" | "stations" | "timetables" | "assistance"; title: string; sub: string; to: RoutePath }[] = [
    { key: "alerts", title: bi("Service Alerts", "تنبيهات الخدمة"), sub: bi("2 active", "تنبيهان نشطان"), to: "/timetable" },
    { key: "stations", title: bi("Station Finder", "البحث عن محطة"), sub: bi("350+ stations", "أكثر من 350 محطة"), to: "/stations" },
    { key: "timetables", title: bi("Timetables", "مواعيد القطارات"), sub: bi("Live & downloadable", "مباشرة وقابلة للتحميل"), to: "/timetable/live" },
    { key: "assistance", title: bi("Travel Assistance", "مساعدة المسافرين"), sub: bi("Pre-book support", "حجز مسبق للدعم"), to: "/accessibility" },
  ];


  const [trip, setTrip] = useState<"one" | "return">("one");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(todayISO());
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [errors, setErrors] = useState<PlannerErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [alertDismissed, setAlertDismissed] = useState(false);

  const fieldNames: Array<keyof PlannerErrors> = ["from", "to", "date", "returnDate", "passengers"];

  const runValidation = (): PlannerErrors => {
    const result = plannerSchema(trip).safeParse({ from, to, date, returnDate, passengers });
    if (result.success) return {};
    const next: PlannerErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof PlannerErrors;
      if (key && !next[key]) next[key] = issue.message;
    }
    return next;
  };

  const handleFieldChange = (key: keyof PlannerErrors, setter: (v: string) => void) => (v: string) => {
    setter(v);
    if (submitAttempted && errors[key]) {
      setErrors((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  

  /** Resolve a free-text input to a station id by matching name/city/code. */
  const resolveStationId = (input: string): string | undefined => {
    const q = input.trim().toLowerCase();
    if (!q) return undefined;
    return STATIONS.find(
      (s) =>
        s.name.en.toLowerCase() === q ||
        s.name.ar === input.trim() ||
        s.code.toLowerCase() === q ||
        s.city.en.toLowerCase() === q ||
        s.city.ar === input.trim(),
    )?.id ?? STATIONS.find(
      (s) =>
        s.name.en.toLowerCase().includes(q) ||
        s.name.ar.includes(input.trim()) ||
        s.city.en.toLowerCase().includes(q),
    )?.id;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const next = runValidation();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = fieldNames.find((n) => next[n]);
      if (first) {
        const el = formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`);
        el?.focus();
      }
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const fromId = resolveStationId(from);
    const toId = resolveStationId(to);
    navigate({
      to: "/search",
      search: {
        from: fromId ?? from.trim(),
        to: toId ?? to.trim(),
        date,
        pax: passengers,
        ...(trip === "return" && returnDate ? { returnDate } : {}),
      } as never,
    });
  };


  return (
    <div className="min-h-dvh bg-[color:var(--color-background-base)] font-sans text-[color:var(--color-text-primary)] pb-16 md:pb-0">
      <a href="#main-content" className="skip-to-content">{t("common:actions.skipToContent")}</a>

      <SiteHeader />

      {/* HERO */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">

      <section className="relative w-full overflow-hidden md:min-h-0 min-h-[calc(100dvh-3.5rem-4rem)]">

        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[rgba(13,31,60,0.92)] via-[rgba(13,31,60,0.78)] md:via-[rgba(13,31,60,0.5)] to-[rgba(13,31,60,0.65)] md:to-[rgba(13,31,60,0.1)]" />
        <div className="relative mx-auto flex max-w-[1440px] flex-col items-stretch md:items-center gap-4 md:gap-20 px-4 md:px-20 py-5 md:py-28 md:flex-row">
          {/* Copy — condensed on mobile, full on md+ */}
          <div className="reveal-up flex max-w-[560px] flex-col gap-2 md:gap-4 text-white">
            <span className="hidden md:inline-flex w-fit items-center rounded-full border border-[color:var(--color-brand-secondary)] bg-[color:var(--color-interactive-cta)] px-3 py-1.5 text-[13px] font-semibold text-[color:var(--color-interactive-cta-text)] shadow-[0_8px_24px_rgba(245,158,11,0.24)]">
              {t("home:hero.eyebrow")}
            </span>
            <h1 className="text-[26px] leading-tight font-bold md:text-[56px] md:leading-[64px] text-center md:text-start">
              <span className="md:hidden">{t("home:hero.titleLine1")} {t("home:hero.titleLine2")}</span>
              <span className="hidden md:inline">
                {t("home:hero.titleLine1")}
                <br />
                <span className="text-[color:var(--color-text-on-dark-accent)]">{t("home:hero.titleLine2")}</span>
              </span>
            </h1>
            <p className="hidden md:block max-w-[480px] text-base leading-6 text-white/85">
              {t("home:hero.subtitle")}
            </p>
            <div className="hidden md:flex mt-2 flex-wrap gap-5 text-sm font-medium text-white/90">
              <span>✓ {t("home:hero.bullets.eticket")}</span>
              <span>✓ {t("home:hero.bullets.noAccount")}</span>
              <span>✓ {t("home:hero.bullets.payments")}</span>
            </div>
          </div>

          {/* Planner */}
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            aria-labelledby="planner-heading"
            className="reveal-up w-full md:max-w-[480px] rounded-2xl bg-[color:var(--color-background-elevated)] p-4 md:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
          >
            <h2 id="planner-heading" className="sr-only">{t("home:planner.submit")}</h2>
            <div className="flex flex-col gap-4">
              {/* Tabs */}
              <div role="radiogroup" aria-label={t("home:planner.tripOneWay") + " / " + t("home:planner.tripReturn")} className="flex h-9 overflow-hidden rounded-lg bg-[color:var(--color-background-surface)] p-0.5">
                <button
                  type="button"
                  role="radio"
                  aria-checked={trip === "one"}
                  onClick={() => setTrip("one")}
                  className={`flex-1 rounded-md text-sm font-semibold ${trip === "one" ? "bg-[color:var(--color-background-nav-bar)] text-white shadow-sm" : "text-[color:var(--color-text-brand)] hover:bg-[color:var(--color-background-elevated)]"}`}
                >
                  {t("home:planner.tripOneWay")}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={trip === "return"}
                  onClick={() => setTrip("return")}
                  className={`flex-1 rounded-md text-sm font-semibold ${trip === "return" ? "bg-[color:var(--color-background-nav-bar)] text-white shadow-sm" : "text-[color:var(--color-text-brand)] hover:bg-[color:var(--color-background-elevated)]"}`}
                >
                  {t("home:planner.tripReturn")}
                </button>
              </div>
              <p className="text-[13px] text-[color:var(--color-text-price-accent)]">
                <span aria-hidden="true">* </span>{t("home:planner.requiredNote").replace(/^\*\s*/, "")}
              </p>



              {submitAttempted && Object.keys(errors).length > 0 && (
                <div
                  ref={summaryRef}
                  tabIndex={-1}
                  role="alert"
                  aria-live="assertive"
                  className="rounded-lg border border-[color:var(--color-status-error-vivid)] bg-[color:var(--color-status-error-bg)] p-3 text-sm text-[color:var(--color-status-error)]"
                >
                  <p className="font-semibold">
                    {bi(
                      `Please fix ${Object.keys(errors).length} ${Object.keys(errors).length === 1 ? "issue" : "issues"} before searching:`,
                      `يُرجى تصحيح ${Object.keys(errors).length === 1 ? "خطأ واحد" : `${Object.keys(errors).length} أخطاء`} قبل البحث:`,
                    )}
                  </p>
                  <ul className="mt-1 list-disc ps-5">
                    {fieldNames.filter((n) => errors[n]).map((n) => (
                      <li key={n}>{errors[n]}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* From / swap / To */}
              <div className="flex flex-col gap-3">
                <StationCombobox
                  name="from"
                  label={t("home:planner.from")}
                  placeholder={t("home:planner.fromPlaceholder")}
                  helper={t("home:planner.fromHelper")}
                  value={from}
                  onChange={handleFieldChange("from", setFrom)}
                  required
                  error={errors.from}
                />
                <div className="flex justify-center">
                  <button
                    type="button"
                    aria-label={t("home:planner.swap")}
                    onClick={() => {
                      setFrom(to);
                      setTo(from);
                    }}
                    className="press-scale group flex size-10 items-center justify-center rounded-full border-[1.5px] border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] shadow-[0_2px_3px_rgba(0,0,0,0.12)] hover:border-[color:var(--color-border-accent)] hover:shadow-[0_6px_18px_rgba(13,31,60,0.14)]"
                  >
                    <ArrowUpDown className="icon-wiggle size-[18px] text-[color:var(--color-text-brand)]" aria-hidden="true" />
                  </button>
                </div>
                <StationCombobox
                  name="to"
                  label={t("home:planner.to")}
                  placeholder={t("home:planner.toPlaceholder")}
                  helper={t("home:planner.toHelper")}
                  value={to}
                  onChange={handleFieldChange("to", setTo)}
                  required
                  error={errors.to}
                />
              </div>


              <PlannerDateField
                name="date"
                label={t("home:planner.date")}
                value={date}
                onChange={handleFieldChange("date", setDate)}
                helper={t("home:planner.dateHelper")}
                required
                min={todayISO()}
                error={errors.date}
              />
              {trip === "return" && (
                <PlannerDateField
                  name="returnDate"
                  label={t("home:planner.returnDate")}
                  value={returnDate}
                  onChange={handleFieldChange("returnDate", setReturnDate)}
                  helper={t("home:planner.returnDateHelper")}
                  required
                  min={date || todayISO()}
                  error={errors.returnDate}
                />
              )}
              <PlannerField
                name="passengers"
                label={t("home:planner.passengers")}
                type="number"
                min={1}
                max={9}
                icon={<Users className="size-[18px] text-[color:var(--color-text-brand)]" aria-hidden="true" />}
                value={passengers}
                onChange={handleFieldChange("passengers", setPassengers)}
                helper={t("home:planner.passengersHelper")}
                required
                error={errors.passengers}
              />


              {trip === "one" && (
                <button
                  type="button"
                  onClick={() => setTrip("return")}
                  className="press-scale group flex h-11 items-center gap-2 rounded-lg border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-background-surface)] px-3 text-sm font-semibold text-[color:var(--color-text-price-accent)] hover:border-[color:var(--color-border-accent)] hover:bg-[color:var(--color-background-elevated)]"
                >
                  <Plus className="icon-pop size-4" aria-hidden="true" /> {t("home:planner.addReturn")}
                </button>
              )}

              <button
                type="submit"
                className="cta-glow press-scale group flex h-14 items-center justify-center gap-2 rounded-[10px] bg-[color:var(--color-brand-secondary)] text-[18px] font-semibold text-[color:var(--color-interactive-cta-text)] shadow-[0_4px_16px_rgba(200,144,42,0.35)] hover:brightness-105"
              >
                {t("home:planner.submit")} <Search className="icon-pop size-5" />
              </button>

              <p className="text-center text-[13px] text-[color:var(--color-text-price-accent)]">
                🔒 {t("home:planner.trustline")}
              </p>
              <LocaleLink to="/accessibility" className="link-underline mx-auto text-center text-[13px] font-semibold text-[color:var(--color-text-price-accent)]">
                {t("home:planner.accessibility")} →
              </LocaleLink>

            </div>
          </form>
        </div>
      </section>

      {/* QUICK LINKS */}
      <div className="border-y border-[color:var(--color-border-medium)] bg-[color:var(--color-background-elevated)]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((q, i) => (
            <QuickLink
              key={q.key}
              to={q.to}
              icon={
                q.key === "alerts" ? <Bell className="size-6 text-[color:var(--color-text-brand)]" /> :
                q.key === "stations" ? <MapPin className="size-6 text-[color:var(--color-text-brand)]" /> :
                q.key === "timetables" ? <Clock className="size-6 text-[color:var(--color-text-brand)]" /> :
                <Accessibility className="size-6 text-[color:var(--color-text-brand)]" />
              }
              title={q.title}
              sub={q.sub}
              subAccent={i === 0}
              last={i === quickLinks.length - 1}
            />
          ))}
        </div>
      </div>

      {/* ALERT BANNER */}
      {!alertDismissed && (
        <div className="w-full border-s-4 border-[color:var(--color-border-accent)] bg-[color:var(--color-background-warm)]">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-3 md:px-16">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-5 text-[color:var(--color-status-warning)]" />
              <p className="text-sm">
                <span className="font-bold">{t("home:alert.line")}</span> {t("home:alert.body")}
                <span className="ms-1 text-xs text-[color:var(--color-text-placeholder)]">{t("home:alert.updated")}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <LocaleLink to="/timetable" className="link-underline text-sm font-semibold">{t("home:alert.seeAlternatives")} →</LocaleLink>
              <button
                type="button"
                aria-label={t("home:alert.dismiss")}
                onClick={() => setAlertDismissed(true)}
                className="press-scale inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-[color:var(--color-background-elevated)]"
              >
                <X className="size-[18px]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPULAR ROUTES */}
      <Section bg="surface">
        <SectionHeader title={bi("Popular Routes", "أبرز الوجهات")} subtitle={bi("Discover Egypt by rail", "اكتشف مصر عبر السكك الحديدية")} cta={bi("View all routes →", "عرض كافة الوجهات →")} ctaTo="/stations" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((r) => (
            <article
              key={`${r.from}-${r.to}`}
              className="route-card group relative flex flex-col overflow-hidden rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] shadow-[0_2px_6px_rgba(13,31,60,0.06)] transition-[border-color,box-shadow] duration-500 ease-out hover:border-[color:var(--color-border-accent)] hover:shadow-[0_10px_28px_-14px_rgba(13,31,60,0.28)] focus-within:border-[color:var(--color-border-accent)] focus-within:shadow-[0_10px_28px_-14px_rgba(13,31,60,0.28)]"
            >
              <div className="relative h-[180px] overflow-hidden">
                <img
                  src={r.img}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="route-card__img absolute inset-0 h-full w-full object-cover"
                />
                {/* Subtle gradient for text legibility (static, no hover change) */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                {/* Rail line: two static ties + a "train" dot that travels the track on hover */}
                <div className="route-card__rail pointer-events-none absolute inset-x-4 bottom-3 h-[2px] rounded-full bg-white/25">
                  <span className="route-card__train absolute top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-[color:var(--color-brand-secondary)] shadow-[0_0_0_3px_rgba(200,144,42,0.25)]" />
                </div>

                <p className="absolute bottom-6 start-4 text-base font-bold text-white drop-shadow">{r.from} → {r.to}</p>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="text-base font-semibold text-[color:var(--color-text-brand)]">{r.from} → {r.to}</p>
                <p className="text-[13px] leading-[18px]">{r.meta}</p>
                <p className="text-sm font-bold text-[color:var(--color-text-price-accent)]">{r.price}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {r.tags.map((t) => (
                    <Tag key={t.label} variant={"variant" in t ? t.variant : undefined}>{t.label}</Tag>
                  ))}
                </div>
                <LocaleLink
                  to="/search"
                  aria-label={bi(`View trains for ${r.from} to ${r.to}`, `عرض قطارات ${r.from} إلى ${r.to}`)}
                  className="mt-auto inline-flex w-fit items-center gap-1 rounded-sm text-[13px] font-semibold text-[color:var(--color-text-price-accent)] outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-[color:var(--color-border-accent)] focus-visible:ring-offset-2"
                >
                  <span className="link-underline">{bi("View trains", "عرض القطارات")}</span>
                  <span aria-hidden="true" className="route-card__arrow inline-block">→</span>
                </LocaleLink>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* LIVE DEPARTURES */}
      <div className="w-full bg-[color:var(--color-background-nav-bar)] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-16">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-[#12b76a] shadow-[0_0_0_4px_rgba(18,183,106,0.2)]" />
              <span className="text-[13px] font-bold tracking-wide">{bi("LIVE DEPARTURES", "المغادرات المباشرة")}</span>
            </div>
            <p className="text-sm"><span>{bi("Train 8502 Cairo → Alexandria 09:45", "قطار 8502 القاهرة ← الإسكندرية 09:45")}</span> <span className="text-[#12b76a]">● {bi("On time", "في الموعد")}</span></p>
            <p className="text-sm"><span>{bi("Train 8640 Cairo → Luxor 10:00", "قطار 8640 القاهرة ← الأقصر 10:00")}</span> <span className="text-[color:var(--color-text-on-dark-accent)]">⚠ {bi("Delayed 15m", "متأخر 15 دقيقة")}</span></p>
            <p className="text-sm hidden md:inline"><span>{bi("Train 9012 Alexandria → Cairo 10:15", "قطار 9012 الإسكندرية ← القاهرة 10:15")}</span> <span className="text-[#12b76a]">● {bi("On time", "في الموعد")}</span></p>
          </div>
          <LocaleLink to="/timetable/live" className="link-underline text-sm font-semibold">{bi("View all departures →", "عرض كل المغادرات →")}</LocaleLink>
        </div>
      </div>

      {/* STATS */}
      <div className="w-full border-t border-[color:var(--color-border-brand)] bg-[color:var(--color-background-surface)]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">
          {[
            ["350+", bi("Stations nationwide", "محطة في جميع أنحاء البلاد")],
            ["12,000+", bi("Daily passengers", "راكب يوميًا")],
            ["98.2%", bi("On-time performance", "الالتزام بالمواعيد")],
            ["24/7", bi("Customer support", "دعم العملاء")],
          ].map(([n, label]) => (
            <div key={label} className="flex flex-col items-center justify-center gap-1 py-8">
              <p className="text-[40px] font-bold leading-[48px] text-[color:var(--color-text-brand)]">{n}</p>
              <p className="text-sm text-[color:var(--color-text-secondary)]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* NEWS */}
      <Section bg="base">
        <SectionHeader title={bi("News & Updates", "الأخبار والتحديثات")} subtitle={bi("Latest from ENR", "آخر مستجدات الهيئة")} cta={bi("View all →", "عرض الكل →")} ctaTo="/news" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {news.map((n) => (
            <article key={n.title} className="interactive-surface group overflow-hidden rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)]">
              <div className="relative h-[200px] overflow-hidden">
                <img src={n.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-[color:var(--color-brand-secondary)]" />
              </div>

              <div className="flex flex-col gap-3 p-6">
                <div className="flex items-start justify-between">
                  <span className="rounded bg-[color:var(--color-brand-secondary)] px-2 py-0.5 text-xs font-bold text-[color:var(--color-interactive-cta-text)]">{n.tag}</span>
                  <span className="text-xs text-[color:var(--color-text-secondary)]">{n.date}</span>
                </div>
                <h3 className="text-lg font-bold leading-6 text-[color:var(--color-text-brand)]">{n.title}</h3>
                <p className="text-sm leading-5 text-[color:var(--color-text-secondary)]">{n.body}</p>
                <LocaleLink to="/news" className="link-underline w-fit text-sm font-semibold text-[color:var(--color-text-price-accent)]">{bi("Read more →", "اقرأ المزيد →")}</LocaleLink>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* PLAN AHEAD */}
      <Section bg="base">
        <SectionHeader title={bi("Plan Ahead", "خطط مسبقًا")} subtitle={bi("Everything you need for a smooth journey", "كل ما تحتاجه لرحلة سلسة")} cta={bi("View all guides →", "عرض كل الأدلة →")} ctaTo="/help" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {planCards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="group flex flex-col gap-4 rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition hover:border-[color:var(--color-border-accent)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)]">
                <div className="flex size-14 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary-tint)] transition-colors group-hover:bg-[color:var(--color-background-warm)]">
                  <Icon className="icon-pop size-7 text-[color:var(--color-text-brand)]" />
                </div>
                <h3 className="text-lg font-semibold text-[color:var(--color-text-brand)]">{c.title}</h3>
                <p className="text-sm leading-5 text-[color:var(--color-text-secondary)]">{c.body}</p>
                <LocaleLink to={c.to} className="link-underline w-fit text-[13px] font-semibold text-[color:var(--color-text-price-accent)]">{c.cta}</LocaleLink>
              </div>
            );
          })}
        </div>
      </Section>
      </main>

      <SiteFooter />
      <MobileTabBar />
      <BackToTop />

    </div>
  );
}

/* -------- helpers -------- */

function PlannerField({
  name,
  label,
  icon,
  placeholder,
  value,
  helper,
  onChange,
  type = "text",
  required,
  min,
  max,
  autoComplete,
  error,
  list,
}: {
  name?: string;
  label: string;
  icon: React.ReactNode;
  placeholder?: string;
  value?: string;
  helper: string;
  onChange?: (v: string) => void;
  type?: string;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  autoComplete?: string;
  error?: string;
  list?: string;
}) {
  const inputId = useId();
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const invalid = Boolean(error);
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-[color:var(--color-text-brand)]"
      >
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ms-0.5 text-[color:var(--color-status-error-vivid)]">*</span>
            <span className="sr-only"> required</span>
          </>
        )}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
          {icon}
        </span>
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          min={min}
          max={max}
          autoComplete={autoComplete}
          list={list}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-describedby={invalid ? `${errorId} ${helperId}` : helperId}
          className={`field-interaction h-12 w-full rounded-lg border bg-[color:var(--color-background-elevated)] ps-10 pe-3 text-[15px] text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-placeholder)] ${
            invalid
              ? "border-[color:var(--color-status-error-vivid)] ring-2 ring-[color:var(--color-status-error-vivid)]/40"
              : "border-[color:var(--color-border-default)]"
          }`}
        />
      </div>
      {invalid && (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-xs font-semibold text-[color:var(--color-status-error)]">
          <AlertTriangle className="mt-[1px] size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
      <p id={helperId} className="text-xs text-[color:var(--color-text-secondary)]">{helper}</p>
    </div>
  );
}

function PlannerDateField({
  name,
  label,
  value,
  onChange,
  helper,
  required,
  min,
  error,
}: {
  name?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper: string;
  required?: boolean;
  min?: string;
  error?: string;
}) {
  const inputId = useId();
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const invalid = Boolean(error);
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation("home");
  const selectedDate = value ? parseISO(value) : undefined;
  const minDate = min ? parseISO(min) : undefined;
  const dateLabel = selectedDate
    ? new Intl.DateTimeFormat(i18n.language, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(selectedDate)
    : t("planner.selectDate");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-[color:var(--color-text-brand)]"
      >
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ms-0.5 text-[color:var(--color-status-error-vivid)]">*</span>
            <span className="sr-only"> required</span>
          </>
        )}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={inputId}
            type="button"
            name={name}
            aria-invalid={invalid || undefined}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-describedby={invalid ? `${errorId} ${helperId}` : helperId}
            className={cn(
              "field-interaction group flex h-12 w-full items-center gap-2 rounded-lg border bg-[color:var(--color-background-elevated)] ps-3 pe-3 text-start text-[15px] text-[color:var(--color-text-primary)]",
              invalid
                ? "border-[color:var(--color-status-error-vivid)] ring-2 ring-[color:var(--color-status-error-vivid)]/40"
                : "border-[color:var(--color-border-default)]",
            )}
          >
            <Calendar className="icon-pop size-[18px] shrink-0 text-[color:var(--color-text-brand)]" aria-hidden="true" />
            <span className={cn("flex-1 truncate", !selectedDate && "text-[color:var(--color-text-placeholder)]")}>
              {dateLabel}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto rounded-xl border-2 border-[color:var(--color-border-brand)] bg-[color:var(--color-background-elevated)] p-0 shadow-[0_16px_40px_rgba(13,31,60,0.18)]"
          align="start"
          sideOffset={8}
        >
          <CalendarPicker
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              if (d) {
                onChange(format(d, "yyyy-MM-dd"));
                setOpen(false);
              }
            }}
            disabled={minDate ? { before: minDate } : undefined}
            defaultMonth={selectedDate ?? minDate}
            initialFocus
            className={cn("pointer-events-auto p-4 [--cell-size:2.5rem]")}
            classNames={{
              caption_label: "text-sm font-semibold text-[color:var(--color-text-brand)]",
              weekday: "text-[0.75rem] font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)] flex-1 select-none",
              day: "group/day relative aspect-square h-full w-full select-none p-0 text-center text-[color:var(--color-text-primary)]",
              today: "rounded-md ring-1 ring-inset ring-[color:var(--color-brand-secondary)] text-[color:var(--color-text-brand)] font-semibold",
              outside: "text-[color:var(--color-text-placeholder)]",
              disabled: "text-[color:var(--color-text-placeholder)] opacity-50",
            }}
          />
        </PopoverContent>

      </Popover>
      {invalid && (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-xs font-semibold text-[color:var(--color-status-error)]">
          <AlertTriangle className="mt-[1px] size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
      <p id={helperId} className="text-xs text-[color:var(--color-text-secondary)]">{helper}</p>
    </div>
  );
}





function QuickLink({
  icon,
  title,
  sub,
  subAccent,
  last,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  subAccent?: boolean;
  last?: boolean;
  to: RoutePath;
}) {
  return (
    <Link
      to={to}
      className={`group relative flex h-[88px] items-center justify-start gap-4 ${last ? "" : "lg:border-e"} border-[color:var(--color-border-medium)] px-6 transition-colors hover:bg-[color:var(--color-background-surface)] focus-visible:bg-[color:var(--color-background-surface)]`}
    >
      <span className="icon-pop grid size-6 shrink-0 place-items-center text-[color:var(--color-text-brand)]">{icon}</span>
      <div className="flex min-w-0 flex-col text-start">
        <p className="text-[15px] font-bold leading-[22px] text-[color:var(--color-text-brand)] transition-colors group-hover:text-[color:var(--color-interactive-primary-hover)]">{title}</p>
        <p className={`text-[13px] leading-[18px] ${subAccent ? "font-semibold text-[color:var(--color-text-price-accent)]" : "text-[color:var(--color-text-secondary)]"}`}>{sub}</p>
      </div>
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-6 bottom-2 h-[2px] origin-[left] scale-x-0 bg-[color:var(--color-interactive-cta)] transition-transform duration-300 group-hover:scale-x-100 rtl:origin-[right]" />
    </Link>
  );
}


function Tag({ children, variant }: { children: React.ReactNode; variant?: "success" | "navy" }) {
  const cls =
    variant === "success"
      ? "bg-[color:var(--color-status-success-bg)] text-[color:var(--color-status-success-text)]"
      : variant === "navy"
        ? "bg-[color:var(--color-background-nav-bar)] text-white"
        : "bg-[color:var(--color-background-surface)] text-[color:var(--color-text-secondary)]";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
}

function Section({ children, bg }: { children: React.ReactNode; bg: "base" | "surface" }) {
  return (
    <section className={`w-full ${bg === "surface" ? "bg-[color:var(--color-background-surface)]" : "bg-[color:var(--color-background-base)]"}`}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-16 md:px-16 md:py-20">{children}</div>
    </section>
  );
}

function SectionHeader({ title, subtitle, cta, ctaTo }: { title: string; subtitle: string; cta: string; ctaTo: RoutePath }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="h-8 w-[3px] bg-[color:var(--color-brand-secondary)]" />
          <h2 className="text-[32px] font-semibold leading-[40px] text-[color:var(--color-text-brand)]">{title}</h2>
        </div>
        <p className="text-base text-[color:var(--color-text-secondary)]">{subtitle}</p>
      </div>
      <Link to={ctaTo} className="link-underline text-[15px] font-semibold text-[color:var(--color-text-price-accent)]">{cta}</Link>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: RoutePath }[] }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-bold">{title}</p>
      {items.map((i) => (
        <Link key={i.label} to={i.to} className="text-sm text-[color:var(--color-text-nav-inactive)] hover:text-white">
          {i.label}
        </Link>
      ))}
    </div>
  );
}
