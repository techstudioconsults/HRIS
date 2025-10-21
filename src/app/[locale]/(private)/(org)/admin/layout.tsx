"use client";

import { AppSidebar } from "@/components/shared/dashboard/sidebar/app-sidebar";
import TopBar from "@/components/shared/top-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { adminNavItems } from "@/lib/tools/constants";
import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <SidebarProvider>
      <AppSidebar navSecondary={[]} navMain={adminNavItems} navMainTitle="Dashboard" />
      <SidebarInset className="bg-[#F7F9FC]">
        <main className="flex flex-1 flex-col gap-4 p-4">
          <TopBar adminName={session?.user.employee.fullName || ""} notificationsCount={12} className="px-6" />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
