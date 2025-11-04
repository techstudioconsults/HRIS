import { currencies, dateFormats, Locale, numberFormats } from "./config";

/**
 * Format currency based on locale
 */
export function formatCurrency(amount: number, locale: Locale = "en", currency?: string): string {
  // Resolve currency; fallback to NGN
  const currencyCode = currency || currencies[locale] || "NGN";
  // Prefer region-specific locale for NGN symbol rendering
  const formatLocale: Intl.LocalesArgument = locale === "en" ? "en-NG" : locale;

  return new Intl.NumberFormat(formatLocale, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date based on locale
 */
export function formatDate(date: Date | string, locale: Locale = "en", options?: Intl.DateTimeFormatOptions): string {
  const dateObject = typeof date === "string" ? new Date(date) : date;
  const formatOptions = options || dateFormats[locale];

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObject);
}

/**
 * Format number based on locale
 */
export function formatNumber(number: number, locale: Locale = "en", options?: Intl.NumberFormatOptions): string {
  const formatOptions = options || numberFormats[locale];

  return new Intl.NumberFormat(locale, formatOptions).format(number);
}

/**
 * Check if locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  return locale === "ar";
}

/**
 * Get locale direction
 */
export function getLocaleDirection(locale: Locale): "ltr" | "rtl" {
  return isRTL(locale) ? "rtl" : "ltr";
}

/**
 * Validate if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return ["en", "fr", "es", "ar"].includes(locale);
}

export const formatTime = (date: Date | string, locale: Locale = "en", options?: Intl.DateTimeFormatOptions) => {
  const dateObject = typeof date === "string" ? new Date(date) : date;
  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    ...options,
  };
  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObject);
};
