'use client';

import { ROLES } from '@/lib/auth-types';
import { useSession } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useMemo } from 'react';

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
  const { data: setupStatusResponse, isLoading: isSetupLoading } =
    useGetSetupStatus(employeeId ?? '', {
      enabled: status === 'authenticated' && isOwner && Boolean(employeeId),
    });

  // useEffect(() => {
  //   if (status !== 'authenticated') {
  //     return;
  //   }
  //
  //   if (!isOwner) {
  //     router.replace(getDashboardRoute(permissions));
  //     return;
  //   }
  //
  //   if (!employeeId || isSetupLoading) {
  //     return;
  //   }
  //
  //   if (isOnboardingSetupComplete(setupStatusResponse?.data)) {
  //     router.replace(getDashboardRoute(permissions));
  //   }
  // }, [
  //   employeeId,
  //   isSetupLoading,
  //   isOwner,
  //   permissions,
  //   router,
  //   setupStatusResponse?.data,
  //   status,
  // ]);
  //
  // // Avoid onboarding content flashes while redirecting or checking owner setup status.
  // if (status === 'authenticated' && (!isOwner || isSetupLoading)) {
  //   return null;
  // }

  return <>{children}</>;
};
