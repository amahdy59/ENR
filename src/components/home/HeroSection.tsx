import { useNavigate } from "@tanstack/react-router";
import { useId, useRef, useState } from "react";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { StationCombobox } from "@/components/site/StationCombobox";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useBi } from "@/i18n/bi";
import { STATIONS } from "@/lib/stations";
import { Users, Plus, Search, Calendar, AlertTriangle, ArrowUpDown } from "lucide-react";
import heroImg from "@/assets/enr-hero.jpg";

const todayISO = () => new Date().toISOString().slice(0, 10);

const plannerSchema = (trip: "one" | "return") =>
  z
    .object({
      from: z.string().trim().min(2, "Enter a departure station").max(80, "Departure is too long"),
      to: z.string().trim().min(2, "Enter an arrival station").max(80, "Arrival is too long"),
      date: z
        .string()
        .min(1, "Choose a travel date")
        .refine((d) => d >= todayISO(), "Travel date can't be in the past"),
      returnDate: z.string().optional().or(z.literal("")),
      passengers: z
        .string()
        .min(1, "Enter number of passengers")
        .refine((v) => {
          const n = Number(v);
          return Number.isInteger(n) && n >= 1 && n <= 9;
        }, "Between 1 and 9 passengers"),
    })
    .superRefine((val, ctx) => {
      if (val.from.trim().toLowerCase() === val.to.trim().toLowerCase() && val.from.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["to"],
          message: "Arrival must differ from departure",
        });
      }
      if (trip === "return") {
        if (!val.returnDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["returnDate"],
            message: "Choose a return date",
          });
        } else if (val.returnDate < val.date) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["returnDate"],
            message: "Return date must be on or after travel date",
          });
        }
      }
    });

type PlannerErrors = Partial<Record<"from" | "to" | "date" | "returnDate" | "passengers", string>>;

