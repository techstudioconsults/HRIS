"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface NavItemProperties extends React.HTMLAttributes<HTMLElement> {
  links: NavLink[];
  isMobile?: boolean;
}

interface ListItemProperties extends LinkProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export const NavItems: React.FC<NavItemProperties> = ({ links, isMobile, className }) => {
  const pathname = usePathname();

  return (
    <NavigationMenu className={cn(isMobile && "block max-w-full", className)}>
      <NavigationMenuList
        className={cn("cc-border gap-0 divide-y lg:divide-x lg:divide-y-0 lg:border-x", isMobile && "block")}
      >
        {links.map((link, index) => {
          if (link.type === "dropdown" && link.subLinks) {
            return (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger
                  className={cn("w-full", pathname === link.href && "border-accent border border-b")}
                >
                  {link.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[600px] md:grid-cols-2">
                    {link.subLinks.map((subLink) => (
                      <ListItem
                        key={subLink.id}
                        href={subLink.href}
                        title={subLink.title}
                        className={pathname === subLink.href ? "bg-accent/50" : ""}
                      >
                        {subLink.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink className={`rounded-none`} asChild>
                <Link
                  href={link.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "min-h-[48px] w-full rounded-none lg:w-fit",
                    pathname === link.href && "text-accent",
                  )}
                >
                  {link.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProperties>(
  ({ className, title, children, href, ...properties }, reference) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={reference}
            href={href}
            className={cn(
              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
              className,
            )}
            {...properties}
          >
            <div className="text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
