"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { PiHouse } from "react-icons/pi";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadCrumbProperties {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  separator?: ReactNode;
  homeIcon?: ReactNode;
  homeLabel?: string;
}

export const BreadCrumb = ({
  items,
  showHome = false,
  className = "",
  separator,
  homeIcon = <PiHouse size={16} />,
  homeLabel = "Home",
}: BreadCrumbProperties) => {
  const pathName = usePathname();

  // Generate breadcrumb items from pathname if no custom items provided
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = pathName.split("/").filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [];

    let currentPath = "";
    for (const [index, segment] of pathSegments.entries()) {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      breadcrumbItems.push({
        label: segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        href: isLast ? undefined : currentPath,
      });
    }

    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <main className={`mt-2 flex items-center ${className}`}>
      <Breadcrumb>
        <BreadcrumbList className="text-sm">
          {showHome && (
            <>
              <BreadcrumbItem>
                <Link
                  href="/"
                  className="hover:text-primary flex items-center gap-1"
                >
                  {homeIcon}
                  <span>{homeLabel}</span>
                </Link>
              </BreadcrumbItem>
              {breadcrumbItems.length > 0 && (
                <BreadcrumbSeparator className="">
                  {separator}
                </BreadcrumbSeparator>
              )}
            </>
          )}

          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const hasNext = index < breadcrumbItems.length - 1;

            return (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-1 font-medium capitalize">
                      {item.icon}
                      <span>{item.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="hover:text-primary flex items-center gap-1"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </BreadcrumbItem>

                {hasNext && (
                  <BreadcrumbSeparator className="ml-2">
                    {separator}
                  </BreadcrumbSeparator>
                )}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </main>
  );
};
