/**
 * Shared feedback-state primitives: Loading (skeleton), Empty, Error.
 * Every route with async or list content should render one of these
 * instead of a blank screen or a raw spinner.
 */
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

type StateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function LoadingState({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex flex-col items-center justify-center gap-3 py-16 text-[color:var(--color-text-secondary)]"
    >
      <Loader2 className="size-6 animate-spin" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-[color:var(--color-background-muted)] ${className}`}
    />
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: StateProps) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-12 text-center">
      <Icon className="mb-3 size-8 text-[color:var(--color-text-tertiary)]" aria-hidden="true" />
      <h3 className="text-base font-bold text-[color:var(--color-text-brand)]">{title}</h3>
      {description && (
        <p className="mt-1 max-w-md text-sm text-[color:var(--color-text-secondary)]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ icon: Icon = AlertCircle, title, description, action }: StateProps) {
  return (
    <div
      role="alert"
      className="grid place-items-center rounded-2xl border border-[color:var(--color-status-error)] bg-[color:var(--color-status-error-bg)] p-12 text-center"
    >
      <Icon className="mb-3 size-8 text-[color:var(--color-status-error-vivid)]" aria-hidden="true" />
      <h3 className="text-base font-bold text-[color:var(--color-text-primary)]">{title}</h3>
      {description && (
        <p className="mt-1 max-w-md text-sm text-[color:var(--color-text-secondary)]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
