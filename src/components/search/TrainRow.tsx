import { ArrowRight, ChevronRight, Ticket } from "lucide-react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { findStation } from "@/lib/stations";
import { TRAIN_KIND_LABEL, FARE_CLASS_LABEL, type TripMatch } from "@/lib/trips";

const NAVY = "var(--color-brand-primary)";
const AMBER = "var(--color-interactive-cta)";
const TEXT_PRIMARY = "var(--color-text-primary)";
const TEXT_SECONDARY = "var(--color-text-secondary)";
const TEXT_TERTIARY = "var(--color-text-tertiary)";
const TEXT_PRICE = "var(--color-text-price-accent)";
const BORDER = "var(--color-border-default)";
const SUCCESS = "var(--color-status-success-text)";

export function FareChip({ klass, price }: { klass: string; price: string }) {
  return (
    <div
      className="flex flex-col gap-0.5 rounded-md border px-3 py-2 min-w-[100px]"
      style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}
    >
      <span className="flex items-center gap-1 text-[11px]" style={{ color: TEXT_TERTIARY }}>
        <Ticket className="h-3 w-3" />
        {klass}
      </span>
      <span className="text-[13px] font-semibold" style={{ color: TEXT_PRICE }}>
        {price}
      </span>
    </div>
  );
}

export function TrainRow({
  trip,
  locale,
  bi,
}: {
  trip: TripMatch;
  locale: "en" | "ar";
  bi: (en: string, ar: string) => string;
}) {
  const fromLabel = findStation(trip.from)?.name[locale] ?? trip.from;
  const toLabel = findStation(trip.to)?.name[locale] ?? trip.to;
  const kindLabel = TRAIN_KIND_LABEL[trip.kind][locale];
  const suffix = trip.direct
    ? bi("Direct", "مباشر")
    : `${trip.intermediateStops} ${bi("stops", "توقفات")}`;
  return (
    <div
      className="hidden md:grid gap-4 rounded-lg border p-4 items-center"
      style={{
        borderColor: BORDER,
        background: "var(--color-background-elevated)",
        gridTemplateColumns: "1.4fr 1fr 2fr auto",
      }}
    >
      <div className="flex flex-col gap-1">
        <div
          className="flex items-center gap-2 text-[22px] font-bold"
          style={{ color: TEXT_PRIMARY }}
          dir="ltr"
        >
          <span>{trip.depart}</span>
          <ArrowRight className="h-4 w-4 rtl-flip" style={{ color: TEXT_TERTIARY }} />
          <span>
            {trip.arrive}
            {trip.nextDayArrival ? " +1" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[12px]" style={{ color: TEXT_TERTIARY }}>
          <span>{fromLabel}</span>
          <ArrowRight className="h-3 w-3 rtl-flip" />
          <span>{toLabel}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[12px] font-semibold tracking-wide" style={{ color: TEXT_SECONDARY }}>
          {kindLabel} · {trip.number} · {suffix}
        </span>
        <span className="text-[15px] font-semibold" style={{ color: TEXT_PRIMARY }}>
          {trip.duration[locale]}
        </span>
        <span className="text-[13px] font-medium" style={{ color: SUCCESS }}>
          {bi("On time", "في الموعد")}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {trip.fares.map((f) => (
          <FareChip
            key={f.klass}
            klass={FARE_CLASS_LABEL[f.klass][locale]}
            price={`${f.priceEgp} ${bi("EGP", "ج.م")}`}
          />
        ))}
      </div>
      <LocaleLink
        to="/class"
        className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-[13px] font-semibold whitespace-nowrap"
        style={{ background: AMBER, color: NAVY }}
      >
        {bi("Select", "اختيار")} <ChevronRight className="h-4 w-4 rtl-flip" />
      </LocaleLink>
    </div>
  );
}

export function MobileTrainCard({
  trip,
  locale,
  bi,
}: {
  trip: TripMatch;
  locale: "en" | "ar";
  bi: (en: string, ar: string) => string;
}) {
  const fromLabel = findStation(trip.from)?.name[locale] ?? trip.from;
  const toLabel = findStation(trip.to)?.name[locale] ?? trip.to;
  return (
    <article
      className="md:hidden rounded-2xl border p-4 flex flex-col gap-3"
      style={{ borderColor: BORDER, background: "var(--color-background-elevated)" }}
      aria-label={bi(
        `Train ${trip.number}, ${trip.depart} to ${trip.arrive}`,
        `قطار ${trip.number}، ${trip.depart} إلى ${trip.arrive}`,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="text-[20px] font-bold leading-tight"
          style={{ color: TEXT_PRIMARY }}
          dir="ltr"
        >
          {trip.depart} – {trip.arrive}
          {trip.nextDayArrival ? " +1" : ""}
        </div>
        <div className="flex flex-col items-end gap-0.5 text-[11px] font-semibold shrink-0">
          <span className="inline-flex items-center gap-1" style={{ color: SUCCESS }}>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: SUCCESS }}
            />
            {bi("ON TIME", "في الموعد")}
          </span>
          <span style={{ color: TEXT_TERTIARY }}>· {trip.number}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[13px]" style={{ color: TEXT_SECONDARY }}>
        <span className="truncate">{fromLabel}</span>
        <ArrowRight className="h-3.5 w-3.5 rtl-flip shrink-0" aria-hidden="true" />
        <span className="truncate">{toLabel}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {trip.fares.map((f) => (
          <span
            key={f.klass}
            className="inline-flex items-center rounded-md px-2.5 py-1 text-[12px] font-semibold"
            style={{
              background: "var(--color-background-surface)",
              color: TEXT_PRICE,
              border: `1px solid ${BORDER}`,
            }}
          >
            {FARE_CLASS_LABEL[f.klass][locale]} · {f.priceEgp}
          </span>
        ))}
      </div>
      <LocaleLink
        to="/class"
        className="inline-flex h-11 min-h-[44px] items-center justify-center gap-1 rounded-lg text-[14px] font-semibold"
        style={{ background: AMBER, color: NAVY }}
      >
        {bi("Select", "اختيار")}
      </LocaleLink>
    </article>
  );
}
