import { ChevronRight, Home } from "lucide-react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useBi } from "@/i18n/bi";

export type Crumb = { label: string; to?: string };

/**
 * Accessible breadcrumbs (WCAG 2.4.8). Renders as <nav aria-label="Breadcrumb">
 * with the current page marked via aria-current="page". Directional chevrons
 * flip in RTL via the shared .rtl-flip utility.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const bi = useBi();
  const home: Crumb = { label: bi("Home", "الرئيسية"), to: "/" };
  const all = [home, ...items];
  return (
    <nav aria-label={bi("Breadcrumb", "مسار التنقل")} className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-[color:var(--color-text-secondary)]">
        {all.map((c, i) => {
          const isLast = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  className="rtl-flip size-3.5 text-[color:var(--color-text-tertiary)]"
                  aria-hidden="true"
                />
              )}
              {isLast || !c.to ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-semibold text-[color:var(--color-text-primary)]"
                >
                  {i === 0 && <Home className="me-1 inline size-3.5" aria-hidden="true" />}
                  {c.label}
                </span>
              ) : (
                <LocaleLink
                  to={c.to}
                  className="link-underline inline-flex items-center gap-1 rounded text-[color:var(--color-text-brand)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-brand-secondary)]"
                >
                  {i === 0 && <Home className="size-3.5" aria-hidden="true" />}
                  {c.label}
                </LocaleLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
