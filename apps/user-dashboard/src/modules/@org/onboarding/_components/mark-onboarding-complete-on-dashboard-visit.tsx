'use client';

import { ROLES } from '@/lib/auth-types';
import { useSession } from '@/lib/session';
import { useEffect, useRef } from 'react';

import { useOnboardingService } from '../services/use-onboarding-service';

const defaultSetupFlags = {
  takenTour: false,
};

export const MarkOnboardingCompleteOnDashboardVisit = () => {
  const hasTriggeredRef = useRef(false);
  const { data: session, status } = useSession();
  const employeeId = session?.user?.employee?.id;
  const roleName =
    session?.user?.employee?.role?.name ?? session?.user?.role?.name ?? '';
  const isOwner = roleName.toLowerCase() === ROLES.OWNER;

  const { useGetSetupStatus, useSetSetupStatus } = useOnboardingService();
  const { data: setupStatusResponse, isLoading: isSetupLoading } =
    useGetSetupStatus(employeeId ?? '', {
      enabled: status === 'authenticated' && isOwner && Boolean(employeeId),
    });
  const { mutate: setSetupStatus, isPending: isSaving } = useSetSetupStatus();

  useEffect(() => {
    if (
      status !== 'authenticated' ||
      !isOwner ||
      !employeeId ||
      isSetupLoading ||
      isSaving ||
      hasTriggeredRef.current
    ) {
      return;
    }

    const setupStatus =
      setupStatusResponse?.data.takenTour ?? defaultSetupFlags.takenTour;

    if (setupStatus) {
      return;
    }

    hasTriggeredRef.current = true;
    setSetupStatus({
      employeeId,
      setupInput: {
        takenTour: true,
      },
    });
  }, [
    employeeId,
    isOwner,
    isSaving,
    isSetupLoading,
    setSetupStatus,
    setupStatusResponse?.data,
    status,
  ]);

  return null;
};
