import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout, PageHeader, ContentSection } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useBi } from "@/i18n/bi";
import { useLocale } from "@/i18n/locale-context";

type Notification = { id: string; type: string; title: string; body: string | null; read: boolean; created_at: string };

export const Route = createFileRoute("/{-$locale}/_authenticated/account/notifications")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        { title: isAr ? "الإشعارات — الهيئة القومية لسكك حديد مصر" : "Notifications — ENR" },
        { name: "description", content: isAr ? "إشعاراتك وتحديثاتك من الهيئة." : "Your ENR notifications and updates." },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: NotificationsPage,
});

function NotificationsPage() {
  const bi = useBi();
  const { locale } = useLocale();
  const [rows, setRows] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("notifications")
      .select("id, type, title, body, read, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as Notification[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <SiteLayout>
      <PageHeader eyebrow={bi("Account", "الحساب")} title={bi("Notifications", "الإشعارات")} />
      <ContentSection>
        {loading ? (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">{bi("Loading…", "جارٍ التحميل…")}</p>
        ) : rows.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-12 text-center">
            <p className="text-sm text-[color:var(--color-text-secondary)]">{bi("You have no notifications.", "لا توجد إشعارات لديك.")}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((n) => (
              <li key={n.id} className={`rounded-2xl border border-[color:var(--color-border-default)] p-5 ${n.read ? "bg-[color:var(--color-background-elevated)]" : "bg-[color:var(--color-brand-primary-tint)]"}`}>
                <p className="font-bold text-[color:var(--color-text-brand)]">{n.title}</p>
                {n.body && <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{n.body}</p>}
                <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">
                  {new Date(n.created_at).toLocaleString(locale === "ar" ? "ar-EG" : "en-GB")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </ContentSection>
    </SiteLayout>
  );
}
