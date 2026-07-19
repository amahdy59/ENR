import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout, PageHeader, ContentSection } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useBi } from "@/i18n/bi";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/i18n/LocaleLink";
import { Ticket, Users, MapPin, CreditCard, Bell, LogOut } from "lucide-react";
import { ConfirmDialog } from "@/components/site/ConfirmDialog";

export const Route = createFileRoute("/{-$locale}/_authenticated/account/")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        { title: isAr ? "حسابي — الهيئة القومية لسكك حديد مصر" : "My account — ENR" },
        {
          name: "description",
          content: isAr
            ? "إدارة حسابك وحجوزاتك والمسافرين المحفوظين."
            : "Manage your ENR account, bookings and saved travellers.",
        },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: AccountHome,
});

function AccountHome() {
  const bi = useBi();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const links = [
    { to: "/account/bookings", icon: Ticket, label: bi("My bookings", "حجوزاتي") },
    {
      to: "/account/travellers",
      icon: Users,
      label: bi("Saved travellers", "المسافرون المحفوظون"),
    },
    { to: "/account/journeys", icon: MapPin, label: bi("Saved journeys", "الرحلات المحفوظة") },
    { to: "/account/payment", icon: CreditCard, label: bi("Payment methods", "طرق الدفع") },
    { to: "/account/notifications", icon: Bell, label: bi("Notifications", "الإشعارات") },
  ] as const;

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: localizedPath("/", locale) as never });
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={bi("Account", "الحساب")}
        title={bi("My account", "حسابي")}
        subtitle={email || bi("Welcome back.", "أهلاً بعودتك.")}
      />
      <ContentSection>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={localizedPath(l.to, locale) as never}
                className="flex items-center gap-4 rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-5 shadow-sm transition hover:border-[color:var(--color-brand-primary)]"
              >
                <div className="grid size-11 place-items-center rounded-xl bg-[color:var(--color-brand-primary-tint)] text-[color:var(--color-text-brand)]">
                  <Icon className="size-5" />
                </div>
                <span className="font-semibold text-[color:var(--color-text-brand)]">
                  {l.label}
                </span>
              </Link>
            );
          })}
        </div>
        <ConfirmDialog
          trigger={
            <button className="mt-8 inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-background-surface)]">
              <LogOut className="size-4" /> {bi("Sign out", "تسجيل الخروج")}
            </button>
          }
          title={bi("Sign out", "تسجيل الخروج")}
          description={bi(
            "Are you sure you want to sign out of your account?",
            "هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟",
          )}
          confirmLabel={bi("Sign out", "تسجيل الخروج")}
          cancelLabel={bi("Cancel", "إلغاء")}
          onConfirm={signOut}
          destructive
        />
      </ContentSection>
    </SiteLayout>
  );
}
