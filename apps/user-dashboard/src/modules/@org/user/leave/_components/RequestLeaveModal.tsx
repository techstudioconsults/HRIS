'use client';

import { ReusableDialog } from '@workspace/ui/lib/dialog';
import { toast } from 'sonner';
import { useUserLeaveService } from '@/modules/@org/user';
import type { RequestLeaveSubmitData, RequestLeaveModalProps } from '../types';
import { RequestLeaveForm } from '@/modules/@org/user';

export const RequestLeaveModal = ({
  open,
  onOpenChange,
  onSuccess,
  initialRequest,
}: RequestLeaveModalProps) => {
  const isEditMode = !!initialRequest;

  const { useGetLeaveTypes, useCreateLeaveRequest, useUpdateLeaveRequest } =
    useUserLeaveService();

  const { data: leaveTypesData, isLoading: isLoadingTypes } =
    useGetLeaveTypes();
  const { mutateAsync: createLeaveRequest, isPending: isCreating } =
    useCreateLeaveRequest();
  const { mutateAsync: updateLeaveRequest, isPending: isUpdating } =
    useUpdateLeaveRequest();

  const leaveTypes = leaveTypesData ?? [];
  const isPending = isCreating || isUpdating;

  const handleSubmit = async (data: RequestLeaveSubmitData) => {
    try {
      if (isEditMode) {
        await updateLeaveRequest({
          id: initialRequest.id,
          data: {
            leaveId: data.leaveId,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason,
            document: data.document,
          },
        });
        toast.success('Leave request updated successfully.');
        onOpenChange(false);
      } else {
        await createLeaveRequest({
          leaveId: data.leaveId,
          startDate: data.startDate,
          endDate: data.endDate,
          reason: data.reason,
          document: data.document,
        });
        onOpenChange(false);
        onSuccess?.();
      }
    } catch {
      toast.error(
        isEditMode
          ? 'Failed to update leave request. Please try again.'
          : 'Failed to submit leave request. Please try again.'
      );
    }
  };

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? 'Edit Leave Request' : 'Request for Leave'}
      description={
        isEditMode
          ? 'Update your leave request details below.'
          : "Fill in your leave details below. Make sure your dates don't overlap with an existing approved leave."
      }
      trigger={undefined}
    >
      <RequestLeaveForm
        leaveTypes={leaveTypes}
        isLoadingTypes={isLoadingTypes}
        initialData={
          initialRequest
            ? {
                leaveId: initialRequest.leaveTypeId,
                startDate: initialRequest.startDate.split('T')[0],
                endDate: initialRequest.endDate.split('T')[0],
                reason: initialRequest.reason,
              }
            : null
        }
        onSubmit={handleSubmit}
        onCancel={() => onOpenChange(false)}
        isSubmitting={isPending}
      />
    </ReusableDialog>
  );
};
