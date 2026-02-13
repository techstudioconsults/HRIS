"use client";

import { Checkbox } from "@workspace/ui/components/checkbox";
import { MainButton } from "@workspace/ui/lib/button";
import { AlertModal } from "@workspace/ui/lib/dialog";
import { SwitchField } from "@workspace/ui/lib/inputs/FormFields";
import { cn } from "@workspace/ui/lib/utils";
import { useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

type NotificationCategoryKey =
  | "newEmployeeAdded"
  | "employeeTermination"
  | "newRoleCreated"
  | "newTeamCreated"
  | "resourceUploaded"
  | "probationReviewDue"
  | "salaryDisbursement"
  | "walletTopUp"
  | "paydayReminder"
  | "loginFromNewDevice"
  | "passwordChange"
  | "rolePermissionChanges";

type NotificationSettingsFormValues = {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  categories: Record<NotificationCategoryKey, boolean>;
};

const DEFAULT_VALUES: NotificationSettingsFormValues = {
  emailNotifications: true,
  inAppNotifications: false,
  categories: {
    newEmployeeAdded: true,
    employeeTermination: true,
    newRoleCreated: true,
    newTeamCreated: true,
    resourceUploaded: true,
    probationReviewDue: false,
    salaryDisbursement: false,
    walletTopUp: true,
    paydayReminder: true,
    loginFromNewDevice: true,
    passwordChange: true,
    rolePermissionChanges: false,
  },
};

function CategoryCheckbox({ name, label }: { name: `categories.${NotificationCategoryKey}`; label: string }) {
  return (
    <Controller
      name={name}
      render={({ field }) => (
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            className={`border-primary/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary`}
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
          />
          <span className="text-muted-foreground">{label}</span>
        </label>
      )}
    />
  );
}

export const NotificationSettingsTab = () => {
  const methods = useForm<NotificationSettingsFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const [updatedModalOpen, setUpdatedModalOpen] = useState(false);

  const groupedCategories = useMemo(
    () => [
      {
        title: "HR & Employee Management",
        items: [
          { key: "newEmployeeAdded" as const, label: "New employee added" },
          { key: "employeeTermination" as const, label: "Employee termination/resignation" },
          { key: "newRoleCreated" as const, label: "New role created" },
          { key: "newTeamCreated" as const, label: "New team created" },
          { key: "resourceUploaded" as const, label: "Resource uploaded" },
          { key: "probationReviewDue" as const, label: "Probation review due" },
        ],
      },
      {
        title: "Payroll & Finance",
        items: [
          { key: "salaryDisbursement" as const, label: "Salary disbursement" },
          { key: "walletTopUp" as const, label: "Wallet top up" },
          { key: "paydayReminder" as const, label: "Payday reminder" },
        ],
      },
      {
        title: "System & Security",
        items: [
          { key: "loginFromNewDevice" as const, label: "Login from new device" },
          { key: "passwordChange" as const, label: "Password Change" },
          { key: "rolePermissionChanges" as const, label: "Role/Permission Changes" },
        ],
      },
    ],
    [],
  );

  const onSubmit = () => {
    // UI feedback modal (API wiring pending)
    setUpdatedModalOpen(true);
  };

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Notification Settings</h3>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="rounded-lg p-4 sm:p-8 shadow bg-background">
          <div className="grid gap-10 lg:grid-cols-[560px_1fr]">
            {/* Left descriptors */}
            <div className="space-y-10">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">Notification Channels</h4>
                <p className="text-muted-foreground text-xs">Choose your preferred way of receiving notifications</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">Notification Categories</h4>
                <p className="text-muted-foreground text-xs">Toggle on/off for specific events</p>
              </div>
            </div>

            {/* Right controls */}
            <div className="space-y-10">
              <div className="space-y-4">
                <SwitchField
                  name="emailNotifications"
                  label="Email Notifications"
                  className="flex items-center justify-between !text-base"
                  labelClassname="text-base"
                />
                <SwitchField
                  name="inAppNotifications"
                  label="In-app Notifications"
                  className="flex items-center justify-between"
                  labelClassname="text-base"
                />
              </div>

              <div className="space-y-8">
                {groupedCategories.map((group) => (
                  <div key={group.title} className="space-y-3">
                    <p className="text-lg font-semibold">{group.title}</p>
                    <div className={cn("space-y-2")}>
                      {group.items.map((item) => (
                        <CategoryCheckbox key={item.key} name={`categories.${item.key}`} label={item.label} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
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
          description="Notification settings have been successfully updated."
          confirmText="Continue"
          showCancelButton={false}
        />
      </FormProvider>
    </section>
  );
};
