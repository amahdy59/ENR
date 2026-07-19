import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileTabBar } from "@/components/site/MobileTabBar";
import { BackToTop } from "@/components/site/BackToTop";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useBi } from "@/i18n/bi";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickLinksGroup } from "@/components/home/QuickLinksGroup";
import { PopularRoutes } from "@/components/home/PopularRoutes";
import { NewsSection } from "@/components/home/NewsSection";
import { TravelGuide } from "@/components/home/TravelGuide";
import { AlertTriangle, X } from "lucide-react";
import heroImg from "@/assets/enr-hero.jpg";

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
        { rel: "preload", as: "image", href: heroImg, fetchPriority: "high" },
      ],
    };
  },
  component: Index,
});

function Index() {
  const { t } = useTranslation(["home", "common"]);
  const bi = useBi();
  const [alertDismissed, setAlertDismissed] = useState(false);

  return (
    <div className="min-h-dvh bg-[color:var(--color-background-base)] font-sans text-[color:var(--color-text-primary)] pb-16 md:pb-0">
      <a href="#main-content" className="skip-to-content">
        {t("common:actions.skipToContent")}
      </a>

      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {/* HERO SECTION */}
        <HeroSection />

        {/* QUICK LINKS */}
        <QuickLinksGroup />

        {/* ALERT BANNER */}
        {!alertDismissed && (
          <div className="w-full border-s-4 border-[color:var(--color-border-accent)] bg-[color:var(--color-background-warm)]">
            <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-3 md:px-16">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 text-[color:var(--color-status-warning)]" />
                <p className="text-sm">
                  <span className="font-bold">{t("home:alert.line")}</span> {t("home:alert.body")}
                  <span className="ms-1 text-xs text-[color:var(--color-text-placeholder)]">
                    {t("home:alert.updated")}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <LocaleLink to="/timetable" className="link-underline text-sm font-semibold">
                  {t("home:alert.seeAlternatives")} →
                </LocaleLink>
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
        <PopularRoutes />

        {/* LIVE DEPARTURES */}
        <div className="w-full bg-[color:var(--color-background-nav-bar)] text-white">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-16">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="size-2 animate-pulse rounded-full bg-[#12b76a] shadow-[0_0_0_4px_rgba(18,183,106,0.2)]" />
                <span className="text-[13px] font-bold tracking-wide">
                  {bi("LIVE DEPARTURES", "المغادرات المباشرة")}
                </span>
              </div>
              <p className="text-sm">
                <span>
                  {bi(
                    "Train 8502 Cairo → Alexandria 09:45",
                    "قطار 8502 القاهرة ← الإسكندرية 09:45",
                  )}
                </span>{" "}
                <span className="text-[#12b76a]">● {bi("On time", "في الموعد")}</span>
              </p>
              <p className="text-sm">
                <span>
                  {bi("Train 8640 Cairo → Luxor 10:00", "قطار 8640 القاهرة ← الأقصر 10:00")}
                </span>{" "}
                <span className="text-[color:var(--color-text-on-dark-accent)]">
                  ⚠ {bi("Delayed 15m", "متأخر 15 دقيقة")}
                </span>
              </p>
              <p className="text-sm hidden md:inline">
                <span>
                  {bi(
                    "Train 9012 Alexandria → Cairo 10:15",
                    "قطار 9012 الإسكندرية ← القاهرة 10:15",
                  )}
                </span>{" "}
                <span className="text-[#12b76a]">● {bi("On time", "في الموعد")}</span>
              </p>
            </div>
            <LocaleLink to="/timetable/live" className="link-underline text-sm font-semibold">
              {bi("View all departures →", "عرض كل المغادرات →")}
            </LocaleLink>
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
                <p className="text-[40px] font-bold leading-[48px] text-[color:var(--color-text-brand)]">
                  {n}
                </p>
                <p className="text-sm text-[color:var(--color-text-secondary)]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NEWS & UPDATES */}
        <NewsSection />

        {/* PLAN AHEAD */}
        <TravelGuide />
      </main>

      <SiteFooter />
      <MobileTabBar />
      <BackToTop />
    </div>
  );
}
