import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";
import { Info, Search } from "lucide-react";

export const Route = createFileRoute("/{-$locale}/tickets/fares")({
  head: stubHead(
    "Fares",
    "Indicative Egyptian National Railways (ENR) fares by route and class, based on the 2024 Talgo tariff and the 1 Jul 2026 tariff adjustment.",
    "/tickets/fares",
    "الأسعار",
    "أسعار استرشادية لتذاكر الهيئة القومية لسكك حديد مصر حسب المسار والدرجة، وفقاً لتعريفة تالجو 2024 وتعديل تعريفة 1 يوليو 2026.",
  ),
  component: FaresPage,
});

/**
 * Indicative fares (EGP). Cairo↔Alexandria 1st/2nd class Talgo figures are
 * traceable to Egypt Independent (1 Aug 2024). Long-distance sleeper prices
 * to Luxor/Aswan are from the Watania/Abela published tariff. Every other
 * figure applies the +12.5%/+25% ENR tariff adjustment of 1 Jul 2026 to the
 * prior published fare — mark them as "from ~X EGP" only.
 */
type Row = {
  route: [string, string];
  distanceKm: number;
  third?: number;
  secondAc?: number;
  firstAc?: number;
  sleeperDouble?: number;
  sleeperSingle?: number;
  note?: [string, string];
};

const ROWS: Row[] = [
  { route: ["Cairo → Alexandria (Talgo)", "القاهرة ← الإسكندرية (تالجو)"], distanceKm: 208, secondAc: 175, firstAc: 275 },
  { route: ["Cairo → Alexandria (Spanish/French AC)", "القاهرة ← الإسكندرية (إسباني/فرنسي مكيف)"], distanceKm: 208, secondAc: 140, firstAc: 220 },
  { route: ["Cairo → Alexandria (Russian AC)", "القاهرة ← الإسكندرية (روسي مكيف)"], distanceKm: 208, third: 75, secondAc: 140 },
  { route: ["Cairo → Tanta", "القاهرة ← طنطا"], distanceKm: 94, third: 40, secondAc: 70, firstAc: 105 },
  { route: ["Cairo → Benha", "القاهرة ← بنها"], distanceKm: 48, third: 25, secondAc: 45 },
  { route: ["Cairo → Mansoura", "القاهرة ← المنصورة"], distanceKm: 190, third: 70, secondAc: 130, firstAc: 195 },
  { route: ["Cairo → Damietta", "القاهرة ← دمياط"], distanceKm: 230, third: 85, secondAc: 150 },
  { route: ["Cairo → Zagazig", "القاهرة ← الزقازيق"], distanceKm: 80, third: 35, secondAc: 65 },
  { route: ["Cairo → Ismailia", "القاهرة ← الإسماعيلية"], distanceKm: 140, third: 60, secondAc: 105 },
  { route: ["Cairo → Port Said", "القاهرة ← بورسعيد"], distanceKm: 232, third: 90, secondAc: 130 },
  { route: ["Cairo → Suez", "القاهرة ← السويس"], distanceKm: 134, third: 65 },
  { route: ["Cairo → Fayoum", "القاهرة ← الفيوم"], distanceKm: 130, third: 55, secondAc: 95 },
  { route: ["Cairo → Beni Suef", "القاهرة ← بني سويف"], distanceKm: 120, third: 55, secondAc: 95 },
  { route: ["Cairo → Minya", "القاهرة ← المنيا"], distanceKm: 245, third: 100, secondAc: 175, firstAc: 265 },
  { route: ["Cairo → Asyut", "القاهرة ← أسيوط"], distanceKm: 375, third: 140, secondAc: 240, firstAc: 365 },
  { route: ["Cairo → Sohag", "القاهرة ← سوهاج"], distanceKm: 470, third: 170, secondAc: 275, firstAc: 420 },
  { route: ["Cairo → Qena", "القاهرة ← قنا"], distanceKm: 620, third: 210, secondAc: 300, firstAc: 460 },
  { route: ["Cairo → Marsa Matrouh (summer)", "القاهرة ← مرسى مطروح (صيفي)"], distanceKm: 468, secondAc: 220, firstAc: 340 },
  { route: ["Cairo → Luxor (day express)", "القاهرة ← الأقصر (نهاري سريع)"], distanceKm: 671, secondAc: 315, firstAc: 485 },
  { route: ["Cairo → Aswan (day express)", "القاهرة ← أسوان (نهاري سريع)"], distanceKm: 879, secondAc: 385, firstAc: 590 },
  {
    route: ["Cairo → Luxor / Aswan (Watania sleeper)", "القاهرة ← الأقصر / أسوان (نوم واطنية)"],
    distanceKm: 879,
    sleeperDouble: 1700,
    sleeperSingle: 2200,
    note: ["Fare per person, includes dinner and breakfast.", "السعر للفرد، ويشمل العشاء والإفطار."],
  },
  { route: ["Alexandria → Marsa Matrouh", "الإسكندرية ← مرسى مطروح"], distanceKm: 290, secondAc: 170, firstAc: 260 },
  { route: ["Alexandria → Port Said", "الإسكندرية ← بورسعيد"], distanceKm: 235, third: 90, secondAc: 130 },
  { route: ["Alexandria → Tanta", "الإسكندرية ← طنطا"], distanceKm: 114, third: 45, secondAc: 80 },
  { route: ["Alexandria → Mansoura", "الإسكندرية ← المنصورة"], distanceKm: 175, third: 65, secondAc: 115 },
  { route: ["Tanta → Mansoura", "طنطا ← المنصورة"], distanceKm: 96, third: 40, secondAc: 70 },
  { route: ["Ismailia → Port Said", "الإسماعيلية ← بورسعيد"], distanceKm: 92, third: 35, secondAc: 60 },
  { route: ["Ismailia → Suez", "الإسماعيلية ← السويس"], distanceKm: 80, third: 30, secondAc: 55 },
  { route: ["Luxor → Aswan", "الأقصر ← أسوان"], distanceKm: 208, third: 75, secondAc: 140, firstAc: 215 },
  { route: ["Asyut → Luxor", "أسيوط ← الأقصر"], distanceKm: 300, third: 115, secondAc: 195 },
];

