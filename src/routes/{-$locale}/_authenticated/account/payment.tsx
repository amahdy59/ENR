import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader, ContentSection } from "@/components/site/SiteLayout";
import { useBi } from "@/i18n/bi";
import { Plus, CreditCard } from "lucide-react";

export const Route = createFileRoute("/{-$locale}/_authenticated/account/payment")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        { title: isAr ? "طرق الدفع — الهيئة القومية لسكك حديد مصر" : "Payment methods — ENR" },
        {
          name: "description",
          content: isAr ? "أدر بطاقات الدفع المحفوظة." : "Manage your saved payment methods.",
        },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: PaymentMethodsPage,
});

function PaymentMethodsPage() {
  const bi = useBi();
  return (
    <SiteLayout>
      <PageHeader
        eyebrow={bi("Account", "الحساب")}
        title={bi("Payment methods", "طرق الدفع")}
        subtitle={bi("Save cards for faster checkout.", "احفظ البطاقات لدفع أسرع.")}
      />
      <ContentSection>
        <button className="mb-6 inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-white">
          <Plus className="size-4" /> {bi("Add card", "أضِف بطاقة")}
        </button>
        <div className="grid place-items-center rounded-2xl border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-12 text-center">
          <CreditCard className="mb-3 size-8 text-[color:var(--color-text-tertiary)]" />
          <p className="text-sm text-[color:var(--color-text-secondary)]">
            {bi("No saved cards yet.", "لا توجد بطاقات محفوظة حتى الآن.")}
          </p>
        </div>
      </ContentSection>
    </SiteLayout>
  );
}
