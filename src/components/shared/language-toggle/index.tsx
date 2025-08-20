/* eslint-disable no-console */
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeFlags, localeNames, locales, type Locale } from "@/lib/i18n/config";
import { getPathWithoutLocale } from "@/lib/i18n/navigation";
import { Globe, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LanguageToggle() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    startTransition(() => {
      try {
        // Get the path without the current locale
        const pathWithoutLocale = getPathWithoutLocale(pathname);

        // Construct the new path with the new locale
        const newPath = `/${newLocale}${pathWithoutLocale}`;

        // Use replace to avoid adding to history stack and ensure proper navigation
        router.replace(newPath);

        // Close the dropdown
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to change language:", error);
        // Fallback navigation
        const fallbackPath = `/${newLocale}${getPathWithoutLocale(pathname)}`;
        router.replace(fallbackPath);
      }
    });
  };

  const currentLocale = locale as Locale;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          disabled={isPending}
          aria-label={t("common.languageSelector", { defaultValue: "Select language" })}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
          <span role="img" aria-label={`${localeNames[currentLocale]} flag`}>
            {localeFlags[currentLocale]}
          </span>
          {/* <span className="hidden sm:inline">{localeNames[currentLocale]}</span> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {locales.map((lang) => {
          const isCurrentLang = currentLocale === lang;
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`flex items-center gap-2 ${
                isCurrentLang ? "bg-accent font-medium" : ""
              } ${isPending ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={isPending}
              aria-label={`${t("common.switchTo", { defaultValue: "Switch to" })} ${localeNames[lang]}`}
            >
              <span role="img" aria-label={`${localeNames[lang]} flag`} className="text-lg">
                {localeFlags[lang]}
              </span>
              <span className="flex-1">{localeNames[lang]}</span>
              {isCurrentLang && (
                <span
                  className="text-primary ml-auto text-xs"
                  aria-label={t("common.currentLanguage", { defaultValue: "Current language" })}
                >
                  ✓
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
