'use client';

import { useTour } from '@/modules/@org/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertModal, ReusableDialog } from '@workspace/ui/lib/dialog';
import { FormField } from '@workspace/ui/lib/inputs/FormFields';
import { MainButton } from '@workspace/ui/lib/button';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { usePayrollModalParams } from '@/lib/nuqs/use-payroll-modal-params';
import { generatePayrollTourStep } from '../../config/tour-steps';
import { fundWalletSchema } from '../../schemas/forms';
import { usePayrollService } from '../../services/use-service';
import { usePayrollStore } from '../../stores/payroll-store';
import type {
  FundWalletFormData,
  FundWalletFormModalProperties,
} from '../../types';

export function FundWalletFormModal({
  initialData,
  isGeneratePayrollBannerShowing,
}: FundWalletFormModalProperties) {
  // ── URL state (nuqs) — modal open/close survive refresh ──────────────────
  const { isFundWalletOpen, closeModal, openFundWalletAccount } =
    usePayrollModalParams();

  // ── Zustand — non-URL business state ─────────────────────────────────────
  const {
    setHasCompletedPayrollPolicySetupForm,
    setWalletSetupCompleted,
    walletSetupCompleted,
  } = usePayrollStore();
  const { startTour } = useTour();
  const { useUpdateCompanyWallet } = usePayrollService();
  const { mutateAsync: updateWallet, isPending } = useUpdateCompanyWallet();

  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

  const methods = useForm<FundWalletFormData>({
    resolver: zodResolver(fundWalletSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  });

  const { handleSubmit } = methods;

  const handleFormSubmit = async (data: FundWalletFormData) => {
    try {
      await updateWallet(data, {
        onSuccess: () => {
          closeModal();
          setTimeout(() => {
            setIsSuccessAlertOpen(true);
            setHasCompletedPayrollPolicySetupForm(false);
            // Signal to the payroll view that wallet setup has just completed
            setWalletSetupCompleted(true);
          }, 300);
        },
        onError: (error) => {
          return error;
        },
      });
    } catch {
      return;
    }
  };

  const handleCancel = () => {
    methods.reset();
  };

  const handleSuccessAlertClose = () => {
    setIsSuccessAlertOpen(false);
    if (walletSetupCompleted && isGeneratePayrollBannerShowing) {
      startTour(generatePayrollTourStep);
    }
    setTimeout(() => {
      methods.reset();
    }, 200);
  };

  const handleFundWalletClick = () => {
    openFundWalletAccount();
    setIsSuccessAlertOpen(false);
  };

  return (
    <>
      <ReusableDialog
        trigger={''}
        open={isFundWalletOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title="Set up Payroll Wallet"
        className="min-w-md"
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
                className="h-12! w-full"
              />

              <FormField
                name="lastName"
                label="Last Name"
                placeholder="Enter name"
                type="text"
                className="h-12! w-full"
              />

              <FormField
                name="email"
                label="Email Address"
                placeholder="Enter address"
                type="email"
                className="h-12! w-full"
              />

              <FormField
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter phone number"
                type="text"
                className="h-12! w-full"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <MainButton
                className="w-full"
                type="button"
                variant="outline"
                onClick={handleCancel}
                isDisabled={isPending}
              >
                Cancel
              </MainButton>
              <MainButton
                className="w-full"
                type="submit"
                variant="primary"
                isLoading={isPending}
                isDisabled={isPending}
              >
                {isPending ? 'Saving...' : 'Save & Continue'}
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