export function HeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation(["home", "common"]);
  const bi = useBi();

  const [trip, setTrip] = useState<"one" | "return">("one");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(todayISO());
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [errors, setErrors] = useState<PlannerErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const fieldNames: Array<keyof PlannerErrors> = ["from", "to", "date", "returnDate", "passengers"];

  const runValidation = (): PlannerErrors => {
    const result = plannerSchema(trip).safeParse({ from, to, date, returnDate, passengers });
    if (result.success) return {};
    const next: PlannerErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof PlannerErrors;
      if (key && !next[key]) next[key] = issue.message;
    }
    return next;
  };

  const handleFieldChange =
    (key: keyof PlannerErrors, setter: (v: string) => void) => (v: string) => {
      setter(v);
      if (submitAttempted && errors[key]) {
        setErrors((prev) => {
          const { [key]: _, ...rest } = prev;
          return rest;
        });
      }
    };

  const resolveStationId = (input: string): string | undefined => {
    const q = input.trim().toLowerCase();
    if (!q) return undefined;
    return (
      STATIONS.find(
        (s) =>
          s.name.en.toLowerCase() === q ||
          s.name.ar === input.trim() ||
          s.code.toLowerCase() === q ||
          s.city.en.toLowerCase() === q ||
          s.city.ar === input.trim(),
      )?.id ??
      STATIONS.find(
        (s) =>
          s.name.en.toLowerCase().includes(q) ||
          s.name.ar.includes(input.trim()) ||
          s.city.en.toLowerCase().includes(q),
      )?.id
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const next = runValidation();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = fieldNames.find((n) => next[n]);
      if (first) {
        const el = formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`);
        el?.focus();
      }
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const fromId = resolveStationId(from);
    const toId = resolveStationId(to);
    navigate({
      to: "/search",
      search: {
        from: fromId ?? from.trim(),
        to: toId ?? to.trim(),
        date,
        pax: passengers,
        ...(trip === "return" && returnDate ? { returnDate } : {}),
      } as never,
    });
  };

  return (
    <section className="relative w-full overflow-hidden md:min-h-0 min-h-[calc(100dvh-3.5rem-4rem)]">
      <img
        src={heroImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[rgba(13,31,60,0.92)] via-[rgba(13,31,60,0.78)] md:via-[rgba(13,31,60,0.5)] to-[rgba(13,31,60,0.65)] md:to-[rgba(13,31,60,0.1)]" />
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-stretch md:items-center gap-4 md:gap-20 px-4 md:px-20 py-5 md:py-28 md:flex-row">
        {/* Copy */}
        <div className="reveal-up flex max-w-[560px] flex-col gap-2 md:gap-4 text-white">
          <span className="hidden md:inline-flex w-fit items-center rounded-full border border-[color:var(--color-brand-secondary)] bg-[color:var(--color-interactive-cta)] px-3 py-1.5 text-[13px] font-semibold text-[color:var(--color-interactive-cta-text)] shadow-[0_8px_24px_rgba(245,158,11,0.24)]">
            {t("home:hero.eyebrow")}
          </span>
          <h1 className="text-[26px] leading-tight font-bold md:text-[56px] md:leading-[64px] text-center md:text-start">
            <span className="md:hidden">
              {t("home:hero.titleLine1")} {t("home:hero.titleLine2")}
            </span>
            <span className="hidden md:inline">
              {t("home:hero.titleLine1")}
              <br />
              <span className="text-[color:var(--color-text-on-dark-accent)]">
                {t("home:hero.titleLine2")}
              </span>
            </span>
          </h1>
          <p className="hidden md:block max-w-[480px] text-base leading-6 text-white/85">
            {t("home:hero.subtitle")}
          </p>
          <div className="hidden md:flex mt-2 flex-wrap gap-5 text-sm font-medium text-white/90">
            <span>✓ {t("home:hero.bullets.eticket")}</span>
            <span>✓ {t("home:hero.bullets.noAccount")}</span>
            <span>✓ {t("home:hero.bullets.payments")}</span>
          </div>
        </div>

        {/* Planner Form */}
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          aria-labelledby="planner-heading"
          className="reveal-up w-full md:max-w-[480px] rounded-2xl bg-[color:var(--color-background-elevated)] p-4 md:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
        >
          <h2 id="planner-heading" className="sr-only">
            {t("home:planner.submit")}
          </h2>
          <div className="flex flex-col gap-4">
            {/* Tabs */}
            <div
              role="radiogroup"
              aria-label={t("home:planner.tripOneWay") + " / " + t("home:planner.tripReturn")}
              className="flex h-9 overflow-hidden rounded-lg bg-[color:var(--color-background-surface)] p-0.5"
            >
              <button
                type="button"
                role="radio"
                aria-checked={trip === "one"}
                onClick={() => setTrip("one")}
                className={`flex-1 rounded-md text-sm font-semibold ${
                  trip === "one"
                    ? "bg-[color:var(--color-background-nav-bar)] text-white shadow-sm"
                    : "text-[color:var(--color-text-brand)] hover:bg-[color:var(--color-background-elevated)]"
                }`}
              >
                {t("home:planner.tripOneWay")}
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={trip === "return"}
                onClick={() => setTrip("return")}
                className={`flex-1 rounded-md text-sm font-semibold ${
                  trip === "return"
                    ? "bg-[color:var(--color-background-nav-bar)] text-white shadow-sm"
                    : "text-[color:var(--color-text-brand)] hover:bg-[color:var(--color-background-elevated)]"
                }`}
              >
                {t("home:planner.tripReturn")}
              </button>
            </div>
            <p className="text-[13px] text-[color:var(--color-text-price-accent)]">
              <span aria-hidden="true">* </span>
              {t("home:planner.requiredNote").replace(/^\*\s*/, "")}
            </p>

            {submitAttempted && Object.keys(errors).length > 0 && (
              <div
                ref={summaryRef}
                tabIndex={-1}
                role="alert"
                aria-live="assertive"
                className="rounded-lg border border-[color:var(--color-status-error-vivid)] bg-[color:var(--color-status-error-bg)] p-3 text-sm text-[color:var(--color-status-error)]"
              >
                <p className="font-semibold">
                  {bi(
                    `Please fix ${Object.keys(errors).length} ${Object.keys(errors).length === 1 ? "issue" : "issues"} before searching:`,
                    `يُرجى تصحيح ${Object.keys(errors).length === 1 ? "خطأ واحد" : `${Object.keys(errors).length} أخطاء`} قبل البحث:`,
                  )}
                </p>
                <ul className="mt-1 list-disc ps-5">
                  {fieldNames
                    .filter((n) => errors[n])
                    .map((n) => (
                      <li key={n}>{errors[n]}</li>
                    ))}
                </ul>
              </div>
            )}

            {/* From / swap / To */}
            <div className="flex flex-col gap-3">
              <StationCombobox
                name="from"
                label={t("home:planner.from")}
                placeholder={t("home:planner.fromPlaceholder")}
                helper={t("home:planner.fromHelper")}
                value={from}
                onChange={handleFieldChange("from", setFrom)}
                required
                error={errors.from}
              />
              <div className="flex justify-center">
                <button
                  type="button"
                  aria-label={t("home:planner.swap")}
                  onClick={() => {
                    setFrom(to);
                    setTo(from);
                  }}
                  className="press-scale group flex size-10 items-center justify-center rounded-full border-[1.5px] border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] shadow-[0_2px_3px_rgba(0,0,0,0.12)] hover:border-[color:var(--color-border-accent)] hover:shadow-[0_6px_18px_rgba(13,31,60,0.14)]"
                >
                  <ArrowUpDown
                    className="icon-wiggle size-[18px] text-[color:var(--color-text-brand)]"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <StationCombobox
                name="to"
                label={t("home:planner.to")}
                placeholder={t("home:planner.toPlaceholder")}
                helper={t("home:planner.toHelper")}
                value={to}
                onChange={handleFieldChange("to", setTo)}
                required
                error={errors.to}
              />
            </div>

            <PlannerDateField
              name="date"
              label={t("home:planner.date")}
              value={date}
              onChange={handleFieldChange("date", setDate)}
              helper={t("home:planner.dateHelper")}
              required
              min={todayISO()}
              error={errors.date}
            />
            {trip === "return" && (
              <PlannerDateField
                name="returnDate"
                label={t("home:planner.returnDate")}
                value={returnDate}
                onChange={handleFieldChange("returnDate", setReturnDate)}
                helper={t("home:planner.returnDateHelper")}
                required
                min={date || todayISO()}
                error={errors.returnDate}
              />
            )}
            <PlannerField
              name="passengers"
              label={t("home:planner.passengers")}
              type="number"
              min={1}
              max={9}
              icon={
                <Users
                  className="size-[18px] text-[color:var(--color-text-brand)]"
                  aria-hidden="true"
                />
              }
              value={passengers}
              onChange={handleFieldChange("passengers", setPassengers)}
              helper={t("home:planner.passengersHelper")}
              required
              error={errors.passengers}
            />

            {trip === "one" && (
              <button
                type="button"
                onClick={() => setTrip("return")}
                className="press-scale group flex h-11 items-center gap-2 rounded-lg border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-background-surface)] px-3 text-sm font-semibold text-[color:var(--color-text-price-accent)] hover:border-[color:var(--color-border-accent)] hover:bg-[color:var(--color-background-elevated)]"
              >
                <Plus className="icon-pop size-4" aria-hidden="true" />{" "}
                {t("home:planner.addReturn")}
              </button>
            )}

            <button
              type="submit"
              className="cta-glow press-scale group flex h-14 items-center justify-center gap-2 rounded-[10px] bg-[color:var(--color-brand-secondary)] text-[18px] font-semibold text-[color:var(--color-interactive-cta-text)] shadow-[0_4px_16px_rgba(200,144,42,0.35)] hover:brightness-105"
            >
              {t("home:planner.submit")} <Search className="icon-pop size-5" />
            </button>

            <p className="text-center text-[13px] text-[color:var(--color-text-price-accent)]">
              🔒 {t("home:planner.trustline")}
            </p>
            <LocaleLink
              to="/accessibility"
              className="link-underline mx-auto text-center text-[13px] font-semibold text-[color:var(--color-text-price-accent)]"
            >
              {t("home:planner.accessibility")} →
            </LocaleLink>
          </div>
        </form>
      </div>
    </section>
  );
}

/* Form Helper Components */

function PlannerField({
  name,
  label,
  icon,
  placeholder,
  value,
  helper,
  onChange,
  type = "text",
  required,
  min,
  max,
  autoComplete,
  error,
  list,
}: {
  name?: string;
  label: string;
  icon: React.ReactNode;
  placeholder?: string;
  value?: string;
  helper: string;
  onChange?: (v: string) => void;
  type?: string;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  autoComplete?: string;
  error?: string;
  list?: string;
}) {
  const inputId = useId();
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const invalid = Boolean(error);
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-[color:var(--color-text-brand)]"
      >
        {label}
        {required && (
          <>
            <span
              aria-hidden="true"
              className="ms-0.5 text-[color:var(--color-status-error-vivid)]"
            >
              *
            </span>
            <span className="sr-only"> required</span>
          </>
        )}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
          {icon}
        </span>
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          min={min}
          max={max}
          autoComplete={autoComplete}
          list={list}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-describedby={invalid ? `${errorId} ${helperId}` : helperId}
          className={`field-interaction h-12 w-full rounded-lg border bg-[color:var(--color-background-elevated)] ps-10 pe-3 text-[15px] text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-placeholder)] ${
            invalid
              ? "border-[color:var(--color-status-error-vivid)] ring-2 ring-[color:var(--color-status-error-vivid)]/40"
              : "border-[color:var(--color-border-default)]"
          }`}
        />
      </div>
      {invalid && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-xs font-semibold text-[color:var(--color-status-error)]"
        >
          <AlertTriangle className="mt-[1px] size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
      <p id={helperId} className="text-xs text-[color:var(--color-text-secondary)]">
        {helper}
      </p>
    </div>
  );
}

function PlannerDateField({
  name,
  label,
  value,
  onChange,
  helper,
  required,
  min,
  error,
}: {
  name?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper: string;
  required?: boolean;
  min?: string;
  error?: string;
}) {
  const inputId = useId();
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const invalid = Boolean(error);
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation("home");
  const selectedDate = value ? parseISO(value) : undefined;
  const minDate = min ? parseISO(min) : undefined;
  const dateLabel = selectedDate
    ? new Intl.DateTimeFormat(i18n.language, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(selectedDate)
    : t("planner.selectDate");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-[color:var(--color-text-brand)]"
      >
        {label}
        {required && (
          <>
            <span
              aria-hidden="true"
              className="ms-0.5 text-[color:var(--color-status-error-vivid)]"
            >
              *
            </span>
            <span className="sr-only"> required</span>
          </>
        )}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={inputId}
            type="button"
            name={name}
            aria-invalid={invalid || undefined}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-describedby={invalid ? `${errorId} ${helperId}` : helperId}
            className={cn(
              "field-interaction group flex h-12 w-full items-center gap-2 rounded-lg border bg-[color:var(--color-background-elevated)] ps-3 pe-3 text-start text-[15px] text-[color:var(--color-text-primary)]",
              invalid
                ? "border-[color:var(--color-status-error-vivid)] ring-2 ring-[color:var(--color-status-error-vivid)]/40"
                : "border-[color:var(--color-border-default)]",
            )}
          >
            <Calendar
              className="icon-pop size-[18px] shrink-0 text-[color:var(--color-text-brand)]"
              aria-hidden="true"
            />
            <span
              className={cn(
                "flex-1 truncate",
                !selectedDate && "text-[color:var(--color-text-placeholder)]",
              )}
            >
              {dateLabel}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto rounded-xl border-2 border-[color:var(--color-border-brand)] bg-[color:var(--color-background-elevated)] p-0 shadow-[0_16px_40px_rgba(13,31,60,0.18)]"
          align="start"
          sideOffset={8}
        >
          <CalendarPicker
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              if (d) {
                onChange(format(d, "yyyy-MM-dd"));
                setOpen(false);
              }
            }}
            disabled={minDate ? { before: minDate } : undefined}
            defaultMonth={selectedDate ?? minDate}
            initialFocus
            className={cn("pointer-events-auto p-4 [--cell-size:2.5rem]")}
            classNames={{
              caption_label: "text-sm font-semibold text-[color:var(--color-text-brand)]",
              weekday:
                "text-[0.75rem] font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)] flex-1 select-none",
              day: "group/day relative aspect-square h-full w-full select-none p-0 text-center text-[color:var(--color-text-primary)]",
              today:
                "rounded-md ring-1 ring-inset ring-[color:var(--color-brand-secondary)] text-[color:var(--color-text-brand)] font-semibold",
              outside: "text-[color:var(--color-text-placeholder)]",
              disabled: "text-[color:var(--color-text-placeholder)] opacity-50",
            }}
          />
        </PopoverContent>
      </Popover>
      {invalid && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-xs font-semibold text-[color:var(--color-status-error)]"
        >
          <AlertTriangle className="mt-[1px] size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
      <p id={helperId} className="text-xs text-[color:var(--color-text-secondary)]">
        {helper}
      </p>
    </div>
  );
}
