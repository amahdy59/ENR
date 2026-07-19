import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const label = (t("actions.backToTop", { defaultValue: "Back to top" }) as string);

  const handleClick = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Move focus to main landmark for keyboard/AT users
    const main = document.getElementById("main-content");
    if (main) (main as HTMLElement).focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      hidden={!visible}
      className={
        "press-scale fixed bottom-20 end-6 z-50 grid size-12 place-items-center rounded-full " +
        "bg-[color:var(--color-brand-primary)] text-white shadow-lg ring-1 ring-white/10 " +
        "transition-opacity duration-200 hover:bg-[color:var(--color-brand-primary-hover,var(--color-brand-primary))] " +
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-interactive-focus-ring)] " +
        "md:bottom-8 " +
        (visible ? "opacity-100" : "pointer-events-none opacity-0")
      }
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}
