import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { StationCombobox } from "@/components/site/StationCombobox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBi } from "@/i18n/bi";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/i18n/LocaleLink";
import { STATIONS } from "@/lib/stations";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/timetable/")({
  head: stubHead(
    "Timetable",
    "Search train timetables across the ENR network.",
    "/timetable",
    "مواعيد القطارات",
    "ابحث في مواعيد القطارات عبر شبكة الهيئة القومية لسكك حديد مصر.",
  ),
  component: TimetableIndex,
});

function TimetableIndex() {
  const bi = useBi();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(today);
  const [openDate, setOpenDate] = useState(false);
  const [errors, setErrors] = useState<{ from?: string; to?: string }>({});

  const fromId = useMemo(() => STATIONS.find((s) => s.name.en === from || s.name.ar === from)?.id, [from]);
  const toId = useMemo(() => STATIONS.find((s) => s.name.en === to || s.name.ar === to)?.id, [to]);
  const selectedDate = date ? parseISO(date) : undefined;
  const minDate = parseISO(today);
  const dateLabel = selectedDate
    ? new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(selectedDate)
    : bi("Select date", "اختر التاريخ");

  return (
    <StubPage
      eyebrow={bi("Plan", "خطط")}
      title={bi("Timetables", "مواعيد القطارات")}
      subtitle={bi("Search timetables by station, line or date.", "ابحث في المواعيد حسب المحطة أو الخط أو التاريخ.")}
      breadcrumbs={[{ label: bi("Timetables", "المواعيد") }]}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const nextErrors: { from?: string; to?: string } = {};
          if (!from.trim()) nextErrors.from = bi("Please pick a departure station.", "من فضلك اختر محطة المغادرة.");
          if (!to.trim()) nextErrors.to = bi("Please pick an arrival station.", "من فضلك اختر محطة الوصول.");
          setErrors(nextErrors);
          if (Object.keys(nextErrors).length) return;
          navigate({ to: localizedPath("/search", locale) as never, search: { from, to, date } as never });
        }}
        noValidate
        className="grid grid-cols-1 gap-4 rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-5 md:grid-cols-2"
      >
        <StationCombobox
          name="from"
          label={bi("From", "من")}
          value={from}
          onChange={(v) => { setFrom(v); if (errors.from) setErrors((p) => ({ ...p, from: undefined })); }}
          placeholder={bi("Cairo, Alexandria…", "القاهرة، الإسكندرية…")}
          helper={bi("Type at least two letters to search.", "اكتب حرفين على الأقل للبحث.")}
          required
          error={errors.from}
          excludeId={toId}
        />
        <StationCombobox
          name="to"
          label={bi("To", "إلى")}
          value={to}
          onChange={(v) => { setTo(v); if (errors.to) setErrors((p) => ({ ...p, to: undefined })); }}
          placeholder={bi("Luxor, Aswan…", "الأقصر، أسوان…")}
          helper={bi("Type at least two letters to search.", "اكتب حرفين على الأقل للبحث.")}
          required
          error={errors.to}
          excludeId={fromId}
        />

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label htmlFor="tt-date" className="text-sm font-semibold text-[color:var(--color-text-brand)]">
            {bi("Travel date", "تاريخ السفر")}
          </label>
          <Popover open={openDate} onOpenChange={setOpenDate}>
            <PopoverTrigger asChild>
              <button
                id="tt-date"
                type="button"
                aria-haspopup="dialog"
                aria-expanded={openDate}
                className="field-interaction flex h-12 w-full items-center gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] px-3 text-start text-[15px] text-[color:var(--color-text-primary)]"
              >
                <CalendarIcon className="icon-pop size-[18px] text-[color:var(--color-text-brand)]" aria-hidden="true" />
                <span className="flex-1 truncate">{dateLabel}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="w-auto rounded-xl border-2 border-[color:var(--color-border-brand)] bg-[color:var(--color-background-elevated)] p-0 shadow-[0_16px_40px_rgba(13,31,60,0.18)]"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => {
                  if (d) {
                    setDate(format(d, "yyyy-MM-dd"));
                    setOpenDate(false);
                  }
                }}
                disabled={{ before: minDate }}
                defaultMonth={selectedDate ?? minDate}
                initialFocus
                className={cn("pointer-events-auto p-4 [--cell-size:2.5rem]")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <button
          type="submit"
          className="press-scale inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[color:var(--color-brand-primary)] text-sm font-semibold text-white md:col-span-2"
        >
          <Search className="size-4" aria-hidden="true" />
          {bi("Search timetable", "ابحث في المواعيد")}
        </button>
      </form>
    </StubPage>
  );
}
