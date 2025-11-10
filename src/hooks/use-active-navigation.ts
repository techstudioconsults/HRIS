/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface NavigationItem {
  name: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  subItems?: {
    name: string;
    url: string;
  }[];
}

export const useActiveNavigation = (items: NavigationItem[]) => {
  const pathname = usePathname();

  const itemsWithActiveState = useMemo(() => {
    // Remove locale from pathname for comparison (e.g., /en/admin/dashboard -> /admin/dashboard)
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || pathname;

    return items.map((item) => {
      const isActive = pathWithoutLocale === item.url || pathWithoutLocale.startsWith(item.url + "/");

      // Check if any sub-items are active
      const hasActiveSubItem =
        item.subItems?.some(
          (subItem) => pathWithoutLocale === subItem.url || pathWithoutLocale.startsWith(subItem.url + "/"),
        ) || false;

      return {
        ...item,
        isActive: isActive || hasActiveSubItem,
        subItems: item.subItems?.map((subItem) => ({
          ...subItem,
          isActive: pathWithoutLocale === subItem.url || pathWithoutLocale.startsWith(subItem.url + "/"),
        })),
      };
    });
  }, [items, pathname]);

  return itemsWithActiveState;
};
