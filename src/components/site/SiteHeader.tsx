import { Menu, User } from "lucide-react";
import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSession } from "@/hooks/use-session";
import { LocaleLink, localizedPath } from "@/i18n/LocaleLink";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/config";

function isNavActive(
  pathname: string,
  to: string,
  match: string | undefined,
  exact: boolean | undefined,
  locale: Locale,
): boolean {
  const target = localizedPath(match ?? to, locale);
  if (exact) return pathname === target || pathname === target + "/";
  return pathname === target || pathname.startsWith(target + "/");
}

export function SiteHeader() {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(["nav", "common"]);
  const { locale, otherLocale } = useLocale();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const navLinks = [
    { label: t("nav:primary.plan"), to: "/", exact: true },
    { label: t("nav:primary.tickets"), to: "/tickets/fares", match: "/tickets" },
    { label: t("nav:primary.stations"), to: "/stations", match: "/stations" },
    { label: t("nav:primary.timetable"), to: "/timetable", match: "/timetable" },
    { label: t("nav:primary.travelInfo"), to: "/travel-info/luggage", match: "/travel-info" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[color:var(--color-background-nav-bar)] shadow-sm">
      <nav
        className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-20"
        aria-label={t("common:brand") as string}
      >
        <LocaleLink to="/" className="link-underline text-2xl font-semibold text-white">
          {t("common:brand")}
        </LocaleLink>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => {
            const isActive = isNavActive(pathname, l.to, l.match, l.exact, locale);
            return (
              <li key={l.label}>
                <LocaleLink
                  to={l.to}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    "link-underline text-[15px] font-semibold transition-colors " +
                    (isActive
                      ? "text-white after:!scale-x-100 after:!bg-[color:var(--color-brand-secondary)]"
                      : "text-white/70 hover:text-white")
                  }
                >
                  {l.label}
                </LocaleLink>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          {/* Real language toggle: swaps locale in URL prefix, preserves the rest of the path */}
          <LocaleLink
            to={typeof window !== "undefined" ? stripLocaleFromPath(window.location.pathname) : "/"}
            targetLocale={otherLocale}
            hrefLang={otherLocale}
            lang={otherLocale}
            aria-label={t("common:language.switchTo")}
            className="press-scale hidden rounded-md px-2 py-1 text-sm font-semibold text-white/70 ring-1 ring-white/20 transition hover:bg-white/10 hover:text-white hover:ring-[color:var(--color-brand-secondary)] md:inline-flex"
          >
            {otherLocale === "ar" ? "العربية" : "English"}
          </LocaleLink>
          {user ? (
            <LocaleLink
              to="/account"
              aria-label={t("common:actions.account")}
              className="press-scale group grid size-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition hover:bg-white/20 hover:ring-[color:var(--color-brand-secondary)]"
            >
              <User className="icon-pop size-5 text-white" />
            </LocaleLink>
          ) : (
            <LocaleLink
              to="/auth"
              className="press-scale hidden rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20 hover:ring-[color:var(--color-brand-secondary)] md:inline-flex"
            >
              {t("common:actions.signIn")}
            </LocaleLink>
          )}
          <button
            aria-label={t("common:actions.menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="press-scale grid size-10 place-items-center rounded-md text-white hover:bg-white/10 lg:hidden"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="reveal-up border-t border-white/10 bg-[color:var(--color-background-nav-bar)] lg:hidden">
          <ul className="mx-auto flex max-w-[1440px] flex-col gap-1 px-6 py-4">
            {navLinks.map((l) => (
              <li key={l.label}>
                <LocaleLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="press-scale block rounded-md px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </LocaleLink>
              </li>
            ))}
            <li>
              <LocaleLink
                to={
                  typeof window !== "undefined"
                    ? stripLocaleFromPath(window.location.pathname)
                    : "/"
                }
                targetLocale={otherLocale}
                hrefLang={otherLocale}
                lang={otherLocale}
                onClick={() => setOpen(false)}
                aria-label={t("common:language.switchTo")}
                className="press-scale block rounded-md px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
              >
                {otherLocale === "ar" ? "العربية" : "English"}
              </LocaleLink>
            </li>
            {!user && (
              <li>
                <LocaleLink
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="press-scale block rounded-md px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {t("common:actions.signIn")}
                </LocaleLink>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

/** Strip a leading /ar or /en so the language toggle can point at the same page in the other locale. */
function stripLocaleFromPath(pathname: string): string {
  const m = pathname.match(/^\/(ar|en)(\/.*)?$/);
  if (!m) return pathname || "/";
  return m[2] || "/";
}
