import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/network/map")({
  head: stubHead(
    "Network map",
    "Interactive map of the Egyptian National Railways network.",
    "/network/map",
    "خريطة الشبكة",
    "خريطة تفاعلية لشبكة الهيئة القومية لسكك حديد مصر.",
  ),
  component: NetworkMapPage,
});

function NetworkMapPage() {
  const bi = useBi();
  return (
    <StubPage
      eyebrow={bi("Network", "الشبكة")}
      title={bi("Network map", "خريطة الشبكة")}
      subtitle={bi(
        "Explore ENR's national rail network — Cairo hub, Nile corridor, Delta and coastal lines.",
        "استكشف شبكة السكك الحديدية القومية — محور القاهرة، ممر النيل، الدلتا، والخطوط الساحلية.",
      )}
    >
      <div className="grid h-[480px] place-items-center rounded-2xl border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-background-surface)] text-sm text-[color:var(--color-text-tertiary)]">
        {bi("Interactive network map coming soon", "الخريطة التفاعلية للشبكة قريباً")}
      </div>
    </StubPage>
  );
}
