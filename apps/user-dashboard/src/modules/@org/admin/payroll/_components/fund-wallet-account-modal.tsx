"use client";

import { useTour } from "@/modules/@org/onboarding";
import { ReusableDialog } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { AlertTriangle, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { generatePayrollTourStep } from "../config/tour-steps";
import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";

// interface FundWalletAccountModalProperties {
//   open?: boolean;
//   onOpenChange?: (open: boolean) => void;
//   onConfirm?: () => void;
//   onCheckPayrollAvailability?: () => void;
// }

export function FundWalletAccountModal({
  isGeneratePayrollBannerShowing,
}: {
  isGeneratePayrollBannerShowing: boolean;
}) {
  const { startTour } = useTour();
  const [copied, setCopied] = useState(false);
  const { showFundWalletAccountModal, setShowFundWalletAccountModal, walletSetupCompleted } = usePayrollStore();
  const { useGetCompanyWallet } = usePayrollService();
  const { data: companyWalletData, refetch: refetchCompanyWallet } = useGetCompanyWallet();

  const handleCopyAccountNumber = async () => {
    try {
      const accountNumberToCopy = companyWalletData?.data?.accountNumber || "";
      await navigator.clipboard.writeText(accountNumberToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Handle copy error silently
    }
  };

  // Poll every 5s while modal is open and until accountNumber exists
  useEffect(() => {
    if (!showFundWalletAccountModal) return;
    if (companyWalletData?.data?.accountNumber) return;

    const id = setInterval(() => {
      refetchCompanyWallet?.();
    }, 5000);

    return () => clearInterval(id);
  }, [showFundWalletAccountModal, companyWalletData?.data?.accountNumber, refetchCompanyWallet]);

  const handleConfirm = async () => {
    setShowFundWalletAccountModal(false);
    if (walletSetupCompleted && isGeneratePayrollBannerShowing) {
      startTour(generatePayrollTourStep);
    }
  };

  return (
    <ReusableDialog
      trigger={""}
      open={showFundWalletAccountModal}
      onOpenChange={setShowFundWalletAccountModal}
      title="Fund Wallet"
      className="min-w-md"
    >
      <div className="space-y-6">
        {/* Instructional text */}
        <p className="text-sm text-gray-600">
          To fund your payroll wallet, please make a transfer to the account below. Your wallet will be credited
          automatically once payment is confirmed.
        </p>

        {/* Bank Account Details */}
        {companyWalletData?.data?.accountName && companyWalletData?.data?.accountNumber ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs text-gray-500">Bank Name</p>
                <p className="font-semibold text-gray-900">{companyWalletData?.data?.bankName || "Paystack-Titan"}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div>
                  <p className="mb-1 text-xs text-gray-500">Account Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{companyWalletData?.data?.accountNumber}</p>
                    <button
                      onClick={handleCopyAccountNumber}
                      className="text-blue-600 transition-colors hover:text-blue-700"
                      title="Copy account number"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  {copied && <p className="mt-1 text-xs text-green-600">Copied!</p>}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">Setting up your wallet account</p>
                <p className="text-sm text-gray-600">This will only take a moment...</p>
              </div>
            </div>
          </div>
        )}

        {/* Warning Message */}
        <div className="border-accent bg-accent/10 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 flex-shrink-0 text-yellow-600" size={16} />
            <p className="text-sm text-yellow-800">
              This account is unique to your organization. Only verified transfers will reflect in your wallet balance.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <MainButton className="w-full" type="button" variant="primary" onClick={handleConfirm}>
            Okay, Got it
          </MainButton>
        </div>
      </div>
    </ReusableDialog>
  );
}
