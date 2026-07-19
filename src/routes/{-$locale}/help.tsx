import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/help")({
  head: stubHead(
    "Help centre",
    "Frequently asked questions and support resources for ENR passengers.",
    "/help",
    "مركز المساعدة",
    "الأسئلة الشائعة وموارد الدعم لركاب الهيئة القومية لسكك حديد مصر.",
  ),
  component: HelpPage,
});

function HelpPage() {
  const bi = useBi();
  const faqs = [
    {
      q: bi("How do I book a ticket?", "كيف أحجز تذكرة؟"),
      a: bi(
        "Search from the homepage, choose your class, add passenger details, and pay online. You'll receive an e-ticket instantly.",
        "ابدأ البحث من الصفحة الرئيسية، ثم اختر درجة السفر، وأدخل بيانات الركاب، وادفع عبر الإنترنت. ستحصل على تذكرة إلكترونية فوراً.",
      ),
    },
    {
      q: bi("Can I get a refund?", "هل يمكنني استرداد قيمة التذكرة؟"),
      a: bi(
        "Yes — most tickets are refundable up to 24 hours before departure, minus a small processing fee.",
        "نعم — معظم التذاكر قابلة للاسترداد حتى 24 ساعة قبل موعد المغادرة، مع خصم رسوم معالجة رمزية.",
      ),
    },
    {
      q: bi("How much luggage can I bring?", "ما مقدار الأمتعة المسموح به؟"),
      a: bi(
        "One large bag and one carry-on per passenger free of charge. Bicycles require a reservation.",
        "حقيبة كبيرة وحقيبة يد لكل راكب مجاناً. تتطلب الدراجات حجزاً مسبقاً.",
      ),
    },
    {
      q: bi("Are there discounts for children?", "هل توجد تخفيضات للأطفال؟"),
      a: bi(
        "Children under 4 travel free (without a seat). Ages 4–11 get 50% off.",
        "الأطفال دون الرابعة يسافرون مجاناً (بدون مقعد). الأعمار من 4 إلى 11 عاماً يحصلون على خصم 50٪.",
      ),
    },
    {
      q: bi("How do I get accessibility assistance?", "كيف أحصل على مساعدة لذوي الهمم؟"),
      a: bi(
        "Pre-book wheelchair support and priority seating via the accessibility page or by calling our hotline.",
        "احجز مسبقاً خدمة الكرسي المتحرك ومقاعد الأولوية عبر صفحة إمكانية الوصول أو بالاتصال بالخط الساخن.",
      ),
    },
  ];

  return (
    <StubPage
      eyebrow={bi("Support", "الدعم")}
      title={bi("Help centre", "مركز المساعدة")}
      subtitle={bi("Answers to common questions about booking, refunds, and travel.", "إجابات عن الأسئلة الشائعة حول الحجز والاسترداد والسفر.")}
    >
      <div className="divide-y divide-[color:var(--color-border-default)] rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)]">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-semibold text-[color:var(--color-text-brand)]">
              {f.q}
            </summary>
            <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">{f.a}</p>
          </details>
        ))}
      </div>
    </StubPage>
  );
}
