"use client";

import { FormField, SwitchField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { AlertModal } from "@workspace/ui/lib/dialog";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

type GeneralHRRulesFormValues = {
  probationLength: string;
  autoConfirmAfterProbation: boolean;
  requireManualConfirmationReview: boolean;
  minimumNoticePeriodDays?: number;
  probationReminders: boolean;
  workAnniversaryReminders: boolean;
};

const DEFAULT_VALUES: GeneralHRRulesFormValues = {
  probationLength: "",
  autoConfirmAfterProbation: true,
  requireManualConfirmationReview: false,
  minimumNoticePeriodDays: undefined,
  probationReminders: true,
  workAnniversaryReminders: true,
};

const probationLengthOptions = [
  { value: "1_month", label: "1 Month" },
  { value: "3_months", label: "3 Months" },
  { value: "6_months", label: "6 Months" },
  { value: "12_months", label: "12 Months" },
];

export function HRSettingsGeneralRulesTab() {
  const methods = useForm<GeneralHRRulesFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const [updatedModalOpen, setUpdatedModalOpen] = useState(false);

  const onSubmit = () => {
    // UI feedback modal (API wiring pending)
    setUpdatedModalOpen(true);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="rounded-lg p-4 sm:p-6">
        <div className="space-y-1">
          <h4 className="text-base font-semibold">Rules &amp; Governance</h4>
        </div>

        <div className="mt-6 space-y-8">
          {/* Probation & Confirmation */}
          <div className="grid gap-6 md:grid-cols-[580px_1fr]">
            <div>
              <h5 className="text-muted-foreground text-base font-semibold">Probation &amp; Confirmation</h5>
            </div>
            <div className="space-y-4">
              <FormField
                name="probationLength"
                label="Probation Length"
                type="select"
                options={probationLengthOptions}
                placeholder="Select probation length"
                className="!h-14"
              />

              <SwitchField
                name="autoConfirmAfterProbation"
                label="Auto-confirm after probation"
                className="text-muted-foreground flex items-center justify-between gap-4"
              />

              <SwitchField
                name="requireManualConfirmationReview"
                label="Require manual confirmation review"
                className="text-muted-foreground flex items-center justify-between gap-4"
              />
            </div>
          </div>

          {/* Resignation Notice Period */}
          <div className="mt-20 grid gap-6 md:grid-cols-[580px_1fr]">
            <div>
              <h5 className="text-muted-foreground text-base font-semibold">Resignation Notice Period</h5>
            </div>
            <div>
              <FormField
                name="minimumNoticePeriodDays"
                label="Minimum notice period"
                type="number"
                placeholder="Enter days"
                className="h-14"
              />
            </div>
          </div>

          {/* Reminders & Milestones */}
          <div className="grid gap-6 md:grid-cols-[580px_1fr]">
            <div>
              <h5 className="text-muted-foreground text-base font-semibold">Reminders &amp; Milestones</h5>
            </div>
            <div className="space-y-4">
              <SwitchField
                name="probationReminders"
                label="Probation reminders"
                className="text-muted-foreground flex items-center justify-between gap-4"
              />
              <SwitchField
                name="workAnniversaryReminders"
                label="Work anniversary reminders"
                className="text-muted-foreground flex items-center justify-between gap-4"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[580px_1fr]">
            <div />
            <div className="space-x-4">
              <MainButton
                variant="outline"
                type="button"
                className="w-full sm:w-[137px]"
                onClick={() => methods.reset(DEFAULT_VALUES)}
              >
                Cancel
              </MainButton>
              <MainButton variant="primary" type="submit" className="w-full sm:w-[137px]">
                Save Changes
              </MainButton>
            </div>
          </div>
        </div>
      </form>

      <AlertModal
        isOpen={updatedModalOpen}
        onClose={() => setUpdatedModalOpen(false)}
        onConfirm={() => setUpdatedModalOpen(false)}
        type="success"
        title="Settings Updated"
        description="General HR Rules settings have been successfully updated."
        confirmText="Continue"
        showCancelButton={false}
      />
    </FormProvider>
  );
}
