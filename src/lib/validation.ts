/**
 * Shared zod schemas for form validation across booking flow.
 * Kept locale-agnostic — error messages are keys that the UI maps
 * to translated strings via useBi().
 */
import { z } from "zod";

/** Egyptian National ID: 14 digits. Passport: 6-9 alphanumerics. */
const idPattern = /^(\d{14}|[A-Z0-9]{6,9})$/i;

export const passengerSchema = z.object({
  firstName: z.string().min(2, "err.firstName"),
  lastName: z.string().min(2, "err.lastName"),
  email: z.string().email("err.email"),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^[+\d\s()-]{8,}$/.test(v), "err.phone"),
  nationalId: z.string().regex(idPattern, "err.nationalId"),
});

export type PassengerInput = z.infer<typeof passengerSchema>;

export const cardPaymentSchema = z.object({
  cardholder: z.string().min(2, "err.cardholder"),
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .refine((v) => /^\d{13,19}$/.test(v), "err.cardNumber"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "err.expiry"),
  cvv: z.string().regex(/^\d{3,4}$/, "err.cvv"),
});

export type CardPaymentInput = z.infer<typeof cardPaymentSchema>;

/** Journey search — shared by the home planner and search results header. */
export const journeySearchSchema = z
  .object({
    from: z.string().min(1, "err.from"),
    to: z.string().min(1, "err.to"),
    date: z.string().min(1, "err.date"),
    returnDate: z.string().optional(),
    passengers: z.number().int().min(1).max(9),
  })
  .refine((v) => v.from !== v.to, { message: "err.sameStation", path: ["to"] })
  .refine(
    (v) => {
      if (!v.returnDate) return true;
      return new Date(v.returnDate) >= new Date(v.date);
    },
    { message: "err.returnBeforeDeparture", path: ["returnDate"] },
  );

export type JourneySearchInput = z.infer<typeof journeySearchSchema>;
