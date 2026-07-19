import { createContext, useContext } from "react";
import type { Locale } from "./config";
import { DEFAULT_LOCALE, directionForLocale } from "./config";

export type LocaleContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  otherLocale: Locale;
};

export const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  dir: directionForLocale(DEFAULT_LOCALE),
  otherLocale: "ar",
});

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
