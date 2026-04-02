'use client';

import { adminNavItems } from '@/lib/tools/constants';
import { useOnboardingService } from '@/modules/@org/onboarding/services/use-onboarding-service';
import { useSidebar } from '@workspace/ui/components/sidebar';
import { AppSidebar as Sidebar, Logo, useModeToggle } from '@workspace/ui/lib';
import { cn } from '@workspace/ui/lib/utils';

export function AppSideBar() {
  const { useGetCompanyProfile } = useOnboardingService();
  const { data: companyProfile } = useGetCompanyProfile();
  const theme = useModeToggle();
  const { state } = useSidebar();

  return (
    <Sidebar
      theme={theme}
      navMain={[]}
      navSecondary={adminNavItems}
      className={cn(
        'z-1 bg-[#1F2666] text-background',
        state === `collapsed` ? `px-0` : `px-6`
      )}
      teams={[
        {
          name: companyProfile?.name || '',
          logo:
            state === `collapsed` ? (
              <Logo className={`w-full`} logo={cn('/images/logo.png')} />
            ) : (
              <Logo className={`w-full`} logo={cn('/images/logo-white.svg')} />
            ),
          plan: companyProfile?.domain || '',
        },
      ]}
    />
  );
}
