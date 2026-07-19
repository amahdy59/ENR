import { Link, useNavigate } from "@tanstack/react-router";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { useLocale } from "./locale-context";
import type { Locale } from "./config";
import { DEFAULT_LOCALE } from "./config";

/**
 * Convert an English-style path (e.g. "/about") into a locale-aware target.
 * English (default) → no prefix. Arabic → "/ar/about".
 */
export function localizedPath(to: string, locale: Locale): string {
  const clean = to.startsWith("/") ? to : `/${to}`;
  if (locale === DEFAULT_LOCALE) return clean;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}

export type LocaleLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  targetLocale?: Locale;
  activeProps?: { className?: string };
  activeOptions?: { exact?: boolean; includeHash?: boolean; includeSearch?: boolean };
  children?: ReactNode;
};

/**
 * Drop-in replacement for TanStack's <Link> that transparently prepends
 * the current locale to a plain path prop. We deliberately widen typing
 * around TanStack's typed route table because the localized target is
 * computed at runtime.
 */
export const LocaleLink = forwardRef<HTMLAnchorElement, LocaleLinkProps>(
  function LocaleLink({ to, targetLocale, ...rest }, ref) {
    const { locale } = useLocale();
    const effective = targetLocale ?? locale;
    const href = localizedPath(to, effective);
    const LinkAny = Link as unknown as React.ComponentType<Record<string, unknown>>;
    return <LinkAny ref={ref} to={href} {...rest} />;
  },
);

export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { locale } = useLocale();
  return (to: string) => {
    const href = localizedPath(to, locale);
    return navigate({ to: href as never });
  };
}
