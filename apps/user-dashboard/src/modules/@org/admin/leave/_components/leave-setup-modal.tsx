'use client';

import { ReusableDialog } from '@workspace/ui/lib/dialog';
import { MainButton } from '@workspace/ui/lib/button';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useLeaveService } from '../services/use-service';
import type { LeaveType } from '../types';
import { routes } from '@/lib/routes/routes';

/**
 * Lightweight reminder modal for admin leave setup.
 * Shows automatically when visiting the leave page.
 */
export const LeaveSetupModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const hasEvaluatedVisibilityReference = useRef(false);

  const { useGetLeaveTypes } = useLeaveService();
  const { data: leaveTypesResponse, isLoading, isError } = useGetLeaveTypes();

  const leaveTypesCount = useMemo(() => {
    if (Array.isArray(leaveTypesResponse)) {
      return leaveTypesResponse.length;
    }

    const response = leaveTypesResponse as
      | {
          items?: LeaveType[];
          data?: LeaveType[] | { items?: LeaveType[] };
          metadata?: { total?: number };
        }
      | undefined;

    if (typeof response?.metadata?.total === 'number') {
      return response.metadata.total;
    }

    if (Array.isArray(response?.items)) {
      return response.items.length;
    }

    if (Array.isArray(response?.data)) {
      return response.data.length;
    }

    if (
      response?.data &&
      typeof response.data === 'object' &&
      Array.isArray((response.data as { items?: LeaveType[] }).items)
    ) {
      return ((response.data as { items?: LeaveType[] }).items ?? []).length;
    }

    return 0;
  }, [leaveTypesResponse]);

  // Show setup modal only when no leave type exists.
  useEffect(() => {
    if (hasEvaluatedVisibilityReference.current) return;
    if (isLoading || isError) return;

    hasEvaluatedVisibilityReference.current = true;
    setOpen(leaveTypesCount === 0);
  }, [isError, isLoading, leaveTypesCount]);

  return (
    <ReusableDialog
      open={open}
      onOpenChange={setOpen}
      trigger={null}
      title="Set up Leave Types"
      description="Create at least one leave type (e.g., Annual Leave) to begin managing leave in your organization."
      className="md:min-w-sm!"
    >
      <div className="space-y-6">
        <div className="bg-primary/10 border-primary-75 rounded-lg border p-5">
          <h6 className="mb-2 font-semibold">What you&apos;ll do:</h6>
          <ul className="ml-4 space-y-2 text-sm ">
            <li className="flex items-center">
              <span className="mr-2 size-1 shrink-0 rounded-full bg-gray-400" />
              Create leave types with cycles and day limits
            </li>
            <li className="flex items-center">
              <span className="mr-2 size-1 shrink-0 rounded-full bg-gray-400" />
              View employee leave requests in the Leave Hub
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-3">
          <MainButton
            variant="primary"
            className="w-full"
            onClick={() => {
              setOpen(false);
              router.push(routes.admin.leave.types());
            }}
          >
            Manage Leave Types
          </MainButton>

          <MainButton
            onClick={() => setOpen(false)}
            className="text-center text-sm"
          >
            Remind me later
          </MainButton>
        </div>
      </div>
    </ReusableDialog>
  );
};
