import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/travel-info/safety")({
  head: stubHead(
    "Safety on board",
    "Passenger safety guidelines for ENR services.",
    "/travel-info/safety",
    "السلامة على متن القطار",
    "إرشادات سلامة الركاب في خدمات الهيئة القومية لسكك حديد مصر.",
  ),
  component: SafetyPage,
});

function SafetyPage() {
  const bi = useBi();
  return (
    <StubPage
      eyebrow={bi("Travel info", "معلومات السفر")}
      title={bi("Safety on board", "السلامة على متن القطار")}
      subtitle={bi("Keeping every passenger safe.", "الحفاظ على سلامة كل راكب.")}
    >
      <p className="text-sm text-[color:var(--color-text-secondary)]">
        {bi(
          "Follow crew instructions, keep aisles clear, and report unattended items to staff. In emergencies, use marked exits and follow platform announcements.",
          "اتبع تعليمات طاقم القطار، وحافظ على الممرات خالية، وأبلغ عن أي أغراض متروكة إلى الطاقم. في حالات الطوارئ، استخدم المخارج المحدَّدة واتّبع تعليمات الرصيف.",
        )}
      </p>
    </StubPage>
  );
}
