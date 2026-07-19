/**
 * Runtime-validated schema for TripMatch results returned by
 * findTrips() / departuresFrom(). Keeps the async data layer
 * honest — malformed catalogue rows fail loudly in development
 * instead of silently rendering broken UI.
 */
import { z } from "zod";

const bilingual = z.object({ en: z.string(), ar: z.string() });

const trainKind = z.enum([
  "vip-talgo",
  "spanish-ac",
  "russian-ac",
  "russian",
  "sleeper",
]);

const fareClass = z.enum([
  "3rd",
  "2nd-ac",
  "1st-ac",
  "vip",
  "sleeper-double",
  "sleeper-single",
]);

const timeHHMM = z.string().regex(/^\d{2}:\d{2}$/, "expected HH:MM");

export const fareSchema = z.object({
  klass: fareClass,
  priceEgp: z.number().nonnegative(),
});

export const tripMatchSchema = z.object({
  number: z.string().min(1),
  kind: trainKind,
  from: z.string().min(1),
  to: z.string().min(1),
  depart: timeHHMM,
  arrive: timeHHMM,
  nextDayArrival: z.boolean(),
  duration: bilingual,
  days: z.union([z.literal("daily"), z.array(z.number().int().min(0).max(6))]),
  stops: z.array(z.string()).optional(),
  fares: z.array(fareSchema).min(1),
  source: z.string().optional(),
  direct: z.boolean(),
  intermediateStops: z.number().int().nonnegative(),
});

export type TripMatchValidated = z.infer<typeof tripMatchSchema>;

export const tripMatchListSchema = z.array(tripMatchSchema);

/**
 * Dev-only guardrail. Returns the input unchanged in production so
 * hot paths (search results, station pages) pay zero validation cost.
 * In development, surfaces the first failing row in the console.
 */
export function assertTripMatches<T>(rows: T[]): T[] {
  if (import.meta.env?.DEV) {
    const result = tripMatchListSchema.safeParse(rows);
    if (!result.success) {
      // eslint-disable-next-line no-console
      console.error("[trips] TripMatch validation failed", result.error.issues.slice(0, 3));
    }
  }
  return rows;
}
