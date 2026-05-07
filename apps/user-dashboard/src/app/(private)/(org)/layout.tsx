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
import { useUserProfileService } from '@/modules/@org/user/profile';
import { DashboardPreferencesProvider } from '@/lib/preferences/dashboard-preferences-provider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const employeeId = session?.user?.id ?? '';

  // Fetch the current user's profile to get the avatar URL for the top-bar.
  // The profile query key ['user', 'profile', 'current'] is invalidated by
  // both useUpdateMyProfile and useUpdateEmployee mutations after image uploads.
  const { useGetMyProfile } = useUserProfileService();
  const { data: profile } = useGetMyProfile(employeeId);

  const adminAvatar = profile?.avatar ?? '';
  const adminName = session?.user.employee.fullName || '';
  const adminRole = session?.user.employee.role?.name || '';
  const adminEmail = session?.user.employee.email || '';

  const topBar = (
    <TopBar
      adminName={adminName}
      adminRole={adminRole}
      adminEmail={adminEmail}
      adminAvatar={adminAvatar}
    />
  );

  const topBarPWA = (
    <TopBar
      adminName={adminName}
      adminRole={adminRole}
      adminEmail={adminEmail}
      adminAvatar={adminAvatar}
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
    <DashboardPreferencesProvider>
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
                <SidebarInset>
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
    </DashboardPreferencesProvider>
  );
}
