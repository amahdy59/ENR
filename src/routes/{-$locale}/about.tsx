import { createFileRoute } from "@tanstack/react-router";
import { StubPage, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/about")({
  head: stubHead(
    "About ENR",
    "About Egyptian National Railways — history, network and mission.",
    "/about",
    "عن الهيئة القومية لسكك حديد مصر",
    "تعرّف على تاريخ الهيئة القومية لسكك حديد مصر وشبكتها ورسالتها.",
  ),
  component: AboutPage,
});

function AboutPage() {
  const bi = useBi();
  return (
    <StubPage
      eyebrow={bi("Company", "عن الهيئة")}
      title={bi("About Egyptian National Railways", "عن الهيئة القومية لسكك حديد مصر")}
      subtitle={bi(
        "Connecting Egypt by rail since 1854.",
        "نربط مصر بالسكك الحديدية منذ عام 1854.",
      )}
    >
      <p className="max-w-3xl text-sm text-[color:var(--color-text-secondary)]">
        {bi(
          "Egyptian National Railways operates one of the oldest rail networks in the world, serving over 500 million passengers each year across 350+ stations from the Mediterranean coast to Aswan.",
          "تُشغّل الهيئة القومية لسكك حديد مصر واحدة من أقدم شبكات السكك الحديدية في العالم، وتخدم أكثر من 500 مليون راكب سنوياً عبر أكثر من 350 محطة تمتد من ساحل البحر المتوسط وحتى أسوان.",
        )}
      </p>
    </StubPage>
  );
}
