"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@workspace/ui/components/switch";
import { AlertModal, BreadCrumb, FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { getApiErrorMessage } from "@/lib/tools/api-error-message";
import { useLeaveService } from "../../services/use-service";
import { useLeaveStore } from "../../stores/leave-store";

const leaveSetupSchema = z
  .object({
    name: z.string().min(1, "Leave name is required"),
    days: z
      .number({
        required_error: "Days is required",
        invalid_type_error: "Days must be a number",
      })
      .min(1, "Days must be greater than 0"),
    maxPerRequest: z
      .number({
        required_error: "Maximum leave days per request is required",
        invalid_type_error: "Maximum leave days per request must be a number",
      })
      .min(1, "Maximum leave days per request must be greater than 0"),
    leaveCycle: z.string().min(1, "Leave cycle is required"),
    enableRollover: z.boolean(),
    maxRollover: z.number({ invalid_type_error: "Maximum number of roll over must be a number" }).optional(),
    // API payload expects eligibility as a string month value e.g. "12"
    eligibility: z
      .string()
      .min(1, "Eligibility is required")
      .refine((value) => ["3", "6", "12", "24", "36", "48"].includes(value), {
        message: "eligibility must be one of [3, 6, 12, 24, 36, 48]",
      }),
  })
  .superRefine((data, context) => {
    if (!data.enableRollover) return;

    if (data.maxRollover === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxRollover"],
        message: "Maximum number of roll over is required when roll over is enabled",
      });
      return;
    }

    if (!Number.isFinite(data.maxRollover) || data.maxRollover <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxRollover"],
        message: "Maximum number of roll over must be greater than 0",
      });
    }
  });

type LeaveSetupFormValues = z.infer<typeof leaveSetupSchema>;

export const LeaveSetupForm = () => {
  const router = useRouter();
  const [isSubmittedAlertOpen, setIsSubmittedAlertOpen] = useState(false);
  const { setHasCompletedLeaveSetup, setShowLeaveSetupModal } = useLeaveStore();
  const { useCreateLeaveType } = useLeaveService();
  const createLeaveTypeMutation = useCreateLeaveType();

  const methods = useForm<LeaveSetupFormValues>({
    resolver: zodResolver(leaveSetupSchema),
    defaultValues: {
      name: "",
      // numeric fields are returned as numbers from our FormField when type="number"
      // use `undefined` so the inputs render empty by default.
      days: undefined as unknown as number,
      maxPerRequest: undefined as unknown as number,
      leaveCycle: "",
      enableRollover: false,
      maxRollover: undefined,
      eligibility: "",
    },
  });

  // Required employment duration options (single-select)
  const eligibilityOptions = useMemo(
    () => [
      // API expects eligibility in months.
      { value: "3", label: "3 Months+" },
      { value: "6", label: "6 Months+" },
      { value: "12", label: "12 Months+" },
      { value: "24", label: "24 Months+" },
      { value: "36", label: "36 Months+" },
      { value: "48", label: "48 Months+" },
    ],
    [],
  );

  const leaveCycleOptions = useMemo(
    () => [
      { value: "yearly", label: "Yearly" },
      { value: "monthly", label: "Monthly" },
      { value: "weekly", label: "Weekly" },
      { value: "daily", label: "Daily" },
    ],
    [],
  );

  const onSubmit = async (data: LeaveSetupFormValues) => {
    // Transform form values to API payload shape
    const payload = {
      name: data.name,
      days: data.days,
      cycle: data.leaveCycle,
      maxLeaveDaysPerRequest: data.maxPerRequest,
      eligibility: data.eligibility,
      // do not submit rollover boolean; only submit maxNumberOfRollOver when rollover is enabled
      ...(data.enableRollover ? { maxNumberOfRollOver: data.maxRollover } : {}),
    };
    try {
      await createLeaveTypeMutation.mutateAsync(payload);
      setIsSubmittedAlertOpen(true);
      setShowLeaveSetupModal(false);
      setHasCompletedLeaveSetup(true);
    } catch (error) {
      toast.error("Failed to save leave type", {
        description: getApiErrorMessage(error, "Unable to save leave type. Please try again."),
      });
    }
  };

  const enableRollover = methods.watch("enableRollover");

  return (
    <section>
      <h1 className="text-2xl font-bold">Add Leave Type</h1>
      <BreadCrumb
        items={[{ label: "All Leaves", href: "/admin/leave" }, { label: "Add Leave Type" }]}
        className="mb-6"
      />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="space-y-10">
            <section>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <FormField
                    name="name"
                    label="Leave Name"
                    placeholder="Annual Leave"
                    required
                    type="text"
                    className="!h-12"
                  />
                  <FormField
                    name="leaveCycle"
                    label="Leave Cycle"
                    placeholder="Select Leave Cycle"
                    type="select"
                    className="bg-background border-border !h-12"
                    options={leaveCycleOptions}
                    required
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Roll Over</label>
                    <div className="bg-background border-border mt-1.5 flex h-12 items-center justify-between rounded-md border px-4">
                      <span className="text-muted-foreground text-sm">Unused leaves will be rolled over</span>
                      <Switch
                        checked={enableRollover}
                        onCheckedChange={(checked) => {
                          methods.setValue("enableRollover", checked, { shouldDirty: true, shouldValidate: true });
                          if (!checked) {
                            methods.setValue("maxRollover", undefined, { shouldDirty: true, shouldValidate: true });
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
                    className="bg-background border-border !h-12"
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
                    className="!h-12"
                  />
                  <FormField
                    name="maxPerRequest"
                    label="Maximum Leave Days Per Request"
                    required
                    placeholder="Enter number"
                    type="number"
                    className="!h-12"
                  />
                  <FormField
                    name="maxRollover"
                    label="Maximum Number of Roll Over"
                    placeholder="Enter number"
                    type="number"
                    className="!h-12"
                    disabled={!enableRollover}
                  />
                </div>
              </div>
            </section>

            <div className="flex gap-4">
              <MainButton type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </MainButton>
              <MainButton type="submit" variant="primary">
                Save Leave
              </MainButton>
            </div>
          </div>
        </form>
      </FormProvider>

      {/* Success Alert */}
      <AlertModal
        isOpen={isSubmittedAlertOpen}
        onClose={() => setIsSubmittedAlertOpen(false)}
        type="success"
        title="Leave Setup Complete!"
        description="Your leave type has been saved successfully. You can now manage leave requests and balances."
        confirmText="Go to Leave Hub"
        cancelText="Close"
        onConfirm={() => {
          setIsSubmittedAlertOpen(false);
          router.push("/admin/leave/type");
        }}
      />
    </section>
  );
};
