/**
 * Shared display formatters. Centralised so currency, date and time
 * rendering stay consistent across every screen and both locales.
 */
import type { Locale } from "@/i18n/config";

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"] as const;

/** Convert Latin digits in a string to Arabic-Indic digits. */
export function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

/** Format an EGP amount for the active locale. */
export function formatCurrency(amount: number, locale: Locale): string {
  const rounded = Math.round(amount);
  if (locale === "ar") return `${toArabicDigits(rounded)} ج.م`;
  return `${rounded.toLocaleString("en-EG")} EGP`;
}

/** Format an ISO / Date value as a long weekday date. */
export function formatLongDate(value: Date | string, locale: Locale): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Format a Date as HH:MM in 24h form, digit-mapped for Arabic. */
export function formatTime(value: Date | string, locale: Locale): string {
  const d = typeof value === "string" ? new Date(value) : value;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const raw = `${hh}:${mm}`;
  return locale === "ar" ? toArabicDigits(raw) : raw;
}

/** Format a duration expressed in minutes. */
export function formatDuration(totalMinutes: number, locale: Locale): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (locale === "ar") {
    return `${toArabicDigits(h)}س ${toArabicDigits(m)}د`;
  }
  return `${h}h ${String(m).padStart(2, "0")}m`;
}
