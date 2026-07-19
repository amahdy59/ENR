import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "@/i18n/LocaleLink";

const STORAGE_KEY = "enr.cookie-consent";

type Choice = "accepted" | "declined";

export function CookieConsent() {
  const { t } = useTranslation("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== "accepted" && saved !== "declined") setVisible(true);
    } catch {
      // storage blocked (e.g. private mode) — don't nag the user
    }
  }, []);

  const persist = (v: Choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch { /* ignore */ }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10 lg:px-20">
        <div className="min-w-0">
          <p id="cookie-consent-title" className="text-sm font-bold text-[color:var(--color-text-brand)]">
            {t("cookies.title", { defaultValue: "This site uses cookies" })}
          </p>
          <p id="cookie-consent-desc" className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            {t("cookies.body", {
              defaultValue:
                "We use essential cookies to keep the site running and, with your permission, analytics to improve it. ",
            })}
            <LocaleLink to="/legal/cookies" className="link-underline font-semibold text-[color:var(--color-text-brand)]">
              {t("cookies.learnMore", { defaultValue: "Learn more" })}
            </LocaleLink>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => persist("declined")}
            className="press-scale rounded-md border border-[color:var(--color-border-default)] bg-[color:var(--color-background-surface)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text-brand)] hover:bg-[color:var(--color-background-elevated)]"
          >
            {t("cookies.decline", { defaultValue: "Decline" })}
          </button>
          <button
            type="button"
            onClick={() => persist("accepted")}
            className="press-scale rounded-md bg-[color:var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            {t("cookies.accept", { defaultValue: "Accept" })}
          </button>
        </div>
      </div>
    </div>
  );
}
