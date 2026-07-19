import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";
import { useLocale } from "@/i18n/locale-context";
import { LocaleLink } from "@/i18n/LocaleLink";
import { STATIONS, STATION_LINES, searchStations, type Station } from "@/lib/stations";
import { MapPin, Search, TrainFront } from "lucide-react";

export const Route = createFileRoute("/{-$locale}/stations/")({
  head: stubHead(
    "Stations",
    "Find any of ENR's mainline stations across Egypt — Cairo, Alexandria, Luxor, Aswan and the Delta, Canal and North Coast networks.",
    "/stations",
    "المحطات",
    "ابحث عن أي محطة رئيسية للهيئة القومية لسكك حديد مصر — القاهرة والإسكندرية والأقصر وأسوان وشبكات الدلتا والقناة والساحل الشمالي.",
  ),
  component: StationsIndex,
});

type LineId = (typeof STATION_LINES)[number]["id"];

function StationsIndex() {
  const bi = useBi();
  const { locale } = useLocale();
  const [q, setQ] = useState("");

  const grouped = useMemo(() => {
    const source: readonly Station[] = q.trim() ? searchStations(q, 100) : STATIONS;
    const map = new Map<string, Station[]>();
    for (const s of source) {
      const arr = map.get(s.line) ?? [];
      arr.push(s);
      map.set(s.line, arr);
    }
    return STATION_LINES
      .map((line) => ({ id: line.id as LineId, label: line.label, items: map.get(line.id) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, [q]);

  const total = STATIONS.length;
  const resultCount = grouped.reduce((n, g) => n + g.items.length, 0);

  return (
    <StubPage
      eyebrow={bi("Network", "الشبكة")}
      title={bi("Find a station", "ابحث عن محطة")}
      subtitle={bi(
        `Search across ${total} mainline stations serving cities and towns from the Mediterranean to Aswan.`,
        `ابحث بين ${total} محطة رئيسية تخدم المدن والقرى من ساحل المتوسط إلى أسوان.`,
      )}
      breadcrumbs={[{ label: bi("Stations", "المحطات") }]}
    >
      <div className="mb-8">
        <label htmlFor="station-search" className="mb-2 block text-sm font-semibold text-[color:var(--color-text-brand)]">
          {bi("Search stations", "ابحث في المحطات")}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-brand)]">
            <Search className="size-5" aria-hidden="true" />
          </span>
          <input
            id="station-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={bi("Search by station name, city or code…", "ابحث باسم المحطة أو المدينة أو الكود…")}
            aria-describedby="station-search-hint"
            className="field-interaction h-12 w-full rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] ps-11 pe-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-placeholder)] shadow-sm"
          />
        </div>
        <p id="station-search-hint" aria-live="polite" className="mt-2 text-xs text-[color:var(--color-text-secondary)]">
          {q.trim()
            ? bi(`${resultCount} of ${total} stations match "${q}".`, `${resultCount} من ${total} محطة تطابق "${q}".`)
            : bi("Grouped by ENR line.", "مجمّعة حسب خط الهيئة.")}
        </p>
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-background-surface)] p-10 text-center text-sm text-[color:var(--color-text-secondary)]">
          {bi("No stations matched. Try a nearby city or the line name.", "لا توجد محطات مطابقة. جرّب مدينة قريبة أو اسم الخط.")}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <section key={group.id} aria-labelledby={`line-${group.id}`}>
              <h2
                id={`line-${group.id}`}
                className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[color:var(--color-text-accent)]"
              >
                <TrainFront className="size-4" aria-hidden="true" />
                {bi(group.label.en, group.label.ar)}
                <span className="ms-1 rounded-full bg-[color:var(--color-brand-primary-tint)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-text-brand)]">
                  {group.items.length}
                </span>
              </h2>
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((s) => (
                  <li key={s.id}>
                    <LocaleLink
                      to={`/stations/${s.id}`}
                      className="interactive-surface flex h-full items-start gap-3 rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-4 shadow-sm transition hover:border-[color:var(--color-brand-primary)] focus-visible:border-[color:var(--color-brand-primary)]"
                    >
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-[color:var(--color-brand-primary-tint)] text-[color:var(--color-text-brand)]">
                        <MapPin className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-base font-bold text-[color:var(--color-text-primary)]">
                            {s.name[locale]}
                          </span>
                          <span className="shrink-0 text-[11px] font-semibold tracking-wider text-[color:var(--color-text-secondary)]">
                            {s.code}
                          </span>
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-[color:var(--color-text-secondary)]">
                          {s.city[locale]}
                          {s.hub && (
                            <span className="rounded-full bg-[color:var(--color-background-warm)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[color:var(--color-text-price-accent)]">
                              {bi("Hub", "رئيسية")}
                            </span>
                          )}
                        </span>
                      </span>
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </StubPage>
  );
}
