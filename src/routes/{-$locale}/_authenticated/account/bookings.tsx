import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout, PageHeader, ContentSection } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useBi } from "@/i18n/bi";

type Booking = {
  id: string;
  reference: string;
  from_station: string;
  to_station: string;
  travel_date: string;
  travel_time: string | null;
  class: string | null;
  status: string;
  price_egp: number | null;
};

export const Route = createFileRoute("/{-$locale}/_authenticated/account/bookings")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        { title: isAr ? "حجوزاتي — الهيئة القومية لسكك حديد مصر" : "My bookings — ENR" },
        {
          name: "description",
          content: isAr
            ? "اعرض حجوزاتك القادمة والسابقة والملغاة."
            : "View your upcoming, past and cancelled ENR bookings.",
        },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: BookingsPage,
});

type TabId = "upcoming" | "past" | "cancelled";

function BookingsPage() {
  const bi = useBi();
  const [tab, setTab] = useState<TabId>("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs: { id: TabId; label: string; empty: string }[] = [
    {
      id: "upcoming",
      label: bi("Upcoming", "القادمة"),
      empty: bi("No upcoming bookings yet.", "لا توجد حجوزات قادمة حتى الآن."),
    },
    {
      id: "past",
      label: bi("Past", "السابقة"),
      empty: bi("No past bookings yet.", "لا توجد حجوزات سابقة حتى الآن."),
    },
    {
      id: "cancelled",
      label: bi("Cancelled", "الملغاة"),
      empty: bi("No cancelled bookings.", "لا توجد حجوزات ملغاة."),
    },
  ];

  useEffect(() => {
    supabase
      .from("bookings")
      .select(
        "id, reference, from_station, to_station, travel_date, travel_time, class, status, price_egp",
      )
      .order("travel_date", { ascending: false })
      .then(({ data }) => {
        setBookings((data as Booking[]) ?? []);
        setLoading(false);
      });
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const filtered = bookings.filter((b) => {
    if (tab === "cancelled") return b.status === "cancelled";
    if (tab === "upcoming") return b.status !== "cancelled" && b.travel_date >= today;
    return b.status !== "cancelled" && b.travel_date < today;
  });
  const currentEmpty = tabs.find((t) => t.id === tab)?.empty ?? "";

  return (
    <SiteLayout>
      <PageHeader eyebrow={bi("Account", "الحساب")} title={bi("My bookings", "حجوزاتي")} />
      <ContentSection>
        <div className="mb-6 flex gap-1 rounded-lg bg-[color:var(--color-background-surface)] p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${
                tab === t.id
                  ? "bg-[color:var(--color-brand-primary)] text-white"
                  : "text-[color:var(--color-text-secondary)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">
            {bi("Loading bookings…", "جارٍ تحميل الحجوزات…")}
          </p>
        ) : filtered.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-12 text-center">
            <p className="text-sm text-[color:var(--color-text-secondary)]">{currentEmpty}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-5"
              >
                <div>
                  <p
                    className="text-xs font-semibold text-[color:var(--color-text-accent)]"
                    dir="ltr"
                  >
                    {b.reference}
                  </p>
                  <p className="mt-1 font-bold text-[color:var(--color-text-brand)]">
                    {b.from_station} → {b.to_station}
                  </p>
                  <p className="text-sm text-[color:var(--color-text-secondary)]">
                    {b.travel_date} {b.travel_time ? `· ${b.travel_time}` : ""}
                    {b.class ? ` · ${b.class}` : ""}
                  </p>
                </div>
                {b.price_egp != null && (
                  <p className="text-lg font-bold text-[color:var(--color-text-price-accent)]">
                    {b.price_egp} {bi("EGP", "ج.م")}
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
