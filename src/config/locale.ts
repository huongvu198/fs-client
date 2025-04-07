const LOCALE = "LOCALE";

type Locale = "vn" | "en";

export const setLocale = (locale: "vn" | "en") =>
  localStorage.setItem(LOCALE, locale);

export const getLocale = () => localStorage.getItem(LOCALE) as Locale | null;

export const removeLocale = () => localStorage.removeItem(LOCALE);

export const hasLocale = () => !!localStorage.getItem(LOCALE);
