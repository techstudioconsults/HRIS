import { defaultLocale, locales } from "./config";

// For next-intl v3.9.1, use standard Next.js navigation hooks
// with locale-aware utilities
export { default as Link } from "next/link";
export { redirect } from "next/navigation";
export { usePathname } from "next/navigation";
export { useRouter } from "next/navigation";

// Additional navigation utilities
export function getLocalizedPath(path: string, locale?: string): string {
  const targetLocale = locale || defaultLocale;
  return `/${targetLocale}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getPathWithoutLocale(pathname: string): string {
  const localePattern = new RegExp(`^/(${locales.join("|")})`);
  const result = pathname.replace(localePattern, "") || "/";
  return result;
}

export function getLocaleFromPath(pathname: string): string {
  const localeMatch = pathname.match(new RegExp(`^/(${locales.join("|")})`));
  return localeMatch?.[1] || defaultLocale;
}

/**
 * Automatically localize an href with the current locale
 * @param href - The href to localize
 * @param currentLocale - The current locale
 * @returns The localized href
 */
export function localizeHref(href: string, currentLocale: string): string {
  // If href already starts with a locale, use it as is
  const isLocalized = locales.some((locale) => href.startsWith(`/${locale}/`));

  // If href starts with a locale, use it as is, otherwise add the current locale
  return isLocalized ? href : `/${currentLocale}${href.startsWith("/") ? href : `/${href}`}`;
}
