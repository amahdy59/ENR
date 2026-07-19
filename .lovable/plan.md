# Site perfection sweep — staged plan

Doing all of this well in one turn is not realistic (~20+ hrs of work and several external accounts). I'll execute in the order below and stop for input only where genuinely blocked.

## Stage 1 — Ship autonomously now (no external accounts needed)

**Performance**

- Add `vite-imagetools`; convert route/news hero JPGs to AVIF+WebP with `<picture>` fallback.
- `<link rel="preload" as="image" fetchpriority="high">` for the LCP image on `/` (per-locale route head).
- Bundle audit: dynamic-import `stations.generated.ts` / `trips.generated.ts` so the ~500 KB dataset loads only when Search/Stations pages mount, not on the home page.
- Move `Calendar`, `Popover` combobox internals off the initial home bundle where possible.

**SEO**

- `robots.txt` (allow all, sitemap directive).
- Dynamic `sitemap.xml` server route enumerating every EN + AR route + every station.
- Add `<link rel="alternate" hreflang="en|ar|x-default">` and self-referencing `canonical` on every route via a shared `LocaleHead` helper.
- JSON-LD: `Organization` in `__root`, `TrainStation`/`Place` on `stations/$id`, `BreadcrumbList` on deep routes, `WebSite` with `SearchAction` on `/`.
- Run the SEO scanner and clean up the findings.

**A11y**

- Global `aria-live` polite/assertive regions for form-error announcements and route changes.
- Skeleton loaders for station detail, timetable, account (using existing `states.tsx` primitives).
- Audit BackToTop + sticky header vs. mobile tab bar on 375px (adjust spacing, ensure no overlap).

**Print**

- `@media print` stylesheet + `print-only` classes on `confirmation.tsx` (hide chrome, single-page ticket layout with QR/train/passenger blocks).

**Testing**

- Vitest setup + unit tests for `findTrips`, `resolveStationId`, `fares` computation.
- Playwright config + two smoke specs: EN and AR "Cairo → Alexandria → pick class → passenger → payment" flows.

**Empty/loading/error states**

- Add skeleton + empty + error states to stations index, station detail, timetable, account bookings/journeys.

**Legal pages (skeletons only)**

- Privacy, Terms, Refund, Cookie Notice as real routes with proper head/canonical/hreflang, marked "draft — pending legal review", using clear boilerplate structure. Real copy needs your input (see Stage 3).

## Stage 2 — Needs one green light from you (fast)

- **Analytics**: PostHog is free and self-serves; I can wire the SDK + funnel events (`search_submitted`, `results_viewed`, `class_selected`, `passenger_filled`, `payment_started`, `booking_confirmed`) as soon as you paste a project API key via the secret prompt.
- **Error tracking**: Same for Sentry — needs a DSN.

## Stage 3 — Needs product/legal decisions from you

- **Legal copy**: real Privacy/Terms/Refund text. I'll draft, but you need to confirm company legal name, jurisdiction, DPO contact, data retention windows, refund windows before publishing. I won't invent these.
- **Cookie banner**: needs consent categories (essential / analytics / marketing) and whether you want granular controls (GDPR) or a simple accept/dismiss.

## Stage 4 — Deferred (explicitly nice-to-have)

I'll skip these unless you say otherwise, because each is a mini-project:

- **PWA + offline** — the PWA skill is clear it should only be added on explicit ask; installability alone is one afternoon, real offline caching for search is more.
- **Live train status board** — needs a Supabase table + an admin surface to publish delays; belongs in a "real backend" phase.
- **Station Leaflet map** — adds ~150 KB and requires an offline-safe tile strategy; worth it but scope-heavy.
- **Resend notifications** — needs Resend key + verified domain; booking backend must exist first (otherwise there's nothing to email about).
- **Full Lighthouse mobile pass with numeric targets** — worth running after Stage 1 lands so we measure the improved state, not the current one. I'll run it as the final Stage 1 step and iterate on the top 3 opportunities.

## What I need from you to unblock Stage 2/3

1. PostHog project key (free tier) — or say "skip analytics for now".
2. Sentry DSN — or say "skip error tracking for now".
3. Company legal name + jurisdiction + support email for legal pages — or say "publish drafts with `[COMPANY]` placeholders".
4. Cookie consent model: simple banner or granular categories?

## Execution order

I'll start Stage 1 immediately after you approve this plan, in this order (each is one commit so you can review incrementally):

1. Robots + sitemap + hreflang + canonical + JSON-LD
2. Image formats + LCP preload + bundle split
3. A11y (aria-live, skeletons)
4. Print stylesheet for confirmation
5. Vitest + Playwright scaffolding + smoke tests
6. Legal page skeletons
7. Lighthouse pass + top-3 fixes
8. SEO scanner cleanup

Then I'll come back to you with the Stage 2/3 answers.
