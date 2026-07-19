import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/legal/privacy")({
  head: stubHead(
    "Privacy Policy",
    "How Egyptian National Railways collects, uses, and protects your personal information.",
    "/legal/privacy",
    "سياسة الخصوصية",
    "كيف تجمع الهيئة القومية لسكك حديد مصر بياناتك الشخصية وتستخدمها وتحميها.",
  ),
  component: PrivacyPage,
});

function PrivacyPage() {
  const bi = useBi();
  return (
    <StubPage
      eyebrow={bi("Legal", "قانوني")}
      title={bi("Privacy Policy", "سياسة الخصوصية")}
      subtitle={bi(
        "This page describes what personal data ENR collects when you use this site and how we handle it.",
        "توضح هذه الصفحة البيانات الشخصية التي تجمعها الهيئة عند استخدامك للموقع وكيف نتعامل معها.",
      )}
      breadcrumbs={[
        { label: bi("Legal", "قانوني") },
        { label: bi("Privacy", "الخصوصية") },
      ]}
    >
      <article className="prose prose-sm max-w-none space-y-6 text-[color:var(--color-text-primary)]">
        <div className="rounded-xl border-l-4 border-[color:var(--color-brand-secondary)] bg-[color:var(--color-brand-primary-tint)] p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-brand)]">
            {bi("Draft — pending legal review.", "مسودة — بانتظار المراجعة القانونية.")}
          </p>
          <p className="mt-1 text-[color:var(--color-text-secondary)]">
            {bi(
              "The wording below is a working draft and does not yet reflect final legal terms. Please contact us before relying on it.",
              "الصياغة أدناه مسودة عمل ولا تعكس بعد الشروط القانونية النهائية. يُرجى التواصل معنا قبل الاعتماد عليها.",
            )}
          </p>
        </div>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("1. Data we collect", "1. البيانات التي نجمعها")}
          </h2>
          <p>{bi(
            "Account information (name, email, phone), booking details (journeys, passengers, payment method type — never full card numbers), and technical logs required to keep the service running.",
            "معلومات الحساب (الاسم والبريد الإلكتروني والهاتف)، وتفاصيل الحجز (الرحلات والركاب ونوع وسيلة الدفع — دون تخزين أرقام البطاقات كاملةً)، وسجلات تقنية لازمة لتشغيل الخدمة.",
          )}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("2. How we use it", "2. كيف نستخدمها")}
          </h2>
          <p>{bi(
            "To provide the booking service, contact you about your journeys, and improve the site. We do not sell personal data.",
            "لتقديم خدمة الحجز والتواصل معك بشأن رحلاتك وتحسين الموقع. لا نبيع البيانات الشخصية.",
          )}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("3. Your rights", "3. حقوقك")}
          </h2>
          <p>{bi(
            "You can request access, correction, export, or deletion of your data at any time by contacting support.",
            "يمكنك في أي وقت طلب الوصول إلى بياناتك أو تصحيحها أو تصديرها أو حذفها عبر التواصل مع الدعم.",
          )}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[color:var(--color-text-brand)]">
            {bi("4. Contact", "4. للتواصل")}
          </h2>
          <p>{bi(
            "Email: privacy@enr.example — replace with your published contact before going live.",
            "البريد الإلكتروني: privacy@enr.example — استبدله ببريد التواصل الرسمي قبل النشر.",
          )}</p>
        </section>
      </article>
    </StubPage>
  );
}
