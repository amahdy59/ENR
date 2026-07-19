/**
 * App-wide configuration constants. Isolated from logic so tuning
 * (breakpoints, tap-target sizes, feature flags) doesn't require
 * changing components.
 */
export const APP_CONFIG = {
  /** Minimum touch-target size (WCAG 2.5.5 / Apple HIG / Material). */
  minTapTargetPx: 44,
  /** Debounce for search/autocomplete inputs. */
  searchDebounceMs: 300,
  /** Standard breakpoints (matches tailwind defaults). */
  breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 } as const,
  /** Max width for content containers. */
  contentMaxWidthPx: 1440,
  /** Number of search results per page before pagination kicks in. */
  searchPageSize: 20,
  /** Threshold at which we virtualise a list rather than mapping it. */
  virtualiseAt: 30,
  /** Bundle-size budget (main chunk, gzipped, kilobytes). */
  bundleBudgetKb: 250,
} as const;
