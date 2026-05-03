/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { AdvancedDataTable, TableSkeleton } from '@workspace/ui/lib/table';
import {
  EmptyState,
  ErrorEmptyState,
  FilteredEmptyState,
} from '@workspace/ui/lib/empty-state';
import { AlertModal } from '@workspace/ui/lib/dialog';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import empty1 from '~/images/empty-state.svg';
import { useEmployeeService } from '../../../services/use-service';
import { employeeColumn, useEmployeeRowActions } from '../../table-data';
import { useBulkEmployeeActions } from '../../../hooks/use-bulk-employee-actions';
import type { EmployeeTableSectionProperties } from '../../../types';

export const EmployeeTableSection = ({
  apiFilters,
  debouncedSearch,
  teamId,
  roleId,
  status,
  sortBy,
  onPageChange,
  onResetFilters,
}: EmployeeTableSectionProperties) => {
  const router = useRouter();
  const { getRowActions, DeleteConfirmationModal } = useEmployeeRowActions();
  const {
    selectedCount,
    handleSelectionChange,
    isBulkDeleteModalOpen,
    isBulkDeleting,
    openBulkDeleteModal,
    closeBulkDeleteModal,
    handleBulkDelete,
    handleBulkExport,
  } = useBulkEmployeeActions();
  const { useGetAllEmployees } = useEmployeeService();

  const {
    data: employeeData,
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
  } = useGetAllEmployees(apiFilters);

  const handlePageChange = useCallback(
    (newPage: number) => {
      onPageChange(newPage);
    },
    [onPageChange]
  );

  if (isLoadingEmployees) {
    return <TableSkeleton />;
  }

  if (isErrorEmployees) {
    return (
      <ErrorEmptyState
        onRetry={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
  }

  const hasActiveFilters =
    (debouncedSearch && debouncedSearch.trim()) ||
    teamId ||
    roleId ||
    (status && status !== 'all') ||
    sortBy;

  if (!employeeData?.data?.items.length) {
    if (hasActiveFilters) {
      return <FilteredEmptyState onReset={onResetFilters} />;
    }

    return (
      <EmptyState
        className="bg-background"
        images={[
          { src: empty1.src, alt: 'No employees', width: 100, height: 100 },
        ]}
        title="No employee yet."
        description="Once you add team members, you'll see their details here, including department, role, work status, and more."
        button={{
          text: 'Add New Employee',
          onClick: () => router.push('/admin/employees/add-employee'),
        }}
      />
    );
  }

  return (
    <>
      <AdvancedDataTable
        data={employeeData.data.items}
        columns={employeeColumn}
        currentPage={employeeData.data.metadata.page}
        totalPages={employeeData.data.metadata.totalPages}
        itemsPerPage={employeeData.data.metadata.limit}
        hasPreviousPage={employeeData.data.metadata.hasPreviousPage}
        hasNextPage={employeeData.data.metadata.hasNextPage}
        onPageChange={handlePageChange}
        rowActions={getRowActions}
        onRowClick={(employee: any) => {
          if (employee?.id) {
            router.push(`/admin/employees/${employee.id}`);
          }
        }}
        showPagination={true}
        enableRowSelection={true}
        enableColumnVisibility={true}
        enableSorting={true}
        enableFiltering={true}
        mobileCardView={true}
        showColumnCustomization={false}
        onSelectionChange={handleSelectionChange}
        customFooterRenderer={() =>
          selectedCount > 0 ? (
            <div className="flex flex-col gap-3 rounded-b-lg border-t py-3 sm:flex-row sm:items-center">
              <span className="text-sm font-medium text-primary">
                {selectedCount} row{selectedCount > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2 sm:ml-auto">
                <MainButton
                  variant="primaryOutline"
                  onClick={handleBulkExport}
                  isLeftIconVisible
                  icon={<Icon name="DocumentDownload" variant="Outline" />}
                >
                  Export CSV
                </MainButton>
                <MainButton
                  variant="destructive"
                  onClick={openBulkDeleteModal}
                  isLeftIconVisible
                  icon={<Icon name="Trash" variant="Outline" />}
                >
                  Delete Selected
                </MainButton>
              </div>
            </div>
          ) : null
        }
      />
      <DeleteConfirmationModal />
      <AlertModal
        isOpen={isBulkDeleteModalOpen}
        onClose={closeBulkDeleteModal}
        onConfirm={() => {
          void handleBulkDelete();
        }}
        loading={isBulkDeleting}
        type="warning"
        title="Delete selected employees"
        description={`Are you sure you want to delete ${selectedCount} employee${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText={
          isBulkDeleting
            ? 'Deleting...'
            : `Delete ${selectedCount} employee${selectedCount > 1 ? 's' : ''}`
        }
        cancelText="Cancel"
      />
    </>
  );
};
