import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AlertTriangle, MapPin, X } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { searchStations, type Station } from "@/lib/stations";
import { useLocale } from "@/i18n/locale-context";
import { cn } from "@/lib/utils";

/**
 * Accessible station autocomplete (WAI-ARIA 1.2 combobox pattern).
 * Styled with ENR design tokens; works in EN and AR (searches both name
 * fields, city, and code). Not using native <datalist> so we control
 * appearance and behaviour across browsers.
 */
export function StationCombobox({
  name,
  label,
  value,
  onChange,
  placeholder,
  helper,
  required,
  error,
  excludeId,
}: {
  name?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helper: string;
  required?: boolean;
  error?: string;
  /** Optional station id to hide from suggestions (e.g. the other endpoint). */
  excludeId?: string;
}) {
  const { locale } = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const inputId = useId();
  const listId = `${inputId}-list`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const invalid = Boolean(error);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<Station[]>(() => {
    const list = searchStations(value, 8);
    return excludeId ? list.filter((s) => s.id !== excludeId) : list;
  }, [value, excludeId]);

  useEffect(() => {
    setActive(0);
  }, [value, open]);

  const commit = (s: Station) => {
    onChange(s.name[locale]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && results[active]) {
        e.preventDefault();
        commit(results[active]);
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
      }
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setActive(Math.max(results.length - 1, 0));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold text-[color:var(--color-text-brand)]">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ms-0.5 text-[color:var(--color-status-error-vivid)]">*</span>
            <span className="sr-only"> required</span>
          </>
        )}
      </label>

      <Popover open={open && results.length > 0} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
              <MapPin className="size-[18px] text-[color:var(--color-text-brand)]" aria-hidden="true" />
            </span>
            <input
              ref={inputRef}
              id={inputId}
              name={name}
              type="text"
              role="combobox"
              autoComplete="off"
              spellCheck={false}
              aria-autocomplete="list"
              aria-expanded={open && results.length > 0}
              aria-controls={listId}
              aria-activedescendant={open && results[active] ? `${listId}-opt-${active}` : undefined}
              aria-invalid={invalid || undefined}
              aria-required={required || undefined}
              aria-describedby={invalid ? `${errorId} ${helperId}` : helperId}
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              className={cn(
                "field-interaction h-12 w-full rounded-lg border bg-[color:var(--color-background-elevated)] ps-10 pe-9 text-[15px] text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-placeholder)]",
                invalid
                  ? "border-[color:var(--color-status-error-vivid)] ring-2 ring-[color:var(--color-status-error-vivid)]/40"
                  : "border-[color:var(--color-border-default)]",
              )}
            />
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  inputRef.current?.focus();
                  setOpen(true);
                }}
                aria-label={locale === "ar" ? "مسح" : "Clear"}
                className="press-scale absolute end-2 top-1/2 -translate-y-1/2 grid size-7 place-items-center rounded-full text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-background-surface)] hover:text-[color:var(--color-text-brand)]"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </PopoverAnchor>

        <PopoverContent
          align="start"
          sideOffset={6}
          dir={dir}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-[--radix-popover-trigger-width] min-w-[280px] max-h-[320px] overflow-auto rounded-xl border-2 border-[color:var(--color-border-brand)] bg-[color:var(--color-background-elevated)] p-1 shadow-[0_16px_40px_rgba(13,31,60,0.18)]"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <ul id={listId} role="listbox" aria-label={label} className="flex flex-col">
            {results.map((s, i) => {
              const isActive = i === active;
              return (
                <li
                  key={s.id}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commit(s);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "group flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5",
                    isActive
                      ? "bg-[color:var(--color-background-nav-bar)] text-white"
                      : "text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-background-surface)]",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <MapPin
                      className={cn(
                        "icon-pop size-4 shrink-0",
                        isActive ? "text-[color:var(--color-brand-secondary)]" : "text-[color:var(--color-text-brand)]",
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate text-sm font-semibold">{s.name[locale]}</span>
                    {s.hub && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                          isActive
                            ? "bg-[color:var(--color-brand-secondary)] text-[color:var(--color-interactive-cta-text)]"
                            : "bg-[color:var(--color-background-warm)] text-[color:var(--color-text-price-accent)]",
                        )}
                      >
                        {locale === "ar" ? "رئيسية" : "Hub"}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-xs",
                      isActive ? "text-white/80" : "text-[color:var(--color-text-secondary)]",
                    )}
                  >
                    {s.city[locale]} · {s.code}
                  </span>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>

      {invalid && (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-xs font-semibold text-[color:var(--color-status-error)]">
          <AlertTriangle className="mt-[1px] size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
      <p id={helperId} className="text-xs text-[color:var(--color-text-secondary)]">{helper}</p>
    </div>
  );
}
