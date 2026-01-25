"use client";

import { getApiErrorMessage } from "@/lib/tools/api-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@workspace/ui/components/switch";
import { FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useLeaveService } from "../../services/use-service";

const createLeaveTypeSchema = z
  .object({
    name: z.string().min(1, "Leave name is required"),
    days: z
      .number({ required_error: "Days is required", invalid_type_error: "Days must be a number" })
      .min(1, "Days must be greater than 0"),
    cycle: z.string().min(1, "Leave cycle is required"),
    maxLeaveDaysPerRequest: z
      .number({
        required_error: "Maximum leave days per request is required",
        invalid_type_error: "Maximum leave days per request must be a number",
      })
      .min(1, "Maximum leave days per request must be greater than 0"),
    enableRollover: z.boolean(),
    maxNumberOfRollOver: z.number({ invalid_type_error: "Maximum roll over must be a number" }).optional(),
    eligibility: z
      .string()
      .min(1, "Eligibility is required")
      .refine((value) => ["3", "6", "12", "24", "36", "48"].includes(value), {
        message: "eligibility must be one of [3, 6, 12, 24, 36, 48]",
      }),
  })
  .superRefine((data, context) => {
    if (!data.enableRollover) return;
    if (data.maxNumberOfRollOver === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxNumberOfRollOver"],
        message: "Maximum roll over is required when roll over is enabled",
      });
      return;
    }
    if (!Number.isFinite(data.maxNumberOfRollOver) || data.maxNumberOfRollOver <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxNumberOfRollOver"],
        message: "Maximum roll over must be greater than 0",
      });
    }
  });

type CreateLeaveTypeFormValues = z.infer<typeof createLeaveTypeSchema>;

interface CreateLeaveTypeFormProperties {
  onClose?: () => void;
}

export const CreateLeaveTypeForm = ({ onClose }: CreateLeaveTypeFormProperties) => {
  const { useCreateLeaveType } = useLeaveService();
  const { mutateAsync: createLeaveType, isPending } = useCreateLeaveType();

  const methods = useForm<CreateLeaveTypeFormValues>({
    resolver: zodResolver(createLeaveTypeSchema),
    defaultValues: {
      name: "",
      days: undefined as unknown as number,
      cycle: "",
      maxLeaveDaysPerRequest: undefined as unknown as number,
      enableRollover: false,
      maxNumberOfRollOver: undefined,
      eligibility: "",
    },
  });

  const eligibilityOptions = useMemo(
    () => [
      { value: "3", label: "3 Months+" },
      { value: "6", label: "6 Months+" },
      { value: "12", label: "12 Months+" },
      { value: "24", label: "24 Months+" },
      { value: "36", label: "36 Months+" },
      { value: "48", label: "48 Months+" },
    ],
    [],
  );

  const cycleOptions = useMemo(
    () => [
      { value: "yearly", label: "Yearly" },
      { value: "monthly", label: "Monthly" },
      { value: "weekly", label: "Weekly" },
      { value: "daily", label: "Daily" },
    ],
    [],
  );

  const enableRollover = methods.watch("enableRollover");

  const handleCancel = () => {
    methods.reset();
    onClose?.();
  };

  const onSubmit = async (data: CreateLeaveTypeFormValues) => {
    await createLeaveType(
      {
        name: data.name,
        days: data.days,
        cycle: data.cycle,
        maxLeaveDaysPerRequest: data.maxLeaveDaysPerRequest,
        eligibility: data.eligibility,
        ...(data.enableRollover ? { maxNumberOfRollOver: data.maxNumberOfRollOver } : {}),
      },
      {
        onSuccess: () => {
          toast.success(`Leave type "${data.name}" created.`);
          handleCancel();
        },
        onError: (error) => {
          toast.error("Failed to create leave type", {
            description: getApiErrorMessage(error, "Unable to create leave type. Please try again."),
          });
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 py-4">
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
              name="cycle"
              label="Leave Cycle"
              placeholder="Select Leave Cycle"
              type="select"
              className="bg-background border-border !h-12"
              options={cycleOptions}
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
                      methods.setValue("maxNumberOfRollOver", undefined, { shouldDirty: true, shouldValidate: true });
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
            <FormField name="days" label="Days" required placeholder="Enter number" type="number" className="!h-12" />
            <FormField
              name="maxLeaveDaysPerRequest"
              label="Maximum Leave Days Per Request"
              required
              placeholder="Enter number"
              type="number"
              className="!h-12"
            />
            <FormField
              name="maxNumberOfRollOver"
              label="Maximum Number of Roll Over"
              placeholder="Enter number"
              type="number"
              className="!h-12"
              disabled={!enableRollover}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <MainButton type="button" variant="outline" className="w-full" onClick={handleCancel} isDisabled={isPending}>
            Cancel
          </MainButton>
          <MainButton type="submit" variant="primary" className="w-full" isLoading={isPending} isDisabled={isPending}>
            {isPending ? "Creating..." : "Create Leave Type"}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
