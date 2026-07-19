import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout, PageHeader, ContentSection } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useBi } from "@/i18n/bi";
import { useLocale } from "@/i18n/locale-context";

type Journey = { id: string; from_station: string; to_station: string; last_searched: string };

export const Route = createFileRoute("/{-$locale}/_authenticated/account/journeys")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        {
          title: isAr ? "الرحلات المحفوظة — الهيئة القومية لسكك حديد مصر" : "Saved journeys — ENR",
        },
        {
          name: "description",
          content: isAr ? "المسارات التي تبحث عنها كثيراً." : "Your frequently searched routes.",
        },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: JourneysPage,
});

function JourneysPage() {
  const bi = useBi();
  const { locale } = useLocale();
  const [rows, setRows] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("saved_journeys")
      .select("id, from_station, to_station, last_searched")
      .order("last_searched", { ascending: false })
      .then(({ data }) => {
        setRows((data as Journey[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={bi("Account", "الحساب")}
        title={bi("Saved journeys", "الرحلات المحفوظة")}
        subtitle={bi("Your frequently searched routes.", "المسارات التي تبحث عنها كثيراً.")}
      />
      <ContentSection>
        {loading ? (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">
            {bi("Loading…", "جارٍ التحميل…")}
          </p>
        ) : rows.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-12 text-center">
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              {bi("No saved journeys yet.", "لا توجد رحلات محفوظة حتى الآن.")}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((j) => (
              <li
                key={j.id}
                className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-5"
              >
                <p className="font-bold text-[color:var(--color-text-brand)]">
                  {j.from_station} → {j.to_station}
                </p>
                <p className="text-xs text-[color:var(--color-text-tertiary)]">
                  {bi("Last searched", "آخر بحث")}{" "}
                  {new Date(j.last_searched).toLocaleDateString(
                    locale === "ar" ? "ar-EG" : "en-GB",
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </ContentSection>
    </SiteLayout>
  );
}
