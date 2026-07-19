import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/careers")({
  head: stubHead(
    "Careers",
    "Join the team at Egyptian National Railways.",
    "/careers",
    "الوظائف",
    "انضم إلى فريق الهيئة القومية لسكك حديد مصر.",
  ),
  component: CareersPage,
});

function CareersPage() {
  const bi = useBi();
  return (
    <StubPage
      eyebrow={bi("Company", "عن الهيئة")}
      title={bi("Careers at ENR", "الوظائف في الهيئة")}
      subtitle={bi(
        "Help move Egypt forward — join our team.",
        "ساهم في تحريك مصر إلى الأمام — انضم إلى فريقنا.",
      )}
    >
      <p className="text-sm text-[color:var(--color-text-secondary)]">
        {bi(
          "Current openings will be listed here. Roles across operations, engineering, and customer service.",
          "سيتم إدراج الوظائف الشاغرة الحالية هنا، وتشمل التشغيل والهندسة وخدمة العملاء.",
        )}
      </p>
    </StubPage>
  );
}
