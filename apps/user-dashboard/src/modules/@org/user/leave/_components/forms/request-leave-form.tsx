'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import { Upload } from 'lucide-react';
import { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

// Schema for form validation
const requestLeaveSchema = z.object({
  leaveType: z.string().min(1, 'Please select a leave type'),
  startDate: z.string().min(1, 'Please select a start date'),
  endDate: z.string().min(1, 'Please select an end date'),
  reason: z.string().optional(),
});

type RequestLeaveFormValues = z.infer<typeof requestLeaveSchema>;

interface RequestLeaveFormProps {
  initialData?: Partial<RequestLeaveFormValues> | null;
  onSubmit: (data: RequestLeaveFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Mock leave types - replace with actual data from service
const LEAVE_TYPES = [
  { id: 'annual', name: 'Annual Leave', balance: 12, isPaid: true },
  { id: 'sick', name: 'Sick Leave', balance: 10, isPaid: true },
  { id: 'casual', name: 'Casual Leave', balance: 5, isPaid: true },
  { id: 'unpaid', name: 'Unpaid Leave', balance: 0, isPaid: false },
];

export const RequestLeaveForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }: RequestLeaveFormProps) => {
  const methods = useForm<RequestLeaveFormValues>({
    resolver: zodResolver(requestLeaveSchema),
    defaultValues: {
      leaveType: initialData?.leaveType ?? '',
      startDate: initialData?.startDate ?? '',
      endDate: initialData?.endDate ?? '',
      reason: initialData?.reason ?? '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting: rhfSubmitting, isValid },
  } = methods;

  // Watch leave type for balance display
  const selectedLeaveTypeId = useWatch({ control, name: 'leaveType' });
  const selectedLeaveType = LEAVE_TYPES.find((lt) => lt.id === selectedLeaveTypeId);

  useEffect(() => {
    reset({
      leaveType: initialData?.leaveType ?? '',
      startDate: initialData?.startDate ?? '',
      endDate: initialData?.endDate ?? '',
      reason: initialData?.reason ?? '',
    });
  }, [initialData, reset]);

  const submit = async (values: RequestLeaveFormValues) => {
    await onSubmit(values);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        {/* Leave Type Selection */}
        <FormField
          type="select"
          label="Select Leave Type"
          name="leaveType"
          placeholder="Choose a leave type"
          className="!h-14 w-full"
          options={LEAVE_TYPES.map((type) => ({ value: type.id, label: type.name }))}
          required
        />

        {/* Balance Warning */}
        {selectedLeaveType && selectedLeaveType.isPaid && (
          <div className="bg-warning-50 rounded-md p-4">
            <p className="text-warning-400 text-sm font-medium">
              You have a balance of {selectedLeaveType.balance} remaining {selectedLeaveType.name.toLowerCase()} days
            </p>
          </div>
        )}

        {/* Date Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            type="date"
            label="Start Date"
            name="startDate"
            placeholder="Select start date"
            className="!h-14 w-full"
            required
          />

          <FormField
            type="date"
            label="End Date"
            name="endDate"
            placeholder="Select end date"
            className="!h-14 w-full"
            required
          />
        </div>

        {/* Reason Field */}
        <FormField
          type="textarea"
          label="Reason"
          name="reason"
          placeholder="State your reason here..."
          className="min-h-[100px] w-full"
          labelDetailedNode={<span className="text-muted-foreground">(Optional)</span>}
        />

        {/* File Upload - Simplified placeholder */}
        <div className="space-y-2">
          <label className="text-base font-medium">
            Attach Supporting Document <span className="text-muted-foreground text-sm">(Optional)</span>
          </label>
          <div className="border-primary-300 bg-primary-50 flex flex-col items-center gap-2 rounded-md border border-dashed p-6 text-center">
            <Upload className="text-primary-300 h-6 w-6" />
            <p className="text-primary-300 text-sm font-medium">Browse files or drag and drop here</p>
            <p className="text-muted-foreground text-xs">PDF, JPEG, or PNG (Max 5MB)</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <MainButton
            type="button"
            variant="outline"
            onClick={onCancel}
            isDisabled={isSubmitting || rhfSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </MainButton>
          <MainButton
            type="submit"
            variant="primary"
            isDisabled={!isValid || isSubmitting || rhfSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting || rhfSubmitting ? 'Submitting...' : 'Submit Request'}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
