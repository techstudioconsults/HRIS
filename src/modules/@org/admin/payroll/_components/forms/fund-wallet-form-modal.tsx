"use client";

import MainButton from "@/components/shared/button";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { FormField } from "@/components/shared/inputs/FormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { usePayrollService } from "../../services/use-service";
import { usePayrollStore } from "../../stores/payroll-store";

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
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  onFundWallet?: () => void;
  initialData?: FundWalletFormData;
}

export function FundWalletFormModal({ open, onOpenChange, initialData }: FundWalletFormModalProperties) {
  const { setShowFundWalletAccountModal } = usePayrollStore();
  const { useUpdateCompanyWallet } = usePayrollService();
  const updateWallet = useUpdateCompanyWallet();

  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

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

  const handleFormSubmit = async (data: FundWalletFormData) => {
    try {
      await updateWallet.mutateAsync(data);
      // Close the main modal first
      onOpenChange(false);
      // Add a small delay before showing the success alert modal
      setTimeout(() => {
        setIsSuccessAlertOpen(true);
      }, 300); // 300ms delay for smooth transition
    } catch {
      // Handle error silently or show toast notification
      // Error handling can be improved with toast notifications
    }
  };

  const handleCancel = () => {
    methods.reset();
    onOpenChange(false);
  };

  const handleSuccessAlertClose = () => {
    setIsSuccessAlertOpen(false);
    // Reset form after a small delay to allow modal close animation
    setTimeout(() => {
      methods.reset();
    }, 200);
  };

  const handleFundWalletClick = () => {
    setShowFundWalletAccountModal(true);
    setIsSuccessAlertOpen(false);
  };

  return (
    <>
      <ReusableDialog
        trigger={""}
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
                className="!h-12 w-full"
              />

              <FormField
                name="lastName"
                label="Last Name"
                placeholder="Enter name"
                type="text"
                className="!h-12 w-full"
              />

              <FormField
                name="email"
                label="Email Address"
                placeholder="Enter address"
                type="email"
                className="!h-12 w-full"
              />

              <FormField
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter phone number"
                type="text"
                className="!h-12 w-full"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <MainButton
                className="w-full"
                type="button"
                variant="outline"
                onClick={handleCancel}
                isDisabled={updateWallet.isPending}
              >
                Cancel
              </MainButton>
              <MainButton
                className="w-full"
                type="submit"
                variant="primary"
                isLoading={updateWallet.isPending}
                isDisabled={updateWallet.isPending}
              >
                {updateWallet.isPending ? "Saving..." : "Save & Continue"}
              </MainButton>
            </div>
          </form>
        </FormProvider>
      </ReusableDialog>

      <AlertModal
        isOpen={isSuccessAlertOpen}
        onClose={handleSuccessAlertClose}
        onConfirm={handleFundWalletClick}
        type="success"
        title="Wallet Setup Completed"
        description="Your payroll wallet setup has been completed successfully!"
        confirmText="Fund Wallet"
        cancelText="Cancel"
        showCancelButton={true}
        autoClose={false}
      />
    </>
  );
}
