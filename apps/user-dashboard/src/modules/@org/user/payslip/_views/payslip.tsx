'use client';

import { useMemo, useState } from 'react';
import { DashboardHeader } from '@workspace/ui/lib/dashboard/dashboard-header';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { PayslipDetailsModal } from '../_components/payslip-details-modal';
import { PayslipGrid } from '../_components/payslip-grid';
import { PayslipSummaryCard } from '@/modules/@org/user/payslip/_components/payslip-summary-card';
import { useSession } from '@/lib/session';
import { useUserPayslipService } from '@/modules/@org/user';
import { useUserPayslipModalParams } from '@/lib/nuqs/use-user-payslip-modal-params';
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
  // Modal URL state (nuqs) — payslip-details survives refresh
  const { isPayslipDetailsOpen, modalId, openPayslipDetails, closeModal } =
    useUserPayslipModalParams();

  // Local entity state — non-URL-serializable; derived from fetched list on cold-refresh
  const [selectedPayslip, setSelectedPayslip] = useState<UserPayslip | null>(
    null
  );

  const { data: session } = useSession();
  const employeeId = session?.user?.employee?.id;

  const { useGetPayslips } = useUserPayslipService();
  const { data } = useGetPayslips({ employeeId }, { enabled: !!employeeId });

  const payslips = useMemo(
    () => (data?.data?.items ?? []).map(mapToUserPayslip),
    [data]
  );
  const latestNetPay = payslips[0]?.netPay ?? 0;

  // On cold-refresh: recover selectedPayslip from fetched list via modalId
  const resolvedPayslip: UserPayslip | null = useMemo(() => {
    if (!isPayslipDetailsOpen || !modalId) return null;
    return payslips.find((p) => p.id === modalId) ?? selectedPayslip;
  }, [isPayslipDetailsOpen, modalId, payslips, selectedPayslip]);

  const handleViewPayslip = (payslip: UserPayslip) => {
    setSelectedPayslip(payslip);
    openPayslipDetails(payslip.id);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
      setSelectedPayslip(null);
    }
  };

  return (
    <Wrapper className="my-0! max-w-200 p-0">
      <DashboardHeader title="Payslip" />
      <PayslipSummaryCard netPay={latestNetPay} />
      <PayslipGrid payslips={payslips} onViewPayslip={handleViewPayslip} />
      <PayslipDetailsModal
        open={isPayslipDetailsOpen}
        onOpenChange={handleModalOpenChange}
        payslip={resolvedPayslip}
      />
    </Wrapper>
  );
};
