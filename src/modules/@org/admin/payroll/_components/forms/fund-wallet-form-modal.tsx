"use client";

import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { FormField } from "@/components/shared/inputs/FormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const fundWalletSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export interface FundWalletFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface FundWalletFormModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FundWalletFormData) => void;
  initialData?: FundWalletFormData;
}

export function FundWalletFormModal({ open, onOpenChange, onSubmit, initialData }: FundWalletFormModalProperties) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FundWalletFormData>({
    resolver: zodResolver(fundWalletSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const { handleSubmit } = methods;

  const handleFormSubmit = async (data: FundWalletFormData, event?: React.BaseSyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      methods.reset();
      onOpenChange(false);
    } catch {
      // Handle error silently or show toast notification
      // Error handling can be improved with toast notifications
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    methods.reset();
    onOpenChange(false);
  };

  return (
    <ReusableDialog
      trigger={<></>}
      open={open}
      onOpenChange={onOpenChange}
      title="Set up Payroll Wallet"
      className="!max-w-lg"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit(handleFormSubmit)(event);
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              name="firstName"
              label="First Name"
              placeholder="Enter name"
              type="text"
              className="!h-14 w-full"
            />

            <FormField
              name="lastName"
              label="Last Name"
              placeholder="Enter name"
              type="text"
              className="!h-14 w-full"
            />

            <FormField
              name="email"
              label="Email Address"
              placeholder="Enter address"
              type="email"
              className="!h-14 w-full"
            />

            <FormField
              name="phoneNumber"
              label="Phone Number"
              placeholder="Enter phone number"
              type="text"
              className="!h-14 w-full"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <MainButton
              className="w-full"
              type="button"
              variant="outline"
              onClick={handleCancel}
              isDisabled={isSubmitting}
            >
              Cancel
            </MainButton>
            <MainButton className="w-full" type="submit" variant="primary" isDisabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </MainButton>
          </div>
        </form>
      </FormProvider>
    </ReusableDialog>
  );
}
