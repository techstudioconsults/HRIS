'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useLeaveService } from '../services/use-service';
import type { LeaveType } from '../types';

export const useBulkLeaveTypeActions = () => {
  const queryClient = useQueryClient();
  const { useDeleteLeaveType } = useLeaveService();
  const { mutateAsync: deleteLeaveType } = useDeleteLeaveType();

  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState<LeaveType[]>([]);

  const handleSelectionChange = useCallback((rows: LeaveType[]) => {
    setSelectedLeaveTypes(rows);
  }, []);

  const openBulkDeleteModal = useCallback(() => {
    if (selectedLeaveTypes.length === 0) return;
    setIsBulkDeleteModalOpen(true);
  }, [selectedLeaveTypes.length]);

  const closeBulkDeleteModal = useCallback(() => {
    if (!isBulkDeleting) setIsBulkDeleteModalOpen(false);
  }, [isBulkDeleting]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedLeaveTypes.length === 0 || isBulkDeleting) return;
    setIsBulkDeleting(true);

    let successCount = 0;
    let failCount = 0;

    for (const leaveType of selectedLeaveTypes) {
      try {
        await deleteLeaveType(leaveType.id);
        successCount++;
      } catch (error) {
        failCount++;
        toast.error(
          `Failed to delete "${leaveType.name}": ${
            (error as { message?: string })?.message ?? 'Unknown error'
          }`
        );
      }
    }

    await queryClient.invalidateQueries({ queryKey: ['leave', 'types'] });
    setIsBulkDeleting(false);
    setIsBulkDeleteModalOpen(false);
    setSelectedLeaveTypes([]);

    if (successCount > 0) {
      toast.success(
        `${successCount} leave type${successCount > 1 ? 's' : ''} deleted successfully.`
      );
    }
    if (failCount > 0) {
      toast.error(
        `${failCount} deletion${failCount > 1 ? 's' : ''} failed. See errors above.`
      );
    }
  }, [deleteLeaveType, isBulkDeleting, queryClient, selectedLeaveTypes]);

  const handleBulkExport = useCallback(() => {
    if (selectedLeaveTypes.length === 0) return;

    const headers = [
      'Name',
      'Days',
      'Cycle',
      'Max Days Per Request',
      'Carry Over',
    ];
    const rows = selectedLeaveTypes.map((leaveType) => [
      leaveType.name,
      String(leaveType.days),
      leaveType.cycle,
      String(leaveType.maxLeaveDaysPerRequest),
      leaveType.carryOver ? 'Yes' : 'No',
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
    link.download = `leave-types-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success(
      `Exported ${selectedLeaveTypes.length} leave type${selectedLeaveTypes.length > 1 ? 's' : ''} to CSV.`
    );
  }, [selectedLeaveTypes]);

  return {
    selectedLeaveTypes,
    selectedCount: selectedLeaveTypes.length,
    handleSelectionChange,
    isBulkDeleteModalOpen,
    isBulkDeleting,
    openBulkDeleteModal,
    closeBulkDeleteModal,
    handleBulkDelete,
    handleBulkExport,
  };
};
