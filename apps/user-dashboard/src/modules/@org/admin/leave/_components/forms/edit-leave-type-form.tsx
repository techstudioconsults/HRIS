'use client';

import { getApiErrorMessage } from '@/lib/tools/api-error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@workspace/ui/components/switch';
import { FormField } from '@workspace/ui/lib/inputs/FormFields';
import { MainButton } from '@workspace/ui/lib/button';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  LEAVE_CYCLE_OPTIONS,
  LEAVE_ELIGIBILITY_OPTIONS,
  leaveTypeFormSchema,
} from '../../schemas/leave-type-form';
import type { LeaveTypeFormValues } from '../../types';
import { useLeaveService } from '../../services/use-service';
import type { EditLeaveTypeFormProperties, LeaveType } from '../../types';

export const EditLeaveTypeForm = ({
  leaveType,
  onClose,
}: EditLeaveTypeFormProperties) => {
  const { useUpdateLeaveType } = useLeaveService();
  const { mutateAsync: updateLeaveType, isPending } = useUpdateLeaveType();

  const eligibilityOptions = useMemo(() => [...LEAVE_ELIGIBILITY_OPTIONS], []);

  const cycleOptions = useMemo(() => [...LEAVE_CYCLE_OPTIONS], []);

  const methods = useForm<LeaveTypeFormValues>({
    resolver: zodResolver(leaveTypeFormSchema),
    defaultValues: {
      name: String(leaveType.name ?? ''),
      days: Number(leaveType.days ?? 0),
      cycle: (leaveType.cycle ?? 'monthly') as
        | 'monthly'
        | 'quarterly'
        | 'yearly',
      maxLeaveDaysPerRequest: Number(
        (leaveType as LeaveType).maxLeaveDaysPerRequest ?? 0
      ),
      enableRollover:
        Number((leaveType as LeaveType).maxNumberOfRollOver ?? 0) > 0,
      maxNumberOfRollOver:
        Number((leaveType as LeaveType).maxNumberOfRollOver ?? 0) > 0
          ? Number((leaveType as LeaveType).maxNumberOfRollOver)
          : undefined,
      eligibility: String((leaveType as LeaveType).eligibility ?? ''),
    },
  });

  const enableRollover = methods.watch('enableRollover');

  const handleCancel = () => {
    methods.reset();
    onClose?.();
  };

  const onSubmit = async (data: LeaveTypeFormValues) => {
    await updateLeaveType(
      {
        id: leaveType.id,
        data: {
          name: data.name,
          days: data.days,
          cycle: data.cycle,
          maxLeaveDaysPerRequest: data.maxLeaveDaysPerRequest,
          eligibility: data.eligibility,
          ...(data.enableRollover
            ? { maxNumberOfRollOver: data.maxNumberOfRollOver }
            : { maxNumberOfRollOver: 0 }),
        },
      },
      {
        onSuccess: () => {
          toast.success(`Leave type "${data.name}" updated.`);
          handleCancel();
        },
        onError: (error) => {
          toast.error('Failed to update leave type', {
            description: getApiErrorMessage(
              error,
              'Unable to update leave type. Please try again.'
            ),
          });
        },
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 py-4"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              name="name"
              label="Leave Name"
              placeholder="Annual Leave"
              required
              type="text"
              className="h-12!"
            />
            <FormField
              name="cycle"
              label="Leave Cycle"
              placeholder="Select Leave Cycle"
              type="select"
              className="bg-background border-border h-12!"
              options={cycleOptions}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Roll Over</label>
              <div className="bg-background border-border mt-1.5 flex h-12 items-center justify-between rounded-md border px-4">
                <span className="text-muted-foreground text-sm">
                  Unused leaves will be rolled over
                </span>
                <Switch
                  checked={enableRollover}
                  onCheckedChange={(checked) => {
                    methods.setValue('enableRollover', checked, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    if (!checked) {
                      methods.setValue('maxNumberOfRollOver', undefined, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              </div>
            </div>

            <FormField
              name="eligibility"
              label="Eligibility"
              placeholder="Select employment duration"
              type="select"
              required
              className="bg-background border-border h-12!"
              options={eligibilityOptions}
            />
          </div>

          <div className="space-y-4">
            <FormField
              name="days"
              label="Days"
              required
              placeholder="Enter number"
              type="number"
              className="h-12!"
            />
            <FormField
              name="maxLeaveDaysPerRequest"
              label="Maximum Leave Days Per Request"
              required
              placeholder="Enter number"
              type="number"
              className="h-12!"
            />
            <FormField
              name="maxNumberOfRollOver"
              label="Maximum Number of Roll Over"
              placeholder="Enter number"
              type="number"
              className="h-12!"
              disabled={!enableRollover}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <MainButton
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleCancel}
            isDisabled={isPending}
          >
            Cancel
          </MainButton>
          <MainButton
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isPending}
            isDisabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
