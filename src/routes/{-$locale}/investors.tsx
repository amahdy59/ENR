import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/investors")({
  head: stubHead(
    "Investors",
    "Investor and financial information for Egyptian National Railways.",
    "/investors",
    "المستثمرون",
    "معلومات المستثمرين والبيانات المالية للهيئة القومية لسكك حديد مصر.",
  ),
  component: InvestorsPage,
});

function InvestorsPage() {
  const bi = useBi();
  return (
    <StubPage
      eyebrow={bi("Company", "عن الهيئة")}
      title={bi("Investors", "المستثمرون")}
      subtitle={bi("Financial reports and stakeholder information.", "التقارير المالية ومعلومات المستثمرين.")}
    >
      <p className="text-sm text-[color:var(--color-text-secondary)]">
        {bi(
          "Annual reports, financial statements and stakeholder updates will appear here.",
          "ستُنشر هنا التقارير السنوية والقوائم المالية وتحديثات المستثمرين.",
        )}
      </p>
    </StubPage>
  );
}
