import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Calendar, Clock, MapPin, Navigation, TrainFront } from "lucide-react";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";
import { useLocale } from "@/i18n/locale-context";
import { LocaleLink } from "@/i18n/LocaleLink";
import {
  getStationDetail,
  STATION_FACILITY_LABELS,
  STATION_LINES,
  STATIONS,
  stationLabel,
  type StationFacility,
} from "@/lib/stations";
import { departuresFrom, TRAIN_KIND_LABEL } from "@/lib/trips";

import stationDefault from "@/assets/station-default.jpg";
import routeAlex from "@/assets/route-alexandria.jpg";
import routeLuxor from "@/assets/route-luxor.jpg";
import routeAswan from "@/assets/route-aswan.jpg";
import routeMatrouh from "@/assets/route-matrouh.jpg";

export const Route = createFileRoute("/{-$locale}/stations/$id")({
  head: stubHead(
    "Station details",
    "Station facilities, live departures and accessibility information.",
    "/stations",
    "تفاصيل المحطة",
    "مرافق المحطة، والمغادرات المباشرة، ومعلومات إمكانية الوصول.",
  ),
  component: StationDetail,
});

const LINE_IMAGES: Record<string, string> = {
  "cairo-alexandria": routeAlex,
  "upper-egypt": routeLuxor,
  fayoum: routeLuxor,
  "north-coast": routeMatrouh,
  canal: stationDefault,
  delta: stationDefault,
};

const HERO_IMAGES: Record<string, string> = {
  luxor: routeLuxor,
  aswan: routeAswan,
  "marsa-matruh": routeMatrouh,
  "alexandria-misr": routeAlex,
  "sidi-gaber": routeAlex,
};

