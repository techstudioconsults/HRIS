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
    const path = pathname || "/";

    return items.map((item) => {
      const isActive = path === item.url || path.startsWith(item.url + "/");

      // Check if any sub-items are active
      const hasActiveSubItem =
        item.subItems?.some((subItem) => path === subItem.url || path.startsWith(subItem.url + "/")) || false;

      return {
        ...item,
        isActive: isActive || hasActiveSubItem,
        subItems: item.subItems?.map((subItem) => ({
          ...subItem,
          isActive: path === subItem.url || path.startsWith(subItem.url + "/"),
        })),
      };
    });
  }, [items, pathname]);

  return itemsWithActiveState;
};
