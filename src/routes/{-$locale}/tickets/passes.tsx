import { createFileRoute } from "@tanstack/react-router";
import { StubPage, Card, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/tickets/passes")({
  head: stubHead(
    "Season passes",
    "Monthly, quarterly and annual ENR season passes.",
    "/tickets/passes",
    "الاشتراكات الموسمية",
    "اشتراكات موسمية شهرية وربع سنوية وسنوية من الهيئة القومية لسكك حديد مصر.",
  ),
  component: PassesPage,
});

function PassesPage() {
  const bi = useBi();
  const passes = [
    {
      title: bi("Monthly Commuter Pass", "اشتراك شهري للمواصلات اليومية"),
      meta: bi("Unlimited within 1 region", "غير محدود داخل منطقة واحدة"),
      body: bi(
        "From 450 EGP · Save up to 60% on daily commuting.",
        "بدءاً من 450 ج.م · وفّر حتى 60٪ على تنقلاتك اليومية.",
      ),
    },
    {
      title: bi("3-Month Season Pass", "اشتراك موسمي لثلاثة أشهر"),
      meta: bi("Best value", "الأفضل من حيث القيمة"),
      body: bi(
        "From 1,200 EGP · Priority seating and free date changes.",
        "بدءاً من 1200 ج.م · أولوية في المقاعد وتغيير مجاني للتاريخ.",
      ),
    },
    {
      title: bi("Annual Nationwide Pass", "اشتراك سنوي شامل على مستوى الجمهورية"),
      meta: bi("All lines", "جميع الخطوط"),
      body: bi(
        "From 4,800 EGP · Unlimited travel across the ENR network.",
        "بدءاً من 4800 ج.م · سفر غير محدود عبر شبكة الهيئة.",
      ),
    },
  ];
  return (
    <StubPage
      eyebrow={bi("Tickets", "التذاكر")}
      title={bi("Season passes", "الاشتراكات الموسمية")}
      subtitle={bi(
        "Save on frequent travel with commuter and season passes.",
        "وفّر في السفر المتكرر عبر اشتراكات التنقل اليومي والاشتراكات الموسمية.",
      )}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {passes.map((p) => (
          <Card key={p.title} {...p} />
        ))}
      </div>
    </StubPage>
  );
}