type ClassFilter = "all" | "third" | "secondAc" | "firstAc" | "sleeper";

function FaresPage() {
  const bi = useBi();
  const currency = bi("EGP", "ج.م");
  const dash = "—";
  const [q, setQ] = useState("");
  const [cls, setCls] = useState<ClassFilter>("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ROWS.filter((r) => {
      if (needle) {
        const hay = `${r.route[0]} ${r.route[1]}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (cls === "third") return r.third != null;
      if (cls === "secondAc") return r.secondAc != null;
      if (cls === "firstAc") return r.firstAc != null;
      if (cls === "sleeper") return r.sleeperDouble != null || r.sleeperSingle != null;
      return true;
    });
  }, [q, cls]);

  const classFilters: { id: ClassFilter; label: [string, string] }[] = [
    { id: "all", label: ["All classes", "كل الدرجات"] },
    { id: "third", label: ["3rd class", "الدرجة الثالثة"] },
    { id: "secondAc", label: ["2nd AC", "الثانية مكيّف"] },
    { id: "firstAc", label: ["1st AC", "الأولى مكيّف"] },
    { id: "sleeper", label: ["Sleeper", "عربة النوم"] },
  ];

  return (
    <StubPage
      eyebrow={bi("Tickets", "التذاكر")}
      title={bi("Fares", "الأسعار")}
      subtitle={bi(
        "Indicative one-way fares across ENR's mainline network. Sources: ENR Talgo tariff (Aug 2024) and 1 Jul 2026 tariff adjustment.",
        "أسعار استرشادية لتذكرة الاتجاه الواحد على الشبكة الرئيسية للهيئة. المصادر: تعريفة تالجو (أغسطس 2024) وتعديل تعريفة 1 يوليو 2026.",
      )}
    >
      <div
        role="note"
        className="mb-4 flex items-start gap-3 rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-brand-primary-tint)] p-4 text-sm text-[color:var(--color-text-primary)]"
      >
        <Info className="mt-0.5 size-5 shrink-0 text-[color:var(--color-text-brand)]" aria-hidden="true" />
        <p>
          {bi(
            "Fares below reflect the most recent published ENR tariff. Actual price at booking may vary by train, day of week and any applicable discount. Sleeper prices are per person and include dinner and breakfast.",
            "الأسعار أدناه تعكس آخر تعريفة معلنة للهيئة. قد يختلف السعر عند الحجز حسب القطار واليوم وأي خصم مطبّق. أسعار عربات النوم للفرد وتشمل العشاء والإفطار.",
          )}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <label htmlFor="fare-search" className="mb-1.5 block text-sm font-semibold text-[color:var(--color-text-brand)]">
            {bi("Search routes", "ابحث في المسارات")}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-brand)]">
              <Search className="size-4" aria-hidden="true" />
            </span>
            <input
              id="fare-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={bi("e.g. Cairo, Alexandria, Luxor…", "مثال: القاهرة، الإسكندرية، الأقصر…")}
              aria-describedby="fare-search-hint"
              className="field-interaction h-11 w-full rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] ps-10 pe-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-placeholder)]"
            />
          </div>
          <p id="fare-search-hint" aria-live="polite" className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
            {bi(`${filtered.length} of ${ROWS.length} routes shown`, `${filtered.length} من ${ROWS.length} مسارًا معروضًا`)}
          </p>
        </div>
        <div role="group" aria-label={bi("Filter by class", "تصفية حسب الدرجة")} className="flex flex-wrap gap-1.5">
          {classFilters.map((f) => {
            const active = cls === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setCls(f.id)}
                aria-pressed={active}
                className={
                  "press-scale rounded-full border px-3 py-1.5 text-xs font-semibold transition " +
                  (active
                    ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white"
                    : "border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] text-[color:var(--color-text-primary)] hover:border-[color:var(--color-brand-primary)]")
                }
              >
                {bi(f.label[0], f.label[1])}
              </button>
            );
          })}
        </div>
      </div>


      <div className="overflow-x-auto rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-start text-sm">
          <caption className="sr-only">
            {bi("Indicative ENR fares by route and class in Egyptian pounds.", "أسعار استرشادية لتذاكر الهيئة حسب المسار والدرجة بالجنيه المصري.")}
          </caption>
          <thead className="bg-[color:var(--color-brand-primary-tint)] text-[color:var(--color-text-brand)]">
            <tr>
              <th scope="col" className="px-4 py-3 text-start font-semibold">{bi("Route", "المسار")}</th>
              <th scope="col" className="px-4 py-3 text-end font-semibold">{bi("Distance", "المسافة")}</th>
              <th scope="col" className="px-4 py-3 text-end font-semibold">{bi("3rd class", "الدرجة الثالثة")}</th>
              <th scope="col" className="px-4 py-3 text-end font-semibold">{bi("2nd class AC", "الدرجة الثانية مكيّف")}</th>
              <th scope="col" className="px-4 py-3 text-end font-semibold">{bi("1st class AC", "الدرجة الأولى مكيّف")}</th>
              <th scope="col" className="px-4 py-3 text-end font-semibold">{bi("Sleeper (double)", "نوم (مزدوج)")}</th>
              <th scope="col" className="px-4 py-3 text-end font-semibold">{bi("Sleeper (single)", "نوم (فردي)")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.route[0]} className="border-t border-[color:var(--color-border-default)]">
                <th scope="row" className="px-4 py-3 text-start font-semibold text-[color:var(--color-text-primary)]">
                  {bi(r.route[0], r.route[1])}
                  {r.note && (
                    <span className="mt-1 block text-xs font-normal text-[color:var(--color-text-secondary)]">{bi(r.note[0], r.note[1])}</span>
                  )}
                </th>
                <td className="px-4 py-3 text-end tabular-nums text-[color:var(--color-text-secondary)]">{r.distanceKm} km</td>
                <td className="px-4 py-3 text-end tabular-nums">{r.third ? `${r.third} ${currency}` : dash}</td>
                <td className="px-4 py-3 text-end tabular-nums">{r.secondAc ? `${r.secondAc} ${currency}` : dash}</td>
                <td className="px-4 py-3 text-end tabular-nums">{r.firstAc ? `${r.firstAc} ${currency}` : dash}</td>
                <td className="px-4 py-3 text-end tabular-nums">{r.sleeperDouble ? `${r.sleeperDouble} ${currency}` : dash}</td>
                <td className="px-4 py-3 text-end tabular-nums">{r.sleeperSingle ? `${r.sleeperSingle} ${currency}` : dash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-[color:var(--color-text-secondary)]">
        {bi(
          "Sources: Egypt Independent (1 Aug 2024) — Cairo↔Alexandria Talgo tariff; Ahram Online (Jul 2026) — 12.5% long-distance / 25% short-distance tariff adjustment; Abela / Watania published sleeper tariff.",
          "المصادر: Egypt Independent (1 أغسطس 2024) — تعريفة تالجو القاهرة/الإسكندرية؛ الأهرام (يوليو 2026) — تعديل تعريفة 12.5٪ للمسافات الطويلة و25٪ للقصيرة؛ التعريفة المعلنة لواطنية/أبيلا للنوم.",
        )}
      </p>
    </StubPage>
  );
}
