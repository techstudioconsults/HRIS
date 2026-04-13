'use client';

import { adminNavItems, userNavItems } from '@/lib/tools/constants';
import { useOnboardingService } from '@/modules/@org/onboarding/services/use-onboarding-service';
import { useSidebar } from '@workspace/ui/components/sidebar';
import { AppSidebar as Sidebar, Logo, useModeToggle } from '@workspace/ui/lib';
import { cn } from '@workspace/ui/lib/utils';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

const EMPTY_NAV_ITEMS: typeof adminNavItems = [];

export function AppSideBar() {
  const { useGetCompanyProfile } = useOnboardingService();
  const { data: companyProfile } = useGetCompanyProfile();
  const theme = useModeToggle();
  const { state } = useSidebar();
  const { data: session } = useSession();

  const roleName = session?.user.employee.role.name;
  const userName = session?.user.employee.fullName.toUpperCase();
  const isAdmin = roleName === 'owner';
  const isUser = roleName !== 'owner';

  const teams = useMemo(
    () => [
      {
        name: companyProfile?.name ?? '',
        logo:
          state === 'collapsed' ? (
            <Logo key="collapsed-logo" logo={'/images/logo.png'} />
          ) : (
            <Logo
              key="expanded-logo"
              logo={'/images/logo-white.svg'}
              className="w-50"
            />
          ),
        plan: companyProfile?.domain ?? '',
      },
    ],
    [companyProfile?.name, companyProfile?.domain, state]
  );

  return (
    <Sidebar
      theme={theme}
      navMainTitle={isAdmin ? 'ADMIN' : ''}
      navMain={isAdmin ? adminNavItems : EMPTY_NAV_ITEMS}
      secondaryTitle={isUser ? userName : ''}
      navSecondary={isUser ? userNavItems : EMPTY_NAV_ITEMS}
      className={cn(
        'z-50 bg-[#1F2666] text-white',
        state === 'collapsed' ? 'px-4 md:px-0' : 'px-4 md:px-6'
      )}
      teams={teams}
    />
  );
}
