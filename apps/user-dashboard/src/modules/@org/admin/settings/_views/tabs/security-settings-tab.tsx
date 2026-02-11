"use client";

import { FormField, SwitchField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { AlertModal } from "@workspace/ui/lib/dialog";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

type SecuritySettingsFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  enable2fa: boolean;
};

const DEFAULT_VALUES: SecuritySettingsFormValues = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  enable2fa: true,
};

export const SecuritySettingsTab = () => {
  const methods = useForm<SecuritySettingsFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const [updatedModalOpen, setUpdatedModalOpen] = useState(false);

  const onSubmit = () => {
    // UI feedback modal (API wiring pending)
    setUpdatedModalOpen(true);
  };

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Security Settings</h3>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="rounded-lg p-4 sm:p-6">
          <div className="grid gap-10 lg:grid-cols-[560px_1fr]">
            {/* Left descriptors */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Reset Password</h4>
              <p className="text-muted-foreground text-xs">Update your account password to keep it secure.</p>
            </div>

            {/* Right form */}
            <div className="space-y-4">
              <FormField
                name="oldPassword"
                label="Old Password"
                type="password"
                placeholder="Enter password"
                className="h-14"
              />
              <FormField
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="Enter password"
                className="h-14"
              />
              <FormField
                name="confirmNewPassword"
                label="Confirm New Password"
                type="password"
                placeholder="Enter password"
                className="h-14"
              />

              <div className="flex items-center gap-4 pt-2">
                <MainButton
                  variant="outline"
                  type="button"
                  className="w-full sm:w-[137px]"
                  size="xl"
                  onClick={() => methods.reset(DEFAULT_VALUES)}
                >
                  Cancel
                </MainButton>
                <MainButton size="xl" variant="primary" type="submit" className="w-full sm:w-[137px]">
                  Save Changes
                </MainButton>
              </div>
              <div className="mt-8">
                <SwitchField
                  name="enable2fa"
                  label="Enable 2factor authentication"
                  className="flex items-center justify-between"
                  labelClassname="text-base"
                />
              </div>
            </div>
          </div>
        </form>

        <AlertModal
          isOpen={updatedModalOpen}
          onClose={() => setUpdatedModalOpen(false)}
          onConfirm={() => setUpdatedModalOpen(false)}
          type="success"
          title="Password Updated"
          description="Your password have been changed successfully"
          confirmText="Continue"
          showCancelButton={false}
        />
      </FormProvider>
    </section>
  );
};
