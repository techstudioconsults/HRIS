"use client";

import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { AlertTriangle, Copy } from "lucide-react";
import { useState } from "react";

interface FundWalletAccountModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
}

export function FundWalletAccountModal({ open, onOpenChange, onConfirm }: FundWalletAccountModalProperties) {
  const [copied, setCopied] = useState(false);

  // Bank account details - these would typically come from props or API
  const bankAccountDetails: BankAccountDetails = {
    bankName: "Paystack-Titan",
    accountNumber: "3198775460",
  };

  const handleCopyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(bankAccountDetails.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Handle copy error silently
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <ReusableDialog trigger={""} open={open} onOpenChange={onOpenChange} title="Fund Wallet" className="!max-w-lg">
      <div className="space-y-6">
        {/* Instructional text */}
        <p className="text-sm text-gray-600">
          To fund your payroll wallet, please make a transfer to the account below. Your wallet will be credited
          automatically once payment is confirmed.
        </p>

        {/* Bank Account Details */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1 text-xs text-gray-500">Bank Name</p>
              <p className="font-semibold text-gray-900">{bankAccountDetails.bankName}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div>
                <p className="mb-1 text-xs text-gray-500">Account Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{bankAccountDetails.accountNumber}</p>
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
