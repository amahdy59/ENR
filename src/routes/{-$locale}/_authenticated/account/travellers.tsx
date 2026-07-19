import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout, PageHeader, ContentSection } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useBi } from "@/i18n/bi";
import { Plus } from "lucide-react";

type Traveller = {
  id: string;
  title: string | null;
  first_name: string;
  last_name: string;
  dob: string | null;
  id_number: string | null;
  nationality: string | null;
};

export const Route = createFileRoute("/{-$locale}/_authenticated/account/travellers")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "المسافرون المحفوظون — الهيئة القومية لسكك حديد مصر"
            : "Saved travellers — ENR",
        },
        {
          name: "description",
          content: isAr
            ? "إدارة المسافرين المحفوظين للحجز الأسرع."
            : "Manage saved travellers for faster ENR bookings.",
        },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: TravellersPage,
});

function TravellersPage() {
  const bi = useBi();
  const [rows, setRows] = useState<Traveller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("saved_travellers")
      .select("id, title, first_name, last_name, dob, id_number, nationality")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as Traveller[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={bi("Account", "الحساب")}
        title={bi("Saved travellers", "المسافرون المحفوظون")}
        subtitle={bi(
          "Book faster with saved passenger details.",
          "احجز أسرع ببيانات ركاب محفوظة مسبقاً.",
        )}
      />
      <ContentSection>
        <button className="mb-6 inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-white">
          <Plus className="size-4" /> {bi("Add traveller", "أضِف مسافراً")}
        </button>

        {loading ? (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">
            {bi("Loading…", "جارٍ التحميل…")}
          </p>
        ) : rows.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-12 text-center">
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              {bi("No saved travellers yet.", "لا يوجد مسافرون محفوظون حتى الآن.")}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {rows.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-5"
              >
                <p className="font-bold text-[color:var(--color-text-brand)]">
                  {[t.title, t.first_name, t.last_name].filter(Boolean).join(" ")}
                </p>
                {t.nationality && (
                  <p className="text-sm text-[color:var(--color-text-secondary)]">
                    {t.nationality}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </ContentSection>
    </SiteLayout>
  );
}
