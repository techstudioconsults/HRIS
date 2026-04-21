'use client';

import { useState } from 'react';
import { DashboardHeader } from '@workspace/ui/lib/dashboard/dashboard-header';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { PayslipDetailsModal } from '../_components/payslip-details-modal';
import { PayslipGrid } from '../_components/payslip-grid';
import { PayslipSummaryCard } from '@/modules/@org/user/payslip/_components/payslip-summary-card';
import { useSession } from 'next-auth/react';
import { useUserPayslipService } from '@/modules/@org/user';
import type { Payslip } from '@/modules/@org/admin/payroll/types';
import type { UserPayslip } from '../types';

function mapToUserPayslip(payslip: Payslip): UserPayslip {
  const date = new Date(payslip.paymentDate);
  const monthLabel = date.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return {
    id: payslip.id,
    monthLabel,
    amount: payslip.netPay,
    processedAt: payslip.paymentDate,
    status: payslip.status,
    grossPay: payslip.grossPay,
    netPay: payslip.netPay,
    totalDeductions: payslip.totalDeductions,
    earnings: [
      { id: 'base-salary', label: 'Base Salary', amount: payslip.baseSalary },
      ...payslip.bonuses.map((b) => ({
        id: b.id,
        label: b.name,
        amount: b.amount,
      })),
    ],
    deductions: payslip.deductions.map((d) => ({
      id: d.id,
      label: d.name,
      amount: d.amount,
    })),
  };
}

export const UserPayslipView = () => {
  const [selectedPayslip, setSelectedPayslip] = useState<UserPayslip | null>(
    null
  );
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  const { data: session } = useSession();
  const employeeId = session?.user?.employee?.id;

  const { useGetPayslips } = useUserPayslipService();
  const { data } = useGetPayslips({ employeeId }, { enabled: !!employeeId });

  const payslips = (data?.data?.items ?? []).map(mapToUserPayslip);
  const latestNetPay = payslips[0]?.netPay ?? 0;

  const handleViewPayslip = (payslip: UserPayslip) => {
    setSelectedPayslip(payslip);
    setDetailsModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setDetailsModalOpen(open);
    if (!open) setSelectedPayslip(null);
  };

  return (
    <Wrapper className="my-0! max-w-200 p-0">
      <DashboardHeader title="Payslip" />
      <PayslipSummaryCard netPay={latestNetPay} />
      <PayslipGrid payslips={payslips} onViewPayslip={handleViewPayslip} />
      <PayslipDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={handleModalOpenChange}
        payslip={selectedPayslip}
      />
    </Wrapper>
  );
};
