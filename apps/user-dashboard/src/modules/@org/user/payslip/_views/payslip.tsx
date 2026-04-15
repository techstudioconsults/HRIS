'use client';

import { useState } from 'react';
import { DashboardHeader } from '@workspace/ui/lib/dashboard/dashboard-header';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { MOCK_PAYSLIPS } from '../constants/mock-payslips';
import { PayslipDetailsModal } from '../_components/payslip-details-modal';
import { PayslipGrid } from '../_components/payslip-grid';
import { PayslipSummaryCard } from '@/modules/@org/user/payslip/_components/payslip-summary-card';
import type { UserPayslip } from '../types';

export const UserPayslipView = () => {
  const [selectedPayslip, setSelectedPayslip] = useState<UserPayslip | null>(
    null
  );
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleViewPayslip = (payslip: UserPayslip) => {
    setSelectedPayslip(payslip);
    setDetailsModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setDetailsModalOpen(open);

    if (!open) {
      setSelectedPayslip(null);
    }
  };

  return (
    <Wrapper className="my-0! max-w-200 p-0">
      <DashboardHeader title="Payslip" />
      <PayslipSummaryCard netPay={520000} />
      <PayslipGrid payslips={MOCK_PAYSLIPS} onViewPayslip={handleViewPayslip} />
      <PayslipDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={handleModalOpenChange}
        payslip={selectedPayslip}
      />
    </Wrapper>
  );
};
