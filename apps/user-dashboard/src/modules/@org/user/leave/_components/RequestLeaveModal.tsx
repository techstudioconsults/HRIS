'use client';

import { ReusableDialog } from '@workspace/ui/lib';
import { toast } from 'sonner';
import { useUserLeaveService } from '@/modules/@org/user';
import type { RequestLeaveSubmitData, RequestLeaveModalProps } from '../types';
import { RequestLeaveForm } from '@/modules/@org/user';

export const RequestLeaveModal = ({
  open,
  onOpenChange,
  onSuccess,
}: RequestLeaveModalProps) => {
  const { useGetLeaveTypes, useCreateLeaveRequest } = useUserLeaveService();

  const { data: leaveTypesData, isLoading: isLoadingTypes } =
    useGetLeaveTypes();
  const { mutateAsync: createLeaveRequest, isPending } =
    useCreateLeaveRequest();
  const leaveTypes = leaveTypesData ?? [];

  const handleSubmit = async (data: RequestLeaveSubmitData) => {
    try {
      await createLeaveRequest({
        leaveId: data.leaveId,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        document: data.document,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error('Failed to submit leave request. Please try again.');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Request for Leave"
      description="Fill in your leave details below. Make sure your dates don't overlap with an existing approved leave."
      trigger={undefined}
    >
      <RequestLeaveForm
        leaveTypes={leaveTypes}
        isLoadingTypes={isLoadingTypes}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isPending}
      />
    </ReusableDialog>
  );
};
