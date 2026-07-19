import { useBi } from "@/i18n/bi";
import { LocaleLink } from "@/i18n/LocaleLink";
import routeAlex from "@/assets/route-alexandria.jpg";
import routeLuxor from "@/assets/route-luxor.jpg";
import routeAswan from "@/assets/route-aswan.jpg";
import routeMatrouh from "@/assets/route-matrouh.jpg";

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
    <section
      className={`w-full ${bg === "surface" ? "bg-[color:var(--color-background-surface)]" : "bg-[color:var(--color-background-base)]"}`}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-16 md:px-16 md:py-20">
        {children}
      </div>
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
  cta,
  ctaTo,
}: {
  title: string;
  subtitle: string;
  cta: string;
  ctaTo: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="h-8 w-[3px] bg-[color:var(--color-brand-secondary)]" />
          <h2 className="text-[32px] font-semibold leading-[40px] text-[color:var(--color-text-brand)]">
            {title}
          </h2>
        </div>
        <p className="text-base text-[color:var(--color-text-secondary)]">{subtitle}</p>
      </div>
      <LocaleLink
        to={ctaTo}
        className="link-underline text-[15px] font-semibold text-[color:var(--color-text-price-accent)]"
      >
        {cta}
      </LocaleLink>
    </div>
  );
}

export function PopularRoutes() {
  const bi = useBi();

  const routes = [
    {
      from: bi("Cairo", "القاهرة"),
      to: bi("Alexandria", "الإسكندرية"),
      meta: bi("2h 45m · Trains every 30 min", "2س 45د · قطارات كل 30 دقيقة"),
      price: bi("From 75 EGP", "تبدأ من 75 ج.م"),
      img: routeAlex,
      tags: [{ label: bi("WiFi", "واي فاي") }, { label: bi("AC", "تكييف") }],
    },
    {
      from: bi("Cairo", "القاهرة"),
      to: bi("Luxor", "الأقصر"),
      meta: bi("9h 30m · 3 services daily", "9س 30د · 3 رحلات يوميًا"),
      price: bi("From 180 EGP", "تبدأ من 180 ج.م"),
      img: routeLuxor,
      tags: [{ label: bi("Sleeper available", "عربة نوم متاحة"), variant: "success" as const }],
    },
    {
      from: bi("Cairo", "القاهرة"),
      to: bi("Aswan", "أسوان"),
      meta: bi("12h · Overnight service", "12س · رحلة ليلية"),
      price: bi("From 210 EGP", "تبدأ من 210 ج.م"),
      img: routeAswan,
      tags: [{ label: bi("Sleeper cabin", "كابينة نوم"), variant: "navy" as const }],
    },
    {
      from: bi("Alexandria", "الإسكندرية"),
      to: bi("Marsa Matrouh", "مرسى مطروح"),
      meta: bi("3h 20m · Summer seasonal", "3س 20د · موسمي صيفي"),
      price: bi("From 95 EGP", "تبدأ من 95 ج.م"),
      img: routeMatrouh,
      tags: [{ label: bi("Scenic coastal route", "مسار ساحلي خلاب") }],
    },
  ];

  return (
    <Section bg="surface">
      <SectionHeader
        title={bi("Popular Routes", "أبرز الوجهات")}
        subtitle={bi("Discover Egypt by rail", "اكتشف مصر عبر السكك الحديدية")}
        cta={bi("View all routes →", "عرض كافة الوجهات →")}
        ctaTo="/stations"
      />
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

              <div className="route-card__rail pointer-events-none absolute inset-x-4 bottom-3 h-[2px] rounded-full bg-white/25">
                <span className="route-card__train absolute top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-[color:var(--color-brand-secondary)] shadow-[0_0_0_3px_rgba(200,144,42,0.25)]" />
              </div>

              <p className="absolute bottom-6 start-4 text-base font-bold text-white drop-shadow">
                {r.from} → {r.to}
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
              <p className="text-base font-semibold text-[color:var(--color-text-brand)]">
                {r.from} → {r.to}
              </p>
              <p className="text-[13px] leading-[18px]">{r.meta}</p>
              <p className="text-sm font-bold text-[color:var(--color-text-price-accent)]">
                {r.price}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {r.tags.map((t) => (
                  <Tag key={t.label} variant={"variant" in t ? t.variant : undefined}>
                    {t.label}
                  </Tag>
                ))}
              </div>
              <LocaleLink
                to="/search"
                aria-label={bi(
                  `View trains for ${r.from} to ${r.to}`,
                  `عرض قطارات ${r.from} إلى ${r.to}`,
                )}
                className="mt-auto inline-flex w-fit items-center gap-1 rounded-sm text-[13px] font-semibold text-[color:var(--color-text-price-accent)] outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--color-border-accent)]"
              >
                <span className="link-underline">{bi("View trains", "عرض القطارات")}</span>
                <span aria-hidden="true" className="route-card__arrow inline-block">
                  →
                </span>
              </LocaleLink>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
