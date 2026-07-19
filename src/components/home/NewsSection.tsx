import { useBi } from "@/i18n/bi";
import { LocaleLink } from "@/i18n/LocaleLink";
import newsHighspeed from "@/assets/news-highspeed.jpg";
import newsAccessibility from "@/assets/news-accessibility.jpg";
import newsMobile from "@/assets/news-mobile.jpg";

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

export function NewsSection() {
  const bi = useBi();

  const news = [
    {
      tag: bi("New Service", "خدمة جديدة"),
      date: bi("12 Oct 2025", "12 أكتوبر 2025"),
      title: bi(
        "New high-speed service launched on Cairo–Alexandria corridor",
        "إطلاق خدمة قطار سريع جديد على خط القاهرة – الإسكندرية",
      ),
      body: bi(
        "Egypt's rail network takes a massive leap forward with the integration of modern high-speed infrastructure.",
        "شبكة السكك الحديدية المصرية تخطو خطوة كبيرة إلى الأمام بدمج بنية تحتية حديثة للقطارات السريعة.",
      ),
      img: newsHighspeed,
    },
    {
      tag: bi("Accessibility", "إتاحة الوصول"),
      date: bi("8 Oct 2025", "8 أكتوبر 2025"),
      title: bi(
        "Station accessibility upgrades completed at 15 major stations across Egypt",
        "الانتهاء من ترقيات إتاحة الوصول في 15 محطة رئيسية عبر مصر",
      ),
      body: bi(
        "ENR has completed a major upgrade programme installing step-free ramps, audio announcements and tactile paths.",
        "أكملت الهيئة برنامج ترقيات شاملًا يتضمن منحدرات، وإعلانات صوتية، ومسارات لمسية.",
      ),
      img: newsAccessibility,
    },
    {
      tag: bi("App Update", "تحديث التطبيق"),
      date: bi("1 Oct 2025", "1 أكتوبر 2025"),
      title: bi(
        "ENR launches mobile e-ticketing — book, pay and board with your phone",
        "الهيئة تطلق التذاكر الإلكترونية عبر الهاتف — احجز وادفع واستقل بهاتفك",
      ),
      body: bi(
        "Passengers can now purchase, manage and validate tickets entirely on the ENR mobile app — no printer needed.",
        "يمكن للركاب الآن شراء التذاكر وإدارتها والتحقق منها بالكامل عبر تطبيق الهيئة على الهاتف — دون الحاجة إلى طابعة.",
      ),
      img: newsMobile,
    },
  ];

  return (
    <Section bg="base">
      <SectionHeader
        title={bi("News & Updates", "الأخبار والتحديثات")}
        subtitle={bi("Latest from ENR", "آخر مستجدات الهيئة")}
        cta={bi("View all →", "عرض الكل →")}
        ctaTo="/news"
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {news.map((n) => (
          <article
            key={n.title}
            className="interactive-surface group overflow-hidden rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)]"
          >
            <div className="relative h-[200px] overflow-hidden">
              <img
                src={n.img}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-[color:var(--color-brand-secondary)]" />
            </div>

            <div className="flex flex-col gap-3 p-6">
              <div className="flex items-start justify-between">
                <span className="rounded bg-[color:var(--color-brand-secondary)] px-2 py-0.5 text-xs font-bold text-[color:var(--color-interactive-cta-text)]">
                  {n.tag}
                </span>
                <span className="text-xs text-[color:var(--color-text-secondary)]">{n.date}</span>
              </div>
              <h3 className="text-lg font-bold leading-6 text-[color:var(--color-text-brand)]">
                {n.title}
              </h3>
              <p className="text-sm leading-5 text-[color:var(--color-text-secondary)]">{n.body}</p>
              <LocaleLink
                to="/news"
                className="link-underline w-fit text-sm font-semibold text-[color:var(--color-text-price-accent)]"
              >
                {bi("Read more →", "اقرأ المزيد →")}
              </LocaleLink>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
