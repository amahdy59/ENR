import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/contact")({
  head: stubHead(
    "Contact",
    "Get in touch with ENR customer service and support.",
    "/contact",
    "اتصل بنا",
    "تواصل مع خدمة عملاء ودعم الهيئة القومية لسكك حديد مصر.",
  ),
  component: ContactPage,
});

function ContactPage() {
  const bi = useBi();
  return (
    <StubPage
      eyebrow={bi("Support", "الدعم")}
      title={bi("Contact us", "اتصل بنا")}
      subtitle={bi(
        "We're here to help — 24/7 customer support.",
        "نحن هنا للمساعدة — خدمة عملاء على مدار الساعة طوال أيام الأسبوع.",
      )}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-5">
          <h3 className="font-bold text-[color:var(--color-text-brand)]">
            {bi("Hotline", "الخط الساخن")}
          </h3>
          <p className="mt-2 text-sm" dir="ltr">
            {bi("Call ", "اتصل بـ ")}
            <strong>16060</strong>
            {bi(" · 24/7", " · طوال الأسبوع")}
          </p>
        </div>
        <div className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-5">
          <h3 className="font-bold text-[color:var(--color-text-brand)]">
            {bi("Email", "البريد الإلكتروني")}
          </h3>
          <p className="mt-2 text-sm" dir="ltr">
            support@enr.gov.eg
          </p>
        </div>
        <div className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-5">
          <h3 className="font-bold text-[color:var(--color-text-brand)]">
            {bi("Head office", "المقر الرئيسي")}
          </h3>
          <p className="mt-2 text-sm">
            {bi("Cairo Central (Ramses), Cairo, Egypt", "محطة مصر (رمسيس)، القاهرة، مصر")}
          </p>
        </div>
      </div>
    </StubPage>
  );
}
