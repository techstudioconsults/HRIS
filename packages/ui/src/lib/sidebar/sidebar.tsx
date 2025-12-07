"use client";

import {
  CardReceive,
  Clock,
  Element3,
  People,
  Profile2User,
} from "iconsax-reactjs";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Logo } from "../logo";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { cn } from "../utils";

// Define types for the icon components
type IconComponentType = React.ComponentType<{
  size?: string | number;
  variant?: "Bold" | "Outline";
  className?: string;
}>;

// Define types for navigation items
interface NavItemBadge {
  variant: "danger" | "default";
  count: number;
}

interface NavItem {
  id: string;
  route: string;
  link: string;
  icon: string;
  divider?: boolean;
  badge?: NavItemBadge;
}

// Define props for the DashboardSidebar component
interface DashboardSidebarProperties {
  navItems: NavItem[];
}

// Create a typed icon mapping object
const iconComponents: Record<string, IconComponentType> = {
  Element3: Element3,
  Profile2User: Profile2User,
  People: People,
  CardReceive: CardReceive,
  Clock: Clock,
};

export function DashboardSidebar({ navItems }: DashboardSidebarProperties) {
  const pathname = usePathname();
  const { userID } = useParams() as { userID?: string };
  const { setOpenMobile } = useSidebar();

  const handleCloseOnMobile = () => {
    setOpenMobile(false);
  };

  const renderIcon = (item: NavItem) => {
    const IconComponent = iconComponents[item.icon];
    if (!IconComponent) return null;
    return (
      <IconComponent
        size="20"
        variant={pathname.includes(item.id) ? "Bold" : "Outline"}
      />
    );
  };

  return (
    <Sidebar className="shadow-none">
      <SidebarContent className="bg-background">
        <Logo width={148} className="mx-auto py-4" />
        <SidebarMenu className="space-y-2.5 p-5">
          {navItems?.map((item: NavItem) => {
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
                    "flex h-11 items-center gap-3 rounded-lg text-[16px] font-medium transition-all duration-200",
                    isActive
                      ? "border-primary text-primary shadow-active border-2 bg-[#ECF4FF]"
                      : "text-gray hover:text-primary hover:bg-[#ECF4FF]",
                  )}
                >
                  <Link
                    onClick={handleCloseOnMobile}
                    href={link}
                    data-testid={item.id}
                    role="sidebar-link"
                  >
                    {renderIcon(item)}
                    <span className="font-medium dark:text-white">
                      {item.route}
                    </span>
                    {item.badge && (
                      <SidebarMenuBadge
                        className={cn(
                          "absolute right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs",
                          item.badge.variant === "danger"
                            ? "bg-mid-danger text-white"
                            : "bg-gray-200",
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
