import { useBi } from "@/i18n/bi";
import { LocaleLink } from "@/i18n/LocaleLink";
import { Briefcase, Accessibility, Calendar, Users } from "lucide-react";

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

export function TravelGuide() {
  const bi = useBi();

  const planCards = [
    {
      icon: Briefcase,
      title: bi("Baggage Allowance", "السماح بالأمتعة"),
      body: bi(
        "1 large bag free per passenger · Bicycles by reservation.",
        "حقيبة كبيرة مجانًا لكل راكب · الدراجات بحجز مسبق.",
      ),
      cta: bi("View baggage rules →", "عرض قواعد الأمتعة →"),
      to: "/travel-info/luggage",
    },
    {
      icon: Accessibility,
      title: bi("Accessibility & Assistance", "إتاحة الوصول والمساعدة"),
      body: bi(
        "Pre-book wheelchair assistance, priority seating, audio guides.",
        "احجز مسبقًا خدمات الكراسي المتحركة، والمقاعد ذات الأولوية، والأدلة الصوتية.",
      ),
      cta: bi("Book assistance →", "احجز المساعدة →"),
      to: "/accessibility",
    },
    {
      icon: Calendar,
      title: bi("Timetables & Maps", "الجداول والخرائط"),
      body: bi(
        "Download the full October 2025 timetable as PDF.",
        "قم بتحميل جدول أكتوبر 2025 الكامل بصيغة PDF.",
      ),
      cta: bi("Download →", "تحميل →"),
      to: "/timetable",
    },
    {
      icon: Users,
      title: bi("Group Bookings", "حجوزات المجموعات"),
      body: bi(
        "Groups of 10+ receive 15% discount. Free group coordinator support.",
        "خصم 15% للمجموعات من 10 أشخاص فأكثر مع دعم منسق مجموعة مجاني.",
      ),
      cta: bi("Get group rates →", "احصل على أسعار المجموعات →"),
      to: "/help",
    },
  ];

  return (
    <Section bg="base">
      <SectionHeader
        title={bi("Plan Ahead", "خطط مسبقًا")}
        subtitle={bi("Everything you need for a smooth journey", "كل ما تحتاجه لرحلة سلسة")}
        cta={bi("View all guides →", "عرض كل الأدلة →")}
        ctaTo="/help"
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {planCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="group flex flex-col gap-4 rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition hover:border-[color:var(--color-border-accent)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
            >
              <div className="flex size-14 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary-tint)] transition-colors group-hover:bg-[color:var(--color-background-warm)]">
                <Icon className="icon-pop size-7 text-[color:var(--color-text-brand)]" />
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--color-text-brand)]">
                {c.title}
              </h3>
              <p className="text-sm leading-5 text-[color:var(--color-text-secondary)]">{c.body}</p>
              <LocaleLink
                to={c.to}
                className="link-underline w-fit text-[13px] font-semibold text-[color:var(--color-text-price-accent)]"
              >
                {c.cta}
              </LocaleLink>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
