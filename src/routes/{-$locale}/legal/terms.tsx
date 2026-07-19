import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/legal/terms")({
  head: stubHead(
    "Terms of Service",
    "The terms that govern your use of the Egyptian National Railways booking service.",
    "/legal/terms",
    "شروط الخدمة",
    "الشروط التي تحكم استخدامك لخدمة الحجز الخاصة بالهيئة القومية لسكك حديد مصر.",
  ),
  component: TermsPage,
});

function TermsPage() {
  const bi = useBi();
  return (
    <StubPage
      eyebrow={bi("Legal", "قانوني")}
      title={bi("Terms of Service", "شروط الخدمة")}
      breadcrumbs={[{ label: bi("Legal", "قانوني") }, { label: bi("Terms", "الشروط") }]}
    >
      <article className="prose prose-sm max-w-none space-y-6 text-[color:var(--color-text-primary)]">
        <div className="rounded-xl border-l-4 border-[color:var(--color-brand-secondary)] bg-[color:var(--color-brand-primary-tint)] p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-brand)]">
            {bi("Draft — pending legal review.", "مسودة — بانتظار المراجعة القانونية.")}
          </p>
        </div>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("1. Acceptance", "1. القبول")}
          </h2>
          <p>
            {bi(
              "By using this site you agree to these terms. If you don't agree, please don't use the service.",
              "باستخدامك للموقع فأنت توافق على هذه الشروط. إذا لم توافق فيرجى عدم استخدام الخدمة.",
            )}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("2. Bookings and tickets", "2. الحجوزات والتذاكر")}
          </h2>
          <p>
            {bi(
              "Tickets are subject to availability and the current ENR tariff. Boarding requires valid identification matching the passenger name on the ticket.",
              "التذاكر تخضع للتوفر وتعريفة الهيئة السارية. يستلزم الصعود إلى القطار إثبات هوية سارٍ مطابق لاسم الراكب على التذكرة.",
            )}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("3. Prohibited conduct", "3. السلوك المحظور")}
          </h2>
          <p>
            {bi(
              "You may not resell tickets, use automated tools to scrape schedules, or misrepresent passenger details.",
              "لا يجوز إعادة بيع التذاكر أو استخدام أدوات آلية لسحب الجداول أو تقديم بيانات ركاب مضللة.",
            )}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("4. Governing law", "4. القانون الحاكم")}
          </h2>
          <p>
            {bi(
              "These terms are governed by the laws of the Arab Republic of Egypt. Disputes will be settled in Cairo courts unless another venue is legally required.",
              "تخضع هذه الشروط لقوانين جمهورية مصر العربية. تُسوَّى النزاعات أمام محاكم القاهرة ما لم يستلزم القانون خلاف ذلك.",
            )}
          </p>
        </section>
      </article>
    </StubPage>
  );
}
