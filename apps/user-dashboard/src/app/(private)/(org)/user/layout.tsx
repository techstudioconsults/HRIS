'use client';
import TopBar from '@/components/shared/top-bar';
import { ActiveTargetProvider } from '@/context/active-target';
import { userNavItems } from '@/lib/tools/constants';
import { TourProvider } from '@/modules/@org/onboarding';
import { useOnboardingService } from '@/modules/@org/onboarding/services/use-onboarding-service';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar';
import { AppSidebar, Logo, useModeToggle } from '@workspace/ui/lib';
import { cn } from '@workspace/ui/lib/utils';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

export default function UserDashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const { useGetCompanyProfile } = useOnboardingService();
  const { data: companyProfile } = useGetCompanyProfile();
  const theme = useModeToggle();
  return (
    <TourProvider>
      <SidebarProvider>
        <AppSidebar
          theme={theme}
          className={cn('z-1 bg-[#1F2666] text-white')}
          navMain={[]}
          navSecondary={userNavItems}
          teams={[
            {
              name: companyProfile?.name || 'Tech Studio Academy',
              logo: <Logo logo="/images/logo.png" />,
              plan: companyProfile?.domain || 'techstudioacademy.com',
            },
          ]}
        />
        <SidebarInset className="dark:bg-background bg-[#F8F8F9]">
          <ActiveTargetProvider>
            <TopBar
              adminName={session?.user.employee.fullName || ''}
              adminRole={session?.user.employee.role?.name || ''}
              adminEmail={session?.user.employee.email || ''}
              notifications={[]}
            />
            <Wrapper className="max-w-[1440px] py-10">{children}</Wrapper>
          </ActiveTargetProvider>
        </SidebarInset>
      </SidebarProvider>
    </TourProvider>
  );
}
