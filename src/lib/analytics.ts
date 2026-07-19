/**
 * Consent-gated analytics facade.
 *
 * The site ships without any third-party analytics wired up. This module
 * gives feature code a single, stable API to call — `track("event_name",
 * { ... })` — and defers the actual transport (Plausible, PostHog, GA4,
 * Cloudflare Web Analytics, etc.) to whichever provider the team picks
 * later. Until then, events are dropped in production and mirrored to
 * the console in dev so we can see instrumentation working without
 * leaking data.
 *
 * The `enr.cookie-consent` localStorage flag is written by
 * `CookieConsent.tsx`. Analytics stays off until the user accepts.
 */

const CONSENT_KEY = "enr.cookie-consent";

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

/** Fire an analytics event. No-ops on server, without consent, or without a provider. */
export function track(event: string, props?: AnalyticsProps): void {
  if (typeof window === "undefined") return;
  if (!hasConsent()) return;
  if (import.meta.env.DEV) {
    // Visible in the browser console while building; harmless in production.
    console.debug("[analytics]", event, props ?? {});
  }
  // Provider integration goes here. Example (Plausible):
  //   window.plausible?.(event, { props });
}

/** Fire a page-view event on route change. Call from a route effect. */
export function trackPageView(path: string): void {
  track("pageview", { path });
}
