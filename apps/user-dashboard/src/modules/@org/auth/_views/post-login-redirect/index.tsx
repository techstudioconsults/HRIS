'use client';

import { ROLES } from '@/lib/auth-types';
import { getDashboardRoute } from '@/lib/routes/redirect-helpers';
import { isOnboardingSetupComplete } from '@/modules/@org/onboarding/services/service';
import { useOnboardingService } from '@/modules/@org/onboarding/services/use-onboarding-service';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export const PostLoginRedirect = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const employeeId = session?.user?.employee?.id;
  const roleName =
    session?.user?.employee?.role?.name ?? session?.user?.role?.name ?? '';
  const isOwner = roleName.toLowerCase() === ROLES.OWNER;
  const permissions = useMemo(
    () => (session?.user?.permissions as string[]) ?? [],
    [session?.user?.permissions]
  );

  const { useGetSetupStatus } = useOnboardingService();
  const { data: setupStatusResponse, isLoading: isSetupLoading } =
    useGetSetupStatus(employeeId ?? '', {
      enabled: status === 'authenticated' && isOwner && Boolean(employeeId),
    });

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status !== 'authenticated') {
      router.replace('/login');
      return;
    }

    if (!isOwner) {
      router.replace(getDashboardRoute(permissions));
      return;
    }

    if (!employeeId || isSetupLoading) {
      return;
    }

    if (isOnboardingSetupComplete(setupStatusResponse?.data)) {
      router.replace(getDashboardRoute(permissions));
      return;
    }

    router.replace('/onboarding/welcome');
  }, [
    employeeId,
    isOwner,
    isSetupLoading,
    permissions,
    router,
    setupStatusResponse?.data,
    status,
  ]);

  return null;
};
