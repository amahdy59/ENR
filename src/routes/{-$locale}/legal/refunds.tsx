import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/legal/refunds")({
  head: stubHead(
    "Refunds & Changes",
    "How to change or refund tickets booked through Egyptian National Railways.",
    "/legal/refunds",
    "الاسترداد والتغييرات",
    "كيفية تعديل تذاكر الهيئة القومية لسكك حديد مصر أو استردادها.",
  ),
  component: RefundsPage,
});

function RefundsPage() {
  const bi = useBi();
  return (
    <StubPage
      eyebrow={bi("Legal", "قانوني")}
      title={bi("Refunds & Changes", "الاسترداد والتغييرات")}
      breadcrumbs={[
        { label: bi("Legal", "قانوني") },
        { label: bi("Refunds", "الاسترداد") },
      ]}
    >
      <article className="prose prose-sm max-w-none space-y-6 text-[color:var(--color-text-primary)]">
        <div className="rounded-xl border-l-4 border-[color:var(--color-brand-secondary)] bg-[color:var(--color-brand-primary-tint)] p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-brand)]">
            {bi("Draft — pending confirmation from ENR customer services.", "مسودة — بانتظار التأكيد من خدمة عملاء الهيئة.")}
          </p>
        </div>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("Refund windows", "نوافذ الاسترداد")}
          </h2>
          <ul className="list-disc space-y-1 ps-6">
            <li>{bi("More than 24 h before departure: full refund.", "أكثر من 24 ساعة قبل المغادرة: استرداد كامل.")}</li>
            <li>{bi("6–24 h before departure: 75% refund.", "من 6 إلى 24 ساعة قبل المغادرة: استرداد 75%.")}</li>
            <li>{bi("Less than 6 h before departure: 50% refund.", "أقل من 6 ساعات قبل المغادرة: استرداد 50%.")}</li>
            <li>{bi("After departure: no refund.", "بعد المغادرة: لا يوجد استرداد.")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("How to request", "كيفية الطلب")}
          </h2>
          <p>{bi(
            "Sign in, open the booking, and choose Refund. Refunds return to the original payment method within 7–14 business days.",
            "سجّل الدخول، افتح الحجز، ثم اختر الاسترداد. تُعاد قيمة الاسترداد إلى وسيلة الدفع الأصلية خلال 7–14 يوم عمل.",
          )}</p>
        </section>
      </article>
    </StubPage>
  );
}
