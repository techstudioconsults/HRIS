/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AdvancedDataTable,
  EmptyState,
  ErrorEmptyState,
  FilteredEmptyState,
  TableSkeleton,
} from "@workspace/ui/lib/index";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import empty1 from "~/images/empty-state.svg";
import { useEmployeeService } from "../../../services/use-service";
import { employeeColumn, useEmployeeRowActions } from "../../table-data";

interface EmployeeTableSectionProperties {
  apiFilters: any;
  debouncedSearch: string;
  teamId: string | null;
  roleId: string | null;
  status: string | null;
  sortBy: string | null;
  onPageChange: (newPage: number) => void;
  onResetFilters: () => void;
}

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
    [onPageChange],
  );

  if (isLoadingEmployees) {
    return <TableSkeleton />;
  }

  if (isErrorEmployees) {
    return (
      <ErrorEmptyState
        onRetry={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  }

  const hasActiveFilters =
    (debouncedSearch && debouncedSearch.trim()) || teamId || roleId || (status && status !== "all") || sortBy;

  if (!employeeData?.data?.items.length) {
    if (hasActiveFilters) {
      return <FilteredEmptyState onReset={onResetFilters} />;
    }

    return (
      <EmptyState
        className="bg-background"
        images={[{ src: empty1.src, alt: "No employees", width: 100, height: 100 }]}
        title="No employee yet."
        description="Once you add team members, you'll see their details here, including department, role, work status, and more."
        button={{
          text: "Add New Employee",
          onClick: () => router.push("/admin/employees/add-employee"),
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
      />
      <DeleteConfirmationModal />
    </>
  );
};
