"use client";

import { DashboardSidebar } from "@/components/shared/sidebar/sidebar";
import TopBar from "@/components/shared/top-bar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { adminNavItems } from "@/lib/tools/constants";
import { useSession } from "next-auth/react";

// const handleSearch = (query: string) => {
//   Implement search functionality
//   console.log("Search query:", query);
// };
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="bg-background flex min-h-screen w-full">
        {/* Sidebar */}
        <DashboardSidebar navItems={adminNavItems} />

        {/* Main Content Area */}
        <SidebarInset className="flex-1">
          <div className="flex h-full flex-col">
            {/* Header with Sidebar Trigger */}
            <header className="flex h-20 shrink-0 items-center gap-2 px-4 py-5">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1">
                {/* onSearch={handleSearch} */}
                <TopBar adminName={session?.user.employee.fullName || ""} notificationsCount={12} className="px-6" />
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
