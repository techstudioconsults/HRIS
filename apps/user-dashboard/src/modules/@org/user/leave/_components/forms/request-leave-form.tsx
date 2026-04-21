'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  requestLeaveSchema,
  type RequestLeaveFormValues,
} from '../../schemas/request-leave-form';
import type { RequestLeaveFormProps } from '../../types';

export const RequestLeaveForm = ({
  leaveTypes,
  isLoadingTypes = false,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  // submitLabel = 'Submit Request',
}: RequestLeaveFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    await onSubmit({ ...values, document: selectedFile ?? undefined });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
          className="min-h-[100px] w-full"
          required
        />

        <div className="space-y-2">
          <label className="text-base font-medium">
            Attach Supporting Document{' '}
            <span className="text-muted-foreground text-sm">(Optional)</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />

          {selectedFile ? (
            <div className="border-border flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <Icon
                  name="FileText"
                  size={16}
                  className="text-primary shrink-0"
                />
                <span className="truncate text-sm font-medium">
                  {selectedFile.name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-muted-foreground hover:text-destructive shrink-0 p-1"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-primary-300 bg-primary-50 flex w-full flex-col items-center gap-2 rounded-md border border-dashed p-6 text-center"
            >
              <Icon name="Upload" size={24} className="text-primary-300" />
              <p className="text-primary-300 text-sm font-medium">
                Browse files or drag and drop here
              </p>
              <p className="text-muted-foreground text-xs">
                PDF, JPEG, or PNG (Max 5MB)
              </p>
            </button>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <MainButton
            type="button"
            variant="outline"
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
