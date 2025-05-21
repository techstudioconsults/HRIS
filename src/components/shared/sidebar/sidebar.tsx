/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

// import { Logo } from "../logo";

export function DashboardSidebar({ navItems }: { navItems: any }) {
  const pathname = usePathname();
  const userID = pathname.split("/")[2];
  const { setOpenMobile } = useSidebar();

  const handleCloseOnMobile = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar className={`cc-border -z-10 border-r shadow-none`}>
      <SidebarContent>
        <SidebarMenu className={`space-y-2 p-4`}>
          {navItems?.map((item: any) => {
            if (item.divider) {
              return <div key={item.id} />;
            }
            const link = item.link.replace(":userID", userID || "");
            const isActive = pathname.includes(item.id);

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex h-[48px] items-center gap-3 rounded-lg text-[16px] font-medium transition-all duration-200",
                    isActive
                      ? "border-primary text-primary shadow-active border-2"
                      : "text-mid-grey-II hover:bg-low-grey-I",
                  )}
                >
                  <Link onClick={handleCloseOnMobile} href={link} data-testid={item.id} role="sidebar-link">
                    {/* {renderIcon(item)} */}
                    <span className={`font-medium dark:text-white`}>{item.route}</span>
                    {item.badge && (
                      <SidebarMenuBadge
                        className={cn(
                          "absolute right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs",
                          item.badge.variant === "danger" ? "bg-mid-danger text-white" : "bg-gray-200",
                          item.badge.count === 0 && "hidden",
                        )}
                      >
                        {item.badge.count}
                      </SidebarMenuBadge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
