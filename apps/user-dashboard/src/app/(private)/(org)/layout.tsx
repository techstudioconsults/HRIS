'use client';

import TopBar from '@/components/shared/top-bar';
import { ActiveTargetProvider } from '@/context/active-target';
import { TourProvider } from '@/modules/@org/onboarding';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import {
  SidebarInset,
  SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { useSession } from '@/lib/session';
import { ReactNode } from 'react';
import { AppSideBar } from '@/components/shared/navbar/AppSidebar';
import { LayoutSelector, AppLayout } from '@/components/layouts';
import { PWADockNav } from '@/components/shared/navbar/pwa-dock-nav';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  const topBar = (
    <TopBar
      adminName={session?.user.employee.fullName || ''}
      adminRole={session?.user.employee.role?.name || ''}
      adminEmail={session?.user.employee.email || ''}
      notifications={[]}
    />
  );

  const topBarPWA = (
    <TopBar
      adminName={session?.user.employee.fullName || ''}
      adminRole={session?.user.employee.role?.name || ''}
      adminEmail={session?.user.employee.email || ''}
      notifications={[]}
      showSidebarTrigger={false}
      sticky={false}
    />
  );

  const content = (
    <Wrapper className="relative max-w-360 px-4! space-y-0 my-0! py-5 lg:py-10">
      {children}
    </Wrapper>
  );

  return (
    <TourProvider>
      <ActiveTargetProvider>
        <LayoutSelector
          header={topBar}
          renderPWA={({ children: layoutChildren }) => (
            <AppLayout header={topBarPWA} nav={<PWADockNav />}>
              {layoutChildren}
            </AppLayout>
          )}
          renderWeb={({ header, children: layoutChildren }) => (
            <SidebarProvider>
              <AppSideBar />
              <SidebarInset className="bg-[#fcfcfc] dark:bg-background">
                {header}
                {layoutChildren}
              </SidebarInset>
            </SidebarProvider>
          )}
        >
          {content}
        </LayoutSelector>
      </ActiveTargetProvider>
    </TourProvider>
  );
}
