"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import { AppSidebar } from "@/components/shared/dashboard/sidebar/app-sidebar";
import { Logo } from "@/components/shared/logo";
import TopBar from "@/components/shared/top-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ActiveTargetProvider } from "@/context/active-target";
import { adminNavItems } from "@/lib/tools/constants";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <SidebarProvider>
      <AppSidebar
        className={cn("z-[1] bg-[#1F2666] text-white shadow-2xl")}
        navMain={[]}
        navSecondary={adminNavItems}
        teams={[
          {
            name: "Tech Studio Academy",
            logo: <Logo logo="/images/logo.png" />,
            plan: "Enterprise",
          },
        ]}
      />
      <SidebarInset className="dark:bg-background bg-[#F8F8F9]">
        <ActiveTargetProvider>
          <TopBar
            adminName={session?.user.employee.fullName || ""}
            adminRole={session?.user.employee.role?.name || ""}
            adminEmail={session?.user.employee.email || ""}
            notifications={[]}
            className="sticky top-0 z-[1] px-6 shadow"
          />
          <Wrapper className="max-w-[1440px] py-10">{children}</Wrapper>
        </ActiveTargetProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
