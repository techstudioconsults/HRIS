"use client";

import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { useEffect } from "react";

import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";

interface PayrollSetupModalProperties {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export const PayrollSetupModal = ({ trigger }: PayrollSetupModalProperties) => {
  const { showSetupModal, setShowSetupModal, hasCompletedSetupForm } = usePayrollStore();
  const { useGetCompanyPayrollPolicy, useGetCompanyWallet } = usePayrollService();
  const { data: companyPayrollPolicy } = useGetCompanyPayrollPolicy();
  const { data: companyWalletData } = useGetCompanyWallet();

  useEffect(() => {
    // Only show the setup modal if policy is incomplete AND user hasn't already completed the setup form
    if (companyPayrollPolicy?.data.status === "incomplete" && !hasCompletedSetupForm) {
      setShowSetupModal(true);
    } else {
      setShowSetupModal(false);
    }
  }, [companyPayrollPolicy, companyWalletData?.data.companyId, setShowSetupModal, hasCompletedSetupForm]);

  const handleRemindLater = () => {
    // TODO: Implement remind later logic
    // eslint-disable-next-line no-console
    console.log("Reminding later...");
    setShowSetupModal(false);
  };

  return (
    <ReusableDialog
      trigger={trigger}
      open={showSetupModal}
      onOpenChange={() => setShowSetupModal(false)}
      title="Let's Get Payroll Set Up"
      description="To begin processing payroll, you'll need to set your company's pay schedule. This includes how often you pay your team and on what date each cycle runs."
      className="!max-w-lg"
    >
      <div className="space-y-6">
        <div className="bg-muted rounded-lg p-5">
          <h6 className="mb-3 font-semibold text-gray-900">What you&apos;ll do:</h6>
          <ul className="ml-4 space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <span className="mr-2 size-1 flex-shrink-0 rounded-full bg-gray-400" />
              Your employees&apos; salary data will appear here automatically
            </li>
            <li className="flex items-center">
              <span className="mr-2 size-1 flex-shrink-0 rounded-full bg-gray-400" />
              You&apos;ll be able to edit bonuses and deductions per employee
            </li>
            <li className="flex items-center">
              <span className="mr-2 size-1 flex-shrink-0 rounded-full bg-gray-400" />
              You can run payroll each cycle and export payslips
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-3">
          <MainButton variant="primary" className="w-full" href="/admin/payroll/setup">
            Set Up Payroll
          </MainButton>

          <button onClick={handleRemindLater} className="text-center text-sm text-gray-600 hover:text-gray-800">
            Remind me later
          </button>
        </div>
      </div>
    </ReusableDialog>
  );
};
