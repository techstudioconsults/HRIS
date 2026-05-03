'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useEmployeeService } from '../services/use-service';

export const useBulkEmployeeActions = () => {
  const queryClient = useQueryClient();
  const { useDeleteEmployee } = useEmployeeService();
  const { mutateAsync: deleteEmployee } = useDeleteEmployee();

  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  const handleSelectionChange = useCallback((rows: Employee[]) => {
    setSelectedEmployees(rows);
  }, []);

  const openBulkDeleteModal = useCallback(() => {
    if (selectedEmployees.length === 0) return;
    setIsBulkDeleteModalOpen(true);
  }, [selectedEmployees.length]);

  const closeBulkDeleteModal = useCallback(() => {
    if (!isBulkDeleting) setIsBulkDeleteModalOpen(false);
  }, [isBulkDeleting]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedEmployees.length === 0 || isBulkDeleting) return;
    setIsBulkDeleting(true);

    let successCount = 0;
    let failCount = 0;

    for (const employee of selectedEmployees) {
      try {
        await deleteEmployee(employee.id);
        successCount++;
      } catch (error) {
        failCount++;
        toast.error(
          `Failed to delete ${employee.firstName} ${employee.lastName}: ${
            (error as { message?: string })?.message ?? 'Unknown error'
          }`
        );
      }
    }

    await queryClient.invalidateQueries({ queryKey: ['employee', 'list'] });
    setIsBulkDeleting(false);
    setIsBulkDeleteModalOpen(false);
    setSelectedEmployees([]);

    if (successCount > 0) {
      toast.success(
        `${successCount} employee${successCount > 1 ? 's' : ''} deleted successfully.`
      );
    }
    if (failCount > 0) {
      toast.error(
        `${failCount} deletion${failCount > 1 ? 's' : ''} failed. See errors above.`
      );
    }
  }, [deleteEmployee, isBulkDeleting, queryClient, selectedEmployees]);

  const handleBulkExport = useCallback(() => {
    if (selectedEmployees.length === 0) return;

    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Role',
      'Department',
      'Employment Type',
      'Status',
    ];
    const rows = selectedEmployees.map((employee) => [
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.employmentDetails?.role?.name ?? '',
      employee.employmentDetails?.team?.name ?? '',
      employee.employmentDetails?.employmentType ?? '',
      employee.status,
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
    link.download = `employees-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success(
      `Exported ${selectedEmployees.length} employee${selectedEmployees.length > 1 ? 's' : ''} to CSV.`
    );
  }, [selectedEmployees]);

  return {
    selectedEmployees,
    selectedCount: selectedEmployees.length,
    handleSelectionChange,
    isBulkDeleteModalOpen,
    isBulkDeleting,
    openBulkDeleteModal,
    closeBulkDeleteModal,
    handleBulkDelete,
    handleBulkExport,
  };
};
