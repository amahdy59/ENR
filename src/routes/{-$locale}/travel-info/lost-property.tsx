import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/travel-info/lost-property")({
  head: stubHead(
    "Lost property",
    "Report and recover lost items on ENR services.",
    "/travel-info/lost-property",
    "المفقودات",
    "الإبلاغ عن المفقودات واستردادها في خدمات الهيئة القومية لسكك حديد مصر.",
  ),
  component: LostPropertyPage,
});

function LostPropertyPage() {
  const bi = useBi();
  return (
    <StubPage
      eyebrow={bi("Travel info", "معلومات السفر")}
      title={bi("Lost property", "المفقودات")}
      subtitle={bi("Report an item you lost on our services.", "أبلغ عن شيء فقدته في خدماتنا.")}
    >
      <form
        className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          toast.success(bi(
            "Lost property report submitted. We'll contact you within 48 hours.",
            "تم إرسال بلاغ المفقودات. سنتواصل معك خلال 48 ساعة.",
          ));
          form.reset();
        }}
      >
        <input required placeholder={bi("Your name", "اسمك")} aria-label={bi("Your name", "اسمك")} className="h-11 rounded-lg border border-[color:var(--color-border-default)] px-3 text-sm" />
        <input required placeholder={bi("Contact email", "البريد الإلكتروني للتواصل")} aria-label={bi("Contact email", "البريد الإلكتروني للتواصل")} type="email" className="h-11 rounded-lg border border-[color:var(--color-border-default)] px-3 text-sm" />
        <input required placeholder={bi("Route (e.g. Cairo → Luxor)", "المسار (مثال: القاهرة ← الأقصر)")} aria-label={bi("Route", "المسار")} className="h-11 rounded-lg border border-[color:var(--color-border-default)] px-3 text-sm" />
        <input required type="date" aria-label={bi("Date of loss", "تاريخ الفقد")} className="h-11 rounded-lg border border-[color:var(--color-border-default)] px-3 text-sm" />
        <textarea required placeholder={bi("Describe the item", "صف الشيء المفقود")} aria-label={bi("Describe the item", "صف الشيء المفقود")} rows={4} className="rounded-lg border border-[color:var(--color-border-default)] p-3 text-sm" />
        <button type="submit" className="h-11 rounded-lg bg-[color:var(--color-brand-primary)] text-sm font-semibold text-white">
          {bi("Submit report", "إرسال البلاغ")}
        </button>
      </form>
    </StubPage>
  );
}
