import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "@/i18n/LocaleLink";

export function SiteFooter() {
  const { t } = useTranslation(["nav", "common"]);

  const cols = [
    {
      title: t("nav:footer.travel.title"),
      links: [
        { label: t("nav:footer.travel.plan"), to: "/" },
        { label: t("nav:footer.travel.timetables"), to: "/timetable" },
        { label: t("nav:footer.travel.live"), to: "/timetable/live" },
        { label: t("nav:footer.travel.alerts"), to: "/timetable/alerts" },
      ],
    },
    {
      title: t("nav:footer.tickets.title"),
      links: [
        { label: t("nav:footer.tickets.fares"), to: "/tickets/fares" },
        { label: t("nav:footer.tickets.passes"), to: "/tickets/passes" },
        { label: t("nav:footer.tickets.discounts"), to: "/tickets/discounts" },
        { label: t("nav:footer.tickets.group"), to: "/help" },
      ],
    },
    {
      title: t("nav:footer.network.title"),
      links: [
        { label: t("nav:footer.network.find"), to: "/stations" },
        { label: t("nav:footer.network.map"), to: "/network/map" },
        { label: t("nav:footer.network.lines"), to: "/network/lines" },
        { label: t("nav:footer.network.accessibility"), to: "/accessibility" },
      ],
    },
    {
      title: t("nav:footer.about.title"),
      links: [
        { label: t("nav:footer.about.us"), to: "/about" },
        { label: t("nav:footer.about.news"), to: "/news" },
        { label: t("nav:footer.about.careers"), to: "/careers" },
        { label: t("nav:footer.about.contact"), to: "/contact" },
      ],
    },
  ];

  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-[color:var(--color-background-nav-bar)] text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-10 lg:px-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[color:var(--color-text-on-dark-accent)]">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <LocaleLink
                      to={l.to}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {l.label}
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/60">{t("common:footer.rights", { year })}</p>
          <div className="flex items-center gap-3 text-white/70">
            <a
              aria-label={t("common:footer.social.facebook")}
              href="https://facebook.com/EgyptianRailways"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:text-white"
            >
              <Facebook className="size-5" />
            </a>
            <a
              aria-label={t("common:footer.social.twitter")}
              href="https://twitter.com/EgyptianRailways"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:text-white"
            >
              <Twitter className="size-5" />
            </a>
            <a
              aria-label={t("common:footer.social.instagram")}
              href="https://instagram.com/EgyptianRailways"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:text-white"
            >
              <Instagram className="size-5" />
            </a>
            <a
              aria-label={t("common:footer.social.youtube")}
              href="https://youtube.com/@EgyptianRailways"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:text-white"
            >
              <Youtube className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
