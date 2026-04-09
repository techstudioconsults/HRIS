'use client';

import TopBar from '@/components/shared/top-bar';
import { ActiveTargetProvider } from '@/context/active-target';
import { TourProvider } from '@/modules/@org/onboarding';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import {
  SidebarInset,
  SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { AppSideBar } from '@/components/shared/navbar/AppSidebar';
import { LayoutSelector } from '@/components/layouts';

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

  const content = (
    <Wrapper className="relative max-w-[1440px] px-4! space-y-0 my-0! py-5 lg:py-10">
      {children}
    </Wrapper>
  );

  return (
    <TourProvider>
      <ActiveTargetProvider>
        <LayoutSelector
          header={topBar}
          renderWeb={({ header, children: layoutChildren }) => (
            <SidebarProvider>
              <AppSideBar />
              <SidebarInset className="dark:bg-background bg-[#F8F8F9]">
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
