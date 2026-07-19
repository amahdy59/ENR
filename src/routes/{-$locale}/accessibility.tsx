import { createFileRoute } from "@tanstack/react-router";
import { StubPage, Card, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/accessibility")({
  head: stubHead(
    "Accessibility",
    "Accessible travel across ENR — step-free access, wheelchair support, priority seating.",
    "/accessibility",
    "إمكانية الوصول",
    "السفر الميسّر مع الهيئة القومية لسكك حديد مصر — مداخل بلا درج، ودعم للكراسي المتحركة، ومقاعد الأولوية.",
  ),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  const bi = useBi();
  const items = [
    {
      title: bi("Step-free access", "مداخل بدون درج"),
      body: bi(
        "Ramps and lifts at 15+ major stations including Cairo, Alexandria and Luxor.",
        "منحدرات ومصاعد في أكثر من 15 محطة رئيسية تشمل القاهرة والإسكندرية والأقصر.",
      ),
    },
    {
      title: bi("Wheelchair assistance", "مساعدة الكراسي المتحركة"),
      body: bi(
        "Free assistance available — pre-book at least 4 hours before travel.",
        "خدمة مجانية — يُرجى الحجز قبل السفر بأربع ساعات على الأقل.",
      ),
    },
    {
      title: bi("Audio & visual announcements", "إعلانات صوتية ومرئية"),
      body: bi(
        "Every station and train carries dual-language audio and visual info displays.",
        "كل محطة وقطار مزوّد بشاشات معلومات وإعلانات صوتية باللغتين.",
      ),
    },
    {
      title: bi("Priority seating", "مقاعد الأولوية"),
      body: bi(
        "Reserved seats for elderly, pregnant and disabled passengers on every train.",
        "مقاعد مخصصة لكبار السن والحوامل وذوي الهمم في جميع القطارات.",
      ),
    },
  ];
  return (
    <StubPage
      eyebrow={bi("Travel", "السفر")}
      title={bi("Accessibility", "إمكانية الوصول")}
      subtitle={bi("Travelling with ENR — support for every passenger.", "السفر مع الهيئة القومية لسكك حديد مصر — دعم لكل راكب.")}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((i) => <Card key={i.title} {...i} />)}
      </div>
    </StubPage>
  );
}
