'use client';

import { ROLES } from '@/lib/auth-types';
import { getDashboardRoute } from '@/lib/routes/redirect-helpers';
import { useOnboardingService } from '@/modules/@org/onboarding/services/use-onboarding-service';
import { SuspenseLoading } from '@workspace/ui/lib/loading';
import { useSession } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

const PostLoginContinuePage = () => {
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
  const {
    data: setupStatusResponse,
    isLoading: isSetupLoading,
    isFetching: isSetupFetching,
  } = useGetSetupStatus(employeeId ?? '');

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status !== 'authenticated') {
      router.replace('/login');
      return;
    }

    const dashboardRoute = getDashboardRoute(permissions);

    if (!isOwner) {
      router.replace(dashboardRoute);
      return;
    }

    if (!employeeId || isSetupLoading || isSetupFetching) {
      return;
    }

    if (setupStatusResponse?.data?.takenTour) {
      router.replace(dashboardRoute);
      return;
    }

    router.replace('/onboarding/welcome');
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

  return (
    <div className=" w-full flex items-end gap-2 -mt-60 max-w-lg mx-auto text-center backdrop-blur">
      <SuspenseLoading />
      <p className="text-sm font-medium">Preparing your workspace...</p>
    </div>
  );
};

export default PostLoginContinuePage;
