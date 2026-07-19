import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";
import { useAnnounce } from "@/components/site/LiveAnnouncer";
import { TableRowSkeleton } from "@/components/site/Skeletons";

export const Route = createFileRoute("/{-$locale}/timetable/live")({
  head: stubHead(
    "Live departures",
    "Real-time departure board for ENR services.",
    "/timetable/live",
    "المغادرات المباشرة",
    "شاشة المغادرات الحيّة لخدمات الهيئة القومية لسكك حديد مصر.",
  ),
  component: LivePage,
});

type Row = { time: string; dest: string; plat: string; status: string; onTime: boolean };

function LivePage() {
  const bi = useBi();
  const announce = useAnnounce();
  const [tick, setTick] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState<Date | null>(null);

  const rows: Row[] = useMemo(() => [
    { time: "10:15", dest: bi("Alexandria Misr", "محطة مصر بالإسكندرية"), plat: "3", status: bi("On time", "في الموعد"), onTime: true },
    { time: "10:30", dest: bi("Luxor", "الأقصر"), plat: "5", status: bi("On time", "في الموعد"), onTime: true },
    { time: "10:45", dest: bi("Port Said", "بورسعيد"), plat: "7", status: bi("Delayed 8 min", "متأخر 8 دقائق"), onTime: false },
    { time: "11:00", dest: bi("Aswan (sleeper)", "أسوان (قطار نوم)"), plat: "9", status: bi("On time", "في الموعد"), onTime: true },
    { time: "11:15", dest: bi("Mansoura", "المنصورة"), plat: "2", status: bi("On time", "في الموعد"), onTime: true },
  ], [bi, tick]);

  // Simulate initial load and auto-refresh every 60s. Replace with real feed later.
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      setUpdated(new Date());
    }, 400);
    const iv = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, []);

  useEffect(() => {
    if (!loading && updated) {
      announce(bi("Departure board updated", "تم تحديث شاشة المغادرات"));
    }
  }, [tick, loading, updated, announce, bi]);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTick((n) => n + 1);
      setLoading(false);
      setUpdated(new Date());
    }, 300);
  };

  const updatedLabel = updated
    ? updated.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "—";

  return (
    <StubPage
      eyebrow={bi("Live", "مباشر")}
      title={bi("Live departures", "المغادرات المباشرة")}
      subtitle={bi("Cairo Central (Ramses)", "محطة مصر (رمسيس)")}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[color:var(--color-text-secondary)]" aria-live="polite">
          {bi("Updated", "آخر تحديث")}: <span dir="ltr">{updatedLabel}</span>
        </p>
        <button
          type="button"
          onClick={refresh}
          className="press-scale inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text-brand)] hover:bg-[color:var(--color-brand-primary-tint)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-interactive-focus-ring)]"
          aria-label={bi("Refresh departures", "تحديث المغادرات")}
        >
          <RefreshCw className={"size-4 " + (loading ? "animate-spin motion-reduce:animate-none" : "")} aria-hidden="true" />
          {bi("Refresh", "تحديث")}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)]">
        <table className="w-full text-sm">
          <caption className="sr-only">{bi("Live departures from Cairo Central", "المغادرات المباشرة من محطة مصر")}</caption>
          <thead className="bg-[color:var(--color-brand-primary-tint)] text-start">
            <tr>
              <th scope="col" className="px-4 py-3 text-start">{bi("Time", "الوقت")}</th>
              <th scope="col" className="px-4 py-3 text-start">{bi("Destination", "الوجهة")}</th>
              <th scope="col" className="px-4 py-3 text-start">{bi("Platform", "الرصيف")}</th>
              <th scope="col" className="px-4 py-3 text-start">{bi("Status", "الحالة")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                <TableRowSkeleton cols={4} />
                <TableRowSkeleton cols={4} />
                <TableRowSkeleton cols={4} />
              </>
            ) : rows.map((r) => (
              <tr key={r.time} className="border-t border-[color:var(--color-border-default)]">
                <td className="px-4 py-3 font-semibold" dir="ltr">{r.time}</td>
                <td className="px-4 py-3">{r.dest}</td>
                <td className="px-4 py-3" dir="ltr">{r.plat}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                      (r.onTime
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200")
                    }
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[color:var(--color-text-secondary)]">
        {bi(
          "Times are indicative and refresh every minute. Confirm at the station board before boarding.",
          "الأوقات إرشادية وتتحدّث كل دقيقة. يُرجى التأكيد من شاشة المحطة قبل الصعود.",
        )}
      </p>
    </StubPage>
  );
}
