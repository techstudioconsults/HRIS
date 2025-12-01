"use client";

import { useTour } from "@/modules/@org/onboarding";
import { ReusableDialog } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { payrollSetupTourSteps } from "../config/tour-steps";
import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";

export const PayrollSetupSettingsModal = () => {
  const router = useRouter();
  const { setShowPayrollSettingsSetupModal, showPayrollSettingsSetupModal, hasCompletedPayrollPolicySetupForm } =
    usePayrollStore();
  const { useGetCompanyPayrollPolicy } = usePayrollService();
  const { data: payrollPolicy } = useGetCompanyPayrollPolicy();
  const { startTour } = useTour();

  useEffect(() => {
    // If payday is set (not 0), mark setup as complete and clear the modal
    if (payrollPolicy?.data.payday !== 0 && payrollPolicy?.data.payday !== undefined) {
      localStorage.setItem("tsahr-payroll-setup-modal-seen", "true");
      setShowPayrollSettingsSetupModal(false);
    }
    // If payday is 0 (setup not done), show modal regardless of local storage
    else if (payrollPolicy?.data.payday === 0) {
      const hasSeenModal = localStorage.getItem("tsahr-payroll-setup-modal-seen");
      if (!hasSeenModal && !hasCompletedPayrollPolicySetupForm) {
        setShowPayrollSettingsSetupModal(true);
      }
    } else {
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
      className="min-w-md"
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
          <MainButton
            variant="primary"
            className="w-full"
            onClick={() => {
              localStorage.setItem("payroll-setup-modal-seen", "true");
              startTour(payrollSetupTourSteps);
              router.push("/admin/payroll/setup");
            }}
          >
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
