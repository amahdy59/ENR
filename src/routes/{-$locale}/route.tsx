import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n, {
  DEFAULT_LOCALE,
  RTL_LOCALES,
  SUPPORTED_LOCALES,
  directionForLocale,
  isLocale,
  type Locale,
} from "@/i18n/config";
import { LocaleContext } from "@/i18n/locale-context";

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    const raw = params.locale;
    // Undefined means default (English). A defined value must be a supported locale.
    if (raw !== undefined && !isLocale(raw)) {
      throw notFound();
    }
  },
  head: ({ params }) => {
    const locale: Locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
    return {
      meta: [{ name: "language", content: locale }],
      links: [
        // hreflang alternates. Uses relative paths — resolved by crawlers.
        { rel: "alternate", hrefLang: "en", href: "/" },
        { rel: "alternate", hrefLang: "ar", href: "/ar" },
        { rel: "alternate", hrefLang: "x-default", href: "/" },
      ],
    };
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale: rawLocale } = Route.useParams();
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dir = directionForLocale(locale);
  const otherLocale: Locale = locale === "en" ? "ar" : "en";

  useTranslation();
  useEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
  }, [locale]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const value = useMemo(() => ({ locale, dir, otherLocale }), [locale, dir, otherLocale]);

  return (
    <LocaleContext.Provider value={value}>
      <Outlet />
    </LocaleContext.Provider>
  );
}

// Make SUPPORTED_LOCALES / RTL_LOCALES accessible for type-only imports if needed
export type { Locale };
export { SUPPORTED_LOCALES, RTL_LOCALES };
