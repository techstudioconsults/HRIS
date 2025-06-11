"use client";

import { DashboardSidebar } from "@/components/shared/sidebar/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { adminNavItems } from "@/lib/tools/constants";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="bg-background flex min-h-screen w-full">
        {/* Sidebar */}
        <DashboardSidebar navItems={adminNavItems} />

        {/* Main Content Area */}
        <SidebarInset className="flex-1">
          <div className="flex h-full flex-col">
            {/* Header with Sidebar Trigger */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1">
                {/* header content here */}
                <h1 className="text-lg font-semibold">Dashboard</h1>
              </div>
            </header>

            {/* Page Content */}
            <main className="max-w-full flex-1 overflow-auto bg-[#F7F9FC] p-6 dark:bg-black">
              <div className="mx-auto max-w-[1400px] space-y-6">{children}</div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
