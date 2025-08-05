"use client";

import { localizeHref } from "@/lib/i18n/navigation";
import { useLocale } from "next-intl";
import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";

interface LocaleLinkProperties extends Omit<LinkProps, "href"> {
  href: string | LinkProps["href"];
  children: React.ReactNode;
  className?: string;
}

export const LocaleLink = forwardRef<HTMLAnchorElement, LocaleLinkProperties>(
  ({ href, children, ...properties }, reference) => {
    const locale = useLocale();

    // Handle both string and UrlObject types
    const hrefString = typeof href === "string" ? href : href.pathname || "/";

    // Use the utility function to localize the href
    const localizedHref = localizeHref(hrefString, locale);

    return (
      <Link ref={reference} href={localizedHref} {...properties}>
        {children}
      </Link>
    );
  },
);

LocaleLink.displayName = "LocaleLink";
