import { Home, Search, Ticket, User, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "@/i18n/LocaleLink";

export function MobileTabBar() {
  const { t } = useTranslation("nav");
  const tabs = [
    { label: t("mobile.home"), to: "/", icon: Home },
    { label: t("mobile.search"), to: "/search", icon: Search },
    { label: t("mobile.tickets"), to: "/account/bookings", icon: Ticket },
    { label: t("mobile.account"), to: "/account", icon: User },
    { label: t("mobile.more"), to: "/help", icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 start-0 end-0 z-40 border-t border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] md:hidden">
      <ul className="mx-auto flex max-w-[520px] items-stretch justify-around">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.label} className="flex-1">
              <LocaleLink
                to={t.to}
                className="press-scale group flex min-h-14 flex-col items-center gap-1 rounded-md py-2 text-[11px] font-medium text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-background-surface)] hover:text-[color:var(--color-text-brand)]"
                activeProps={{ className: "text-[color:var(--color-text-brand)]" }}
              >
                <Icon className="icon-pop size-5" />
                {t.label}
              </LocaleLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