function StationDetail() {
  const bi = useBi();
  const { locale } = useLocale();
  const { id } = Route.useParams();
  const station = getStationDetail(id);
  if (!station) throw notFound();

  const heroImg = HERO_IMAGES[station.id] ?? LINE_IMAGES[station.line] ?? stationDefault;
  const lineLabel = STATION_LINES.find((l) => l.id === station.line)?.label ?? { en: station.line, ar: station.line };
  const facilities = station.facilities ?? [];
  const mapUrl = station.coords
    ? `https://www.openstreetmap.org/?mlat=${station.coords.lat}&mlon=${station.coords.lng}#map=15/${station.coords.lat}/${station.coords.lng}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(station.name.en + " railway station Egypt")}`;

  // Sample of catalogued departures leaving this station.
  const [departures, setDepartures] = useState<Awaited<ReturnType<typeof departuresFrom>>>([]);
  const [depLoading, setDepLoading] = useState<boolean>(true);
  useEffect(() => {
    let cancelled = false;
    setDepLoading(true);
    departuresFrom(station.id)
      .then((r) => { if (!cancelled) { setDepartures(r.slice(0, 6)); setDepLoading(false); } })
      .catch(() => { if (!cancelled) { setDepartures([]); setDepLoading(false); } });
    return () => { cancelled = true; };
  }, [station.id]);

  // Other stations on the same line, ordered as in the catalogue.
  const nearby = STATIONS.filter((s) => s.line === station.line && s.id !== station.id).slice(0, 6);

  return (
    <StubPage
      eyebrow={bi(`Station · ${lineLabel.en}`, `محطة · ${lineLabel.ar}`)}
      title={station.name[locale]}
      subtitle={bi(
        `${station.city.en} · Code ${station.code}${station.opened ? ` · Opened ${station.opened}` : ""}`,
        `${station.city.ar} · كود ${station.code}${station.opened ? ` · افتُتحت ${station.opened}` : ""}`,
      )}
      breadcrumbs={[
        { label: bi("Stations", "المحطات"), to: "/stations" },
        { label: station.name[locale] },
      ]}
    >
      <LocaleLink
        to="/stations"
        className="link-underline mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-text-brand)]"
      >
        <ArrowLeft className="size-4 rtl-flip" aria-hidden="true" />
        {bi("All stations", "كل المحطات")}
      </LocaleLink>

      <figure className="mb-8 overflow-hidden rounded-2xl border border-[color:var(--color-border-default)] shadow-sm">
        <img
          src={heroImg}
          alt={bi(`${station.name.en} station platform`, `رصيف محطة ${station.name.ar}`)}
          loading="lazy"
          className="h-64 w-full object-cover md:h-80"
        />
      </figure>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* About */}
        <section
          aria-labelledby="about-heading"
          className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-6 lg:col-span-2"
        >
          <h2 id="about-heading" className="flex items-center gap-2 text-lg font-bold text-[color:var(--color-text-brand)]">
            <Building2 className="size-5" aria-hidden="true" />
            {bi("About this station", "عن هذه المحطة")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-primary)]">
            {station.about?.[locale]}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">{bi("City", "المدينة")}</dt>
              <dd className="mt-1 font-semibold text-[color:var(--color-text-primary)]">{station.city[locale]}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">{bi("Line", "الخط")}</dt>
              <dd className="mt-1 font-semibold text-[color:var(--color-text-primary)]">{lineLabel[locale]}</dd>
            </div>
            {station.opened && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">
                  <Calendar className="me-1 inline size-3.5" aria-hidden="true" />
                  {bi("Opened", "افتُتحت")}
                </dt>
                <dd className="mt-1 font-semibold text-[color:var(--color-text-primary)]">{station.opened}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">{bi("Station code", "كود المحطة")}</dt>
              <dd className="mt-1 font-mono font-semibold text-[color:var(--color-text-primary)]">{station.code}</dd>
            </div>
          </dl>
        </section>

        {/* Location */}
        <section
          aria-labelledby="location-heading"
          className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-6"
        >
          <h2 id="location-heading" className="flex items-center gap-2 text-lg font-bold text-[color:var(--color-text-brand)]">
            <MapPin className="size-5" aria-hidden="true" />
            {bi("Location", "الموقع")}
          </h2>
          {station.coords ? (
            <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
              {bi(
                `${station.coords.lat.toFixed(4)}°N, ${station.coords.lng.toFixed(4)}°E`,
                `${station.coords.lat.toFixed(4)}° شمالاً، ${station.coords.lng.toFixed(4)}° شرقاً`,
              )}
            </p>
          ) : (
            <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
              {bi("Located in ", "تقع في ")}{station.city[locale]}.
            </p>
          )}
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="press-scale mt-4 inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            <Navigation className="size-4" aria-hidden="true" />
            {bi("Open in map", "افتح في الخريطة")}
          </a>
        </section>

        {/* Facilities */}
        <section
          aria-labelledby="facilities-heading"
          className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-6 lg:col-span-2"
        >
          <h2 id="facilities-heading" className="flex items-center gap-2 text-lg font-bold text-[color:var(--color-text-brand)]">
            <Building2 className="size-5" aria-hidden="true" />
            {bi("Facilities", "المرافق")}
          </h2>
          {facilities.length === 0 ? (
            <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
              {bi("Facility information not available.", "معلومات المرافق غير متاحة.")}
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {facilities.map((f: StationFacility) => (
                <li
                  key={f}
                  className="flex items-center gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-background-surface)] px-3 py-2 text-sm"
                >
                  <span aria-hidden="true" className="size-2 rounded-full bg-[color:var(--color-brand-secondary)]" />
                  <span className="font-medium text-[color:var(--color-text-primary)]">{STATION_FACILITY_LABELS[f][locale]}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Actions */}
        <section
          aria-labelledby="plan-heading"
          className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-6"
        >
          <h2 id="plan-heading" className="flex items-center gap-2 text-lg font-bold text-[color:var(--color-text-brand)]">
            <TrainFront className="size-5" aria-hidden="true" />
            {bi("Plan a journey", "خطط رحلتك")}
          </h2>
          <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
            {bi("Search trains departing from or arriving at this station.", "ابحث عن القطارات المغادرة من هذه المحطة أو المتجهة إليها.")}
          </p>
          <LocaleLink
            to={`/search?from=${encodeURIComponent(station.id)}`}
            className="press-scale mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--color-brand-secondary)] px-4 py-2 text-sm font-semibold text-[color:var(--color-interactive-cta-text)] hover:brightness-105"
          >
            {bi("Search trains", "ابحث في القطارات")}
          </LocaleLink>
          <LocaleLink
            to="/timetable/live"
            className="link-underline mt-3 block text-center text-sm font-semibold text-[color:var(--color-text-brand)]"
          >
            {bi("View live departures →", "المغادرات المباشرة →")}
          </LocaleLink>
        </section>
      </div>

      {/* Sample departures from this station */}
      {depLoading && (
        <section
          aria-labelledby="departures-loading-heading"
          className="mt-6 rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-6"
          aria-busy="true"
        >
          <h2 id="departures-loading-heading" className="flex items-center gap-2 text-lg font-bold text-[color:var(--color-text-brand)]">
            <Clock className="size-5" aria-hidden="true" />
            {bi("Loading departures…", "جارٍ تحميل المغادرات…")}
          </h2>
          <ul className="mt-4 space-y-3" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="h-10 animate-pulse rounded-md bg-[color:var(--color-background-surface)] motion-reduce:animate-none" />
            ))}
          </ul>
        </section>
      )}

      {!depLoading && departures.length > 0 && (
        <section
          aria-labelledby="departures-heading"
          className="mt-6 rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-6"
        >
          <h2 id="departures-heading" className="flex items-center gap-2 text-lg font-bold text-[color:var(--color-text-brand)]">
            <Clock className="size-5" aria-hidden="true" />
            {bi("Sample departures from this station", "نماذج مغادرات من هذه المحطة")}
          </h2>
          <p className="mt-2 text-xs text-[color:var(--color-text-secondary)]">
            {bi(
              "Indicative catalogue times. Check live departures on the day of travel.",
              "أوقات إرشادية من الفهرس. راجع المغادرات المباشرة يوم السفر.",
            )}
          </p>
          <ul className="mt-4 divide-y divide-[color:var(--color-border-default)]">
            {departures.map((t) => (
              <li key={t.number} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-[color:var(--color-brand-primary-tint)] px-2 py-1 font-mono text-sm font-bold text-[color:var(--color-text-brand)]" dir="ltr">
                    {t.depart}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                      {bi("To ", "إلى ")}{stationLabel(t.to, locale)}
                    </span>
                    <span className="text-xs text-[color:var(--color-text-secondary)]">
                      {TRAIN_KIND_LABEL[t.kind][locale]} · {t.number}
                    </span>
                  </div>
                </div>
                <LocaleLink
                  to={`/search?from=${encodeURIComponent(station.id)}&to=${encodeURIComponent(t.to)}`}
                  className="link-underline text-sm font-semibold text-[color:var(--color-text-brand)]"
                >
                  {bi("See trains →", "عرض القطارات →")}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Nearby stations on the same line */}
      {nearby.length > 0 && (
        <section
          aria-labelledby="nearby-heading"
          className="mt-6 rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-6"
        >
          <h2 id="nearby-heading" className="flex items-center gap-2 text-lg font-bold text-[color:var(--color-text-brand)]">
            <MapPin className="size-5" aria-hidden="true" />
            {bi("Other stations on this line", "محطات أخرى على نفس الخط")}
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map((s) => (
              <li key={s.id}>
                <LocaleLink
                  to={`/stations/${s.id}`}
                  className="interactive-surface flex items-center justify-between gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-background-surface)] px-3 py-2 text-sm hover:border-[color:var(--color-brand-primary)]"
                >
                  <span className="truncate font-semibold text-[color:var(--color-text-primary)]">{s.name[locale]}</span>
                  <span className="text-xs text-[color:var(--color-text-secondary)]">{s.code}</span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </StubPage>
  );
}
