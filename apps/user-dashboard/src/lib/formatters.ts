export const locales = ["en", "fr", "es", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = "en" as const;

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  ar: "العربية",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  fr: "🇫🇷",
  es: "🇪🇸",
  ar: "🇸🇦",
};

export const currencies: Record<Locale, string> = {
  en: "NGN",
  fr: "NGN",
  es: "NGN",
  ar: "NGN",
};

export const dateFormats: Record<Locale, Intl.DateTimeFormatOptions> = {
  en: { year: "numeric", month: "long", day: "numeric" },
  fr: { year: "numeric", month: "long", day: "numeric" },
  es: { year: "numeric", month: "long", day: "numeric" },
  ar: { year: "numeric", month: "long", day: "numeric" },
};

export const numberFormats: Record<Locale, Intl.NumberFormatOptions> = {
  en: { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 },
  fr: { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 },
  es: { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 },
  ar: { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 },
};

export function formatCurrency(amount: number, locale: Locale = "en", currency?: string): string {
  const currencyCode = currency || currencies[locale] || "NGN";
  const formatLocale: Intl.LocalesArgument = locale === "en" ? "en-NG" : locale;

  return new Intl.NumberFormat(formatLocale, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// export function formatDate(date: Date | string, locale: Locale = "en", options?: Intl.DateTimeFormatOptions): string {
//   const dateObject = typeof date === "string" ? new Date(date) : date;
//   const formatOptions = options || dateFormats[locale];

//   return new Intl.DateTimeFormat(locale, formatOptions).format(dateObject);
// }

export function formatNumber(number: number, locale: Locale = "en", options?: Intl.NumberFormatOptions): string {
  const formatOptions = options || numberFormats[locale];
  return new Intl.NumberFormat(locale, formatOptions).format(number);
}

export function isRTL(locale: Locale): boolean {
  return locale === "ar";
}

export function getLocaleDirection(locale: Locale): "ltr" | "rtl" {
  return isRTL(locale) ? "rtl" : "ltr";
}

export function isValidLocale(locale: string): locale is Locale {
  return ["en", "fr", "es", "ar"].includes(locale);
}

// export const formatTime = (date: Date | string, locale: Locale = "en", options?: Intl.DateTimeFormatOptions) => {
//   const dateObject = typeof date === "string" ? new Date(date) : date;
//   const formatOptions: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric", hour12: true, ...options };
//   return new Intl.DateTimeFormat(locale, formatOptions).format(dateObject);
// };

export const formatDateTime = (date: Date | string, locale: Locale = "en", options?: Intl.DateTimeFormatOptions) => {
  const dateObject = typeof date === "string" ? new Date(date) : date;
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    ...options,
  };
  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObject);
};

export function formatDate(date: Date | string | number | undefined, options: Intl.DateTimeFormatOptions = {}) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: options.month ?? "long",
      day: options.day ?? "numeric",
      year: options.year ?? "numeric",
      ...options,
    }).format(new Date(date));
  } catch {
    return "";
  }
}

export const formatTime = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};
