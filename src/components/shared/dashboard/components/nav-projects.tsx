/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NavProjects({
  title,
  projects,
}: {
  title?: string;
  projects: {
    name: string;
    url: string;
    icon?: any;
    isActive?: boolean;
  }[];
}) {
  // const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu className="gap-5">
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <Link href={item.url}>
              <SidebarMenuButton
                className={cn(
                  "hover:bg-primary/10 w-full cursor-pointer p-6 transition-all duration-75",
                  item.isActive &&
                    "border-primary bg-primary/40 border-3 font-medium shadow-[0px_0px_0px_2px_#0266F333]",
                )}
              >
                <div>{item.icon && <item.icon className={cn("-ml-1 !size-5")} />}</div>
                <span>{item.name}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
