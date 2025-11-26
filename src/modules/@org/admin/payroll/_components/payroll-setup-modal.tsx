"use client";

import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { useEffect } from "react";

import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";

export const PayrollSetupSettingsModal = () => {
  const { setShowPayrollSettingsSetupModal, showPayrollSettingsSetupModal, hasCompletedPayrollPolicySetupForm } =
    usePayrollStore();
  const { useGetCompanyPayrollPolicy } = usePayrollService();
  const { data: payrollPolicy } = useGetCompanyPayrollPolicy();

  useEffect(() => {
    // Only show modal if payday is 0 AND user hasn't just completed the setup form
    if (payrollPolicy?.data.payday === 0 && !hasCompletedPayrollPolicySetupForm) {
      setShowPayrollSettingsSetupModal(true);
    } else if (payrollPolicy?.data.payday !== 0) {
      setShowPayrollSettingsSetupModal(false);
    }
  }, [payrollPolicy?.data?.payday, hasCompletedPayrollPolicySetupForm, setShowPayrollSettingsSetupModal]);

  const handleRemindMeLater = () => {
    setShowPayrollSettingsSetupModal(false);
  };

  return (
    <ReusableDialog
      open={showPayrollSettingsSetupModal}
      onOpenChange={setShowPayrollSettingsSetupModal}
      trigger={""}
      title="Let's Get Payroll Set Up"
      description="To begin processing payroll, you'll need to set your company's pay schedule. This includes how often you pay your team and on what date each cycle runs."
      className="!max-w-lg"
    >
      <div className="space-y-6">
        <div className="bg-primary/10 border-primary-75 rounded-lg border p-5">
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

          <MainButton
            onClick={handleRemindMeLater}
            className="text-center text-sm text-gray-600 hover:text-gray-800 hover:underline"
          >
            Remind me later
          </MainButton>
        </div>
      </div>
    </ReusableDialog>
  );
};
