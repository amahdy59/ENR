import { createFileRoute } from "@tanstack/react-router";
import { StubPage, Card, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/timetable/alerts")({
  head: stubHead(
    "Service alerts",
    "Live service disruptions and planned engineering works.",
    "/timetable/alerts",
    "تنبيهات الخدمة",
    "الأعطال الحيّة في الخدمة والأعمال الهندسية المخطط لها.",
  ),
  component: AlertsPage,
});

function AlertsPage() {
  const bi = useBi();
  const alerts = [
    {
      title: bi("Engineering works: Cairo – Alexandria", "أعمال هندسية: القاهرة – الإسكندرية"),
      meta: bi("Sun 20 Oct", "الأحد 20 أكتوبر"),
      body: bi(
        "Reduced service between 22:00–05:00 for track maintenance.",
        "خدمة مخفّضة بين الساعة 22:00 والساعة 05:00 لأعمال صيانة القضبان.",
      ),
    },
    {
      title: bi("Delay on Luxor line", "تأخير على خط الأقصر"),
      meta: bi("Active now", "نشط الآن"),
      body: bi(
        "Southbound services delayed ~15 minutes due to signalling issue.",
        "تأخير الخدمات المتجهة جنوباً بنحو 15 دقيقة بسبب عطل في نظام الإشارات.",
      ),
    },
  ];
  return (
    <StubPage
      eyebrow={bi("Alerts", "التنبيهات")}
      title={bi("Service alerts", "تنبيهات الخدمة")}
      subtitle={bi("Disruptions, delays and planned engineering works.", "الأعطال والتأخيرات والأعمال الهندسية المخطط لها.")}
    >
      <div className="grid grid-cols-1 gap-4">
        {alerts.map((a) => (
          <Card key={a.title} meta={a.meta} title={a.title} body={a.body} />
        ))}
      </div>
    </StubPage>
  );
}
