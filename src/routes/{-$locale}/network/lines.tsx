import { createFileRoute } from "@tanstack/react-router";
import { StubPage, Card, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/network/lines")({
  head: stubHead(
    "Lines",
    "Overview of ENR's major rail lines and corridors across Egypt.",
    "/network/lines",
    "الخطوط",
    "نظرة عامة على خطوط سكك حديد مصر الرئيسية والممرات عبر البلاد.",
  ),
  component: LinesPage,
});

function LinesPage() {
  const bi = useBi();
  const lines = [
    {
      name: bi("Cairo – Alexandria", "القاهرة – الإسكندرية"),
      meta: bi("Main line · Delta", "الخط الرئيسي · الدلتا"),
      desc: bi("The country's busiest corridor with frequent express services.", "أكثر ممرات القطارات ازدحاماً في البلاد مع خدمات سريعة متتالية."),
    },
    {
      name: bi("Cairo – Aswan (Nile Valley)", "القاهرة – أسوان (وادي النيل)"),
      meta: bi("Long-distance · South", "المسافات الطويلة · الجنوب"),
      desc: bi("Overnight sleeper and daytime services along the Nile.", "قطارات نوم ليلية وخدمات نهارية على طول نهر النيل."),
    },
    {
      name: bi("Cairo – Port Said (Suez)", "القاهرة – بورسعيد (السويس)"),
      meta: bi("Delta · East", "الدلتا · الشرق"),
      desc: bi("Delta services connecting to the Suez Canal region.", "خدمات الدلتا الواصلة إلى منطقة قناة السويس."),
    },
    {
      name: bi("Alexandria – Marsa Matrouh", "الإسكندرية – مرسى مطروح"),
      meta: bi("Coastal · Seasonal", "الساحل · موسمي"),
      desc: bi("Summer services along the Mediterranean coast.", "خدمات صيفية على طول ساحل البحر المتوسط."),
    },
  ];
  return (
    <StubPage
      eyebrow={bi("Network", "الشبكة")}
      title={bi("Lines", "الخطوط")}
      subtitle={bi("Major corridors and services across the ENR network.", "الممرات والخدمات الرئيسية على شبكة الهيئة القومية لسكك حديد مصر.")}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {lines.map((l) => (
          <Card key={l.name} meta={l.meta} title={l.name} body={l.desc} />
        ))}
      </div>
    </StubPage>
  );
}
