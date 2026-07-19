import { useLocale } from "./locale-context";

/**
 * Lightweight bilingual helper for inline route copy that doesn't warrant
 * a full JSON namespace. Returns the Arabic string when locale is "ar",
 * otherwise the English one.
 *
 *   const bi = useBi();
 *   <h1>{bi("About ENR", "عن الهيئة القومية لسكك حديد مصر")}</h1>
 */
export function useBi() {
  const { locale } = useLocale();
  return (en: string, ar: string): string => (locale === "ar" ? ar : en);
}

/** Non-hook variant when you already have the locale in scope. */
export function bi(locale: "en" | "ar", en: string, ar: string): string {
  return locale === "ar" ? ar : en;
}
