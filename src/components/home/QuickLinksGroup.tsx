import { useBi } from "@/i18n/bi";
import { Link } from "@tanstack/react-router";
import { Bell, MapPin, Clock, Accessibility } from "lucide-react";

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
  to: string;
}) {
  return (
    <Link
      to={to}
      className={`group relative flex h-[88px] items-center justify-start gap-4 ${last ? "" : "lg:border-e"} border-[color:var(--color-border-medium)] px-6 transition-colors hover:bg-[color:var(--color-background-surface)] focus-visible:bg-[color:var(--color-background-surface)]`}
    >
      <span className="icon-pop grid size-6 shrink-0 place-items-center text-[color:var(--color-text-brand)]">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col text-start">
        <p className="text-[15px] font-bold leading-[22px] text-[color:var(--color-text-brand)] transition-colors group-hover:text-[color:var(--color-interactive-primary-hover)]">
          {title}
        </p>
        <p
          className={`text-[13px] leading-[18px] ${subAccent ? "font-semibold text-[color:var(--color-text-price-accent)]" : "text-[color:var(--color-text-secondary)]"}`}
        >
          {sub}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 bottom-2 h-[2px] origin-[left] scale-x-0 bg-[color:var(--color-interactive-cta)] transition-transform duration-300 group-hover:scale-x-100 rtl:origin-[right]"
      />
    </Link>
  );
}

export function QuickLinksGroup() {
  const bi = useBi();

  const quickLinks = [
    {
      key: "alerts",
      title: bi("Service Alerts", "تنبيهات الخدمة"),
      sub: bi("2 active", "تنبيهان نشطان"),
      to: "/timetable",
    },
    {
      key: "stations",
      title: bi("Station Finder", "البحث عن محطة"),
      sub: bi("350+ stations", "أكثر من 350 محطة"),
      to: "/stations",
    },
    {
      key: "timetables",
      title: bi("Timetables", "مواعيد القطارات"),
      sub: bi("Live & downloadable", "مباشرة وقابلة للتحميل"),
      to: "/timetable/live",
    },
    {
      key: "assistance",
      title: bi("Travel Assistance", "مساعدة المسافرين"),
      sub: bi("Pre-book support", "حجز مسبق للدعم"),
      to: "/accessibility",
    },
  ];

  return (
    <div className="border-y border-[color:var(--color-border-medium)] bg-[color:var(--color-background-elevated)]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((q, i) => (
          <QuickLink
            key={q.key}
            to={q.to}
            icon={
              q.key === "alerts" ? (
                <Bell className="size-6 text-[color:var(--color-text-brand)]" />
              ) : q.key === "stations" ? (
                <MapPin className="size-6 text-[color:var(--color-text-brand)]" />
              ) : q.key === "timetables" ? (
                <Clock className="size-6 text-[color:var(--color-text-brand)]" />
              ) : (
                <Accessibility className="size-6 text-[color:var(--color-text-brand)]" />
              )
            }
            title={q.title}
            sub={q.sub}
            subAccent={i === 0}
            last={i === quickLinks.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
