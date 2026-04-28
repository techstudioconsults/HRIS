'use client';

import { ROLES } from '@/lib/auth-types';
import { getDashboardRoute } from '@/lib/routes/redirect-helpers';
import { useSession } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect, useMemo } from 'react';

import { useOnboardingService } from '../services/use-onboarding-service';

export const OnboardingRouteGuard = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const employeeId = session?.user?.employee?.id;
  const permissions = useMemo(
    () => (session?.user?.permissions as string[]) ?? [],
    [session?.user?.permissions]
  );
  const roleName =
    session?.user?.employee?.role?.name ?? session?.user?.role?.name ?? '';
  const isOwner = roleName.toLowerCase() === ROLES.OWNER;

  const { useGetSetupStatus } = useOnboardingService();
  const {
    data: setupStatusResponse,
    isLoading: isSetupLoading,
    isFetching: isSetupFetching,
  } = useGetSetupStatus(employeeId ?? '', {
    enabled: status === 'authenticated' && isOwner && Boolean(employeeId),
  });

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    if (!isOwner) {
      router.replace(getDashboardRoute(permissions));
      return;
    }

    // Wait for fresh data — isFetching covers both first fetch and stale-cache refetches.
    if (!employeeId || isSetupLoading || isSetupFetching) {
      return;
    }

    if (setupStatusResponse?.data?.takenTour) {
      router.replace(getDashboardRoute(permissions));
    }
  }, [
    employeeId,
    isOwner,
    isSetupFetching,
    isSetupLoading,
    permissions,
    router,
    setupStatusResponse?.data,
    status,
  ]);

  // Suppress content flash while the session or setup status is still resolving.
  if (
    status === 'loading' ||
    (status === 'authenticated' &&
      isOwner &&
      (isSetupLoading || isSetupFetching))
  ) {
    return null;
  }

  return <>{children}</>;
};
