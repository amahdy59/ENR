import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/legal/cookies")({
  head: stubHead(
    "Cookie Notice",
    "How and why Egyptian National Railways uses cookies and similar technologies.",
    "/legal/cookies",
    "إشعار ملفات تعريف الارتباط",
    "كيف ولماذا تستخدم الهيئة القومية لسكك حديد مصر ملفات تعريف الارتباط والتقنيات المشابهة.",
  ),
  component: CookiesPage,
});

function CookiesPage() {
  const bi = useBi();
  return (
    <StubPage
      eyebrow={bi("Legal", "قانوني")}
      title={bi("Cookie Notice", "إشعار ملفات تعريف الارتباط")}
      breadcrumbs={[
        { label: bi("Legal", "قانوني") },
        { label: bi("Cookies", "ملفات تعريف الارتباط") },
      ]}
    >
      <article className="prose prose-sm max-w-none space-y-6 text-[color:var(--color-text-primary)]">
        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("Essential cookies", "ملفات تعريف الارتباط الأساسية")}
          </h2>
          <p>{bi(
            "Required to keep you signed in, remember your language, and complete a booking. These can't be turned off.",
            "لازمة للحفاظ على تسجيل دخولك وتذكّر لغتك وإتمام الحجز. لا يمكن تعطيلها.",
          )}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("Analytics cookies (with consent)", "ملفات التحليلات (بموافقتك)")}
          </h2>
          <p>{bi(
            "Used only if you accept the banner. They help us understand which routes are searched and which pages break so we can fix them.",
            "تُستخدم فقط في حال قبولك للشريط. تساعدنا في فهم الرحلات التي يتم البحث عنها والصفحات التي تحتاج إصلاحًا.",
          )}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("Managing cookies", "إدارة ملفات تعريف الارتباط")}
          </h2>
          <p>{bi(
            "You can clear the site's storage from your browser settings at any time to reset your consent choice.",
            "يمكنك في أي وقت مسح تخزين الموقع من إعدادات المتصفح لإعادة ضبط اختيار الموافقة.",
          )}</p>
        </section>
      </article>
    </StubPage>
  );
}
