/**
 * Progress indicator for multi-step flows (booking, onboarding).
 * Extracted from class/passenger/payment/confirmation where the same
 * stepper was inlined four times.
 */
import { Check } from "lucide-react";

export type Step = {
  label: string;
  sub?: string;
  state: "done" | "current" | "todo";
};

export function PageStepper({ steps, statusLabel }: { steps: Step[]; statusLabel?: string }) {
  const currentIdx = Math.max(
    steps.findIndex((s) => s.state === "current"),
    0,
  );
  const progressPct = ((currentIdx + 0.5) / steps.length) * 100;

  return (
    <div
      className="border-b border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)]"
      role="navigation"
      aria-label={statusLabel ?? "Progress"}
    >
      <ol className="mx-auto flex max-w-7xl items-start justify-between gap-2 px-6 py-6">
        <div className="pointer-events-none absolute" aria-hidden="true" />
        {steps.map((s, i) => {
          const isCurrent = s.state === "current";
          const isDone = s.state === "done";
          return (
            <li
              key={s.label}
              className="relative flex flex-1 flex-col items-center text-center"
              aria-current={isCurrent ? "step" : undefined}
            >
              {i < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute top-4 h-[2px] start-1/2 end-[-50%] bg-[color:var(--color-border-default)]"
                />
              )}
              {i < steps.length - 1 && isDone && (
                <div
                  aria-hidden="true"
                  className="absolute top-4 h-[2px] start-1/2 end-[-50%] bg-[color:var(--color-brand-primary)]"
                />
              )}
              <div
                className={
                  isCurrent
                    ? "z-10 flex size-8 items-center justify-center rounded-full bg-[color:var(--color-interactive-cta)] text-[13px] font-semibold text-[color:var(--color-text-cta)] ring-4 ring-[color:var(--color-interactive-cta)]/25"
                    : isDone
                      ? "z-10 flex size-8 items-center justify-center rounded-full bg-[color:var(--color-brand-primary)] text-[13px] font-semibold text-[color:var(--color-text-inverse)]"
                      : "z-10 flex size-8 items-center justify-center rounded-full border-2 border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] text-[13px] font-semibold text-[color:var(--color-text-tertiary)]"
                }
              >
                {isDone ? <Check className="size-4" aria-hidden="true" /> : i + 1}
              </div>
              <div
                className={`mt-2 text-[13px] font-semibold ${
                  isCurrent ? "text-[color:var(--color-text-cta)]" : "text-[color:var(--color-text-primary)]"
                }`}
              >
                {s.label}
              </div>
              {s.sub && (
                <div
                  className={`text-[11px] ${
                    isCurrent
                      ? "text-[color:var(--color-text-cta)]"
                      : "text-[color:var(--color-text-tertiary)]"
                  }`}
                >
                  {s.sub}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {statusLabel && (
        <div
          className="pb-4 text-center text-[12px] font-medium text-[color:var(--color-text-cta)]"
          aria-live="polite"
        >
          <div className="sr-only">Progress: </div>
          <div className="mx-auto h-1 w-32 overflow-hidden rounded-full bg-[color:var(--color-background-muted)]">
            <div
              className="h-full rounded-full bg-[color:var(--color-interactive-cta)]"
              style={{ width: `${progressPct}%` }}
              aria-hidden="true"
            />
          </div>
          <p className="mt-2">{statusLabel}</p>
        </div>
      )}
    </div>
  );
}
