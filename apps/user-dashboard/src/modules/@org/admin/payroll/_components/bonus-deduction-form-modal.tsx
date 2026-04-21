'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@workspace/ui/components/switch';
import { FormField, ReusableDialog } from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { bonusDeductionSchema } from '../schemas/forms';
import type {
  BonusDeductionFormData,
  BonusDeductionFormModalProperties,
} from '../types';

export function BonusDeductionFormModal({
  open,
  onOpenChange,
  onSubmit,
  type,
  initialData,
  isEditing = false,
}: BonusDeductionFormModalProperties) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<BonusDeductionFormData>({
    resolver: zodResolver(bonusDeductionSchema),
    defaultValues: initialData || {
      name: '',
      valueType: 'percentage',
      value: 0,
      status: true,
      type: type,
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const valueType = watch('valueType');
  const status = watch('status');

  // Reset form values whenever modal opens or initialData/type changes
  // This ensures the edit form populates inputs with the original values
  useEffect(() => {
    if (open) {
      methods.reset(
        initialData || {
          name: '',
          valueType: 'percentage',
          value: 0,
          status: true,
          type,
        }
      );
    }
  }, [open, initialData, type, methods]);

  const handleFormSubmit = async (data: BonusDeductionFormData) => {
    setIsSubmitting(true);
    try {
      onSubmit(data);
      methods.reset();
      onOpenChange(false);
    } catch {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    methods.reset();
    onOpenChange(false);
  };

  return (
    <ReusableDialog
      trigger={''}
      open={open}
      onOpenChange={onOpenChange}
      title={`${isEditing ? 'Edit' : 'Add'} ${type}`}
      className="lg:max-w-lg!"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleSubmit(handleFormSubmit)(event);
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              name="name"
              label={`${type} Name`}
              placeholder={`Enter ${type} name`}
              type="text"
              className="h-14! w-full"
            />

            <FormField
              name="valueType"
              label="Value Type"
              placeholder="Select type"
              type="select"
              className="h-14! w-full"
              options={[
                { label: 'Percentage', value: 'percentage' },
                { label: 'Fixed Amount', value: 'fixed' },
              ]}
            />

            <FormField
              name="value"
              label="Value"
              placeholder={`Enter value${valueType === 'percentage' ? ' (e.g., 4.5)' : ' (e.g., 3000)'}`}
              type="number"
              className="h-14! w-full"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium">Active</label>
                <Switch
                  checked={status}
                  onCheckedChange={(checked) => setValue('status', checked)}
                />
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Setting this to active means you want this {type} to reoccur in
                the other cycles.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <MainButton
              className="w-full"
              type="button"
              variant="outline"
              onClick={handleCancel}
              isDisabled={isSubmitting}
            >
              Cancel
            </MainButton>
            <MainButton
              className="w-full"
              type="button"
              variant="primary"
              isDisabled={isSubmitting}
              onClick={(event: React.BaseSyntheticEvent) => {
                event.preventDefault();
                event.stopPropagation();
                handleSubmit(handleFormSubmit)();
              }}
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
            </MainButton>
          </div>
        </form>
      </FormProvider>
    </ReusableDialog>
  );
}
