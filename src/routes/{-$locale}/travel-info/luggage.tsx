import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/travel-info/luggage")({
  head: stubHead(
    "Luggage",
    "Luggage allowance and rules on ENR services.",
    "/travel-info/luggage",
    "الأمتعة",
    "المسموح به من الأمتعة والقواعد في خدمات الهيئة القومية لسكك حديد مصر.",
  ),
  component: LuggagePage,
});

function LuggagePage() {
  const bi = useBi();
  const items = [
    bi("One large bag (up to 30kg) free per passenger", "حقيبة كبيرة واحدة (حتى 30 كجم) مجاناً لكل راكب"),
    bi("One carry-on (up to 7kg)", "حقيبة يد واحدة (حتى 7 كجم)"),
    bi("Bicycles require reservation (50 EGP)", "الدراجات تتطلب حجزاً مسبقاً (50 ج.م)"),
    bi("Musical instruments allowed with prior notice", "يُسمح بالآلات الموسيقية بإخطار مسبق"),
    bi("Dangerous goods and large livestock prohibited", "يُمنع نقل المواد الخطرة والماشية الكبيرة"),
  ];
  return (
    <StubPage
      eyebrow={bi("Travel info", "معلومات السفر")}
      title={bi("Luggage allowance", "المسموح به من الأمتعة")}
      subtitle={bi("What you can bring on board ENR services.", "ما يُسمح لك بحمله على متن خدمات الهيئة.")}
    >
      <ul className="list-disc space-y-2 ps-6 text-sm text-[color:var(--color-text-secondary)]">
        {items.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </StubPage>
  );
}
