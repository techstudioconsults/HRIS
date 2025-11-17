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
        className={cn("bg-[#1F2666] text-white shadow-2xl")}
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
          <main className="flex flex-1 flex-col gap-10 p-4">
            <TopBar
              adminName={session?.user.employee.fullName || ""}
              notificationsCount={12}
              className="rounded-lg px-6 shadow"
            />
            <Wrapper className="max-w-[1440px] px-0">{children}</Wrapper>
          </main>
        </ActiveTargetProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
