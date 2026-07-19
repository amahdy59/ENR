import { createFileRoute } from "@tanstack/react-router";
import { StubPage, Card, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/news")({
  head: stubHead(
    "News",
    "Latest updates and announcements from Egyptian National Railways.",
    "/news",
    "الأخبار",
    "أحدث التحديثات والإعلانات من الهيئة القومية لسكك حديد مصر.",
  ),
  component: NewsPage,
});

function NewsPage() {
  const bi = useBi();
  const news = [
    {
      title: bi("New high-speed service on Cairo–Alexandria", "خدمة عالية السرعة جديدة على خط القاهرة – الإسكندرية"),
      meta: bi("12 Oct 2025", "12 أكتوبر 2025"),
      body: bi("Modern high-speed infrastructure comes online.", "دخول بنية تحتية حديثة عالية السرعة إلى الخدمة."),
    },
    {
      title: bi("Station accessibility upgrades complete", "اكتمال تطويرات إمكانية الوصول في المحطات"),
      meta: bi("8 Oct 2025", "8 أكتوبر 2025"),
      body: bi(
        "15 major stations upgraded with ramps, audio and tactile paths.",
        "تطوير 15 محطة رئيسية بمنحدرات، وإعلانات صوتية، ومسارات تُدرَك باللمس.",
      ),
    },
    {
      title: bi("ENR launches e-ticketing app", "الهيئة تطلق تطبيق التذاكر الإلكترونية"),
      meta: bi("1 Oct 2025", "1 أكتوبر 2025"),
      body: bi(
        "Book, pay and board with your phone — no printer needed.",
        "احجز وادفع واصعد إلى القطار عبر هاتفك — بدون الحاجة إلى طابعة.",
      ),
    },
  ];
  return (
    <StubPage
      eyebrow={bi("Press", "الأخبار")}
      title={bi("News", "الأخبار")}
      subtitle={bi("Latest updates from Egyptian National Railways.", "آخر التحديثات من الهيئة القومية لسكك حديد مصر.")}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {news.map((n) => <Card key={n.title} {...n} />)}
      </div>
    </StubPage>
  );
}
