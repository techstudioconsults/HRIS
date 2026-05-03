'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { usePayrollService } from '../services/use-service';
import type { Payslip } from '../types';

interface UseBulkPayrollActionsOptions {
  payrollId: string;
}

export const useBulkPayrollActions = ({
  payrollId,
}: UseBulkPayrollActionsOptions) => {
  const { useDeletePayslip } = usePayrollService();
  const { mutateAsync: deletePayslip } = useDeletePayslip();

  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [selectedPayslips, setSelectedPayslips] = useState<Payslip[]>([]);

  const handleSelectionChange = useCallback((rows: Payslip[]) => {
    setSelectedPayslips(rows);
  }, []);

  const openBulkDeleteModal = useCallback(() => {
    if (selectedPayslips.length === 0) return;
    setIsBulkDeleteModalOpen(true);
  }, [selectedPayslips.length]);

  const closeBulkDeleteModal = useCallback(() => {
    if (!isBulkDeleting) setIsBulkDeleteModalOpen(false);
  }, [isBulkDeleting]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedPayslips.length === 0 || isBulkDeleting) return;
    setIsBulkDeleting(true);

    let successCount = 0;
    let failCount = 0;

    for (const payslip of selectedPayslips) {
      try {
        await deletePayslip({ payrollId, payslipId: payslip.id });
        successCount++;
      } catch (error) {
        failCount++;
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message
            : 'Unknown error';
        toast.error(
          `Failed to remove ${payslip.employee?.name ?? 'employee'}: ${message}`
        );
      }
    }

    setIsBulkDeleting(false);
    setIsBulkDeleteModalOpen(false);
    setSelectedPayslips([]);

    if (successCount > 0) {
      toast.success(
        `${successCount} employee${successCount > 1 ? 's' : ''} removed from payroll.`
      );
    }
    if (failCount > 0) {
      toast.error(
        `${failCount} removal${failCount > 1 ? 's' : ''} failed. See errors above.`
      );
    }
  }, [deletePayslip, isBulkDeleting, payrollId, selectedPayslips]);

  const handleBulkExport = useCallback(() => {
    if (selectedPayslips.length === 0) return;

    const headers = [
      'Name',
      'Role',
      'Gross Pay',
      'Deduction',
      'Bonus',
      'Net Pay',
      'Status',
    ];
    const rows = selectedPayslips.map((payslip) => [
      payslip.employee?.name ?? '',
      payslip.employee?.role?.name ?? '',
      String(payslip.grossPay),
      String(payslip.totalDeductions),
      String(payslip.totalBonuses),
      String(payslip.netPay),
      payslip.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payroll-summary-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success(
      `Exported ${selectedPayslips.length} payslip${selectedPayslips.length > 1 ? 's' : ''} to CSV.`
    );
  }, [selectedPayslips]);

  return {
    selectedPayslips,
    selectedCount: selectedPayslips.length,
    handleSelectionChange,
    isBulkDeleteModalOpen,
    isBulkDeleting,
    openBulkDeleteModal,
    closeBulkDeleteModal,
    handleBulkDelete,
    handleBulkExport,
  };
};
