'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@workspace/ui/lib/inputs/FormFields';
import { MainButton } from '@workspace/ui/lib/button';
import { FileUploader } from '@workspace/ui/components/core/miscellaneous/file-uploader';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { requestLeaveSchema } from '../../schemas/request-leave-form';
import type { RequestLeaveFormValues } from '../../types';
import type { RequestLeaveFormProps } from '../../types';

export const RequestLeaveForm = ({
  leaveTypes,
  isLoadingTypes = false,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: RequestLeaveFormProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const methods = useForm<RequestLeaveFormValues>({
    resolver: zodResolver(requestLeaveSchema),
    defaultValues: {
      leaveId: initialData?.leaveId ?? '',
      startDate: initialData?.startDate ?? '',
      endDate: initialData?.endDate ?? '',
      reason: initialData?.reason ?? '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting: isFormSubmitting, isValid },
    reset,
  } = methods;

  useEffect(() => {
    reset({
      leaveId: initialData?.leaveId ?? '',
      startDate: initialData?.startDate ?? '',
      endDate: initialData?.endDate ?? '',
      reason: initialData?.reason ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialData?.leaveId,
    initialData?.startDate,
    initialData?.endDate,
    initialData?.reason,
  ]);

  const submit = async (values: RequestLeaveFormValues) => {
    await onSubmit({ ...values, document: selectedFiles[0] });
  };

  const safeLeaveTypes = Array.isArray(leaveTypes) ? leaveTypes : [];

  const leaveTypeOptions = safeLeaveTypes.map((leaveType) => ({
    value: leaveType.id,
    label: leaveType.name,
  }));

  const isSubmittingForm = isSubmitting || isFormSubmitting;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        <FormField
          type="select"
          label="Select Leave Type"
          name="leaveId"
          placeholder={isLoadingTypes ? 'Loading...' : 'Choose a leave type'}
          className="h-14! w-full"
          options={leaveTypeOptions}
          required
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            type="date"
            label="Start Date"
            name="startDate"
            placeholder="Select start date"
            className="h-14! w-full"
            required
          />

          <FormField
            type="date"
            label="End Date"
            name="endDate"
            placeholder="Select end date"
            className="h-14! w-full"
            required
          />
        </div>

        <FormField
          type="textarea"
          label="Reason"
          name="reason"
          placeholder="State your reason here..."
          className="min-h-25 w-full"
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Attach Supporting Document{' '}
            <span className="text-muted-foreground font-normal">
              (Optional)
            </span>
          </label>
          <FileUploader
            value={selectedFiles}
            onValueChange={setSelectedFiles}
            accept={{
              'application/pdf': ['.pdf'],
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
            }}
            maxSize={5 * 1024 * 1024}
            maxFiles={1}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <MainButton
            type="button"
            variant="destructiveOutline"
            onClick={onCancel}
            isDisabled={isSubmittingForm}
            className="w-full sm:w-auto"
          >
            Cancel
          </MainButton>
          <MainButton
            type="submit"
            variant="primary"
            isDisabled={!isValid || isSubmittingForm}
            className="w-full sm:w-auto"
          >
            {isSubmittingForm ? 'Submitting...' : `Submit Request`}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
