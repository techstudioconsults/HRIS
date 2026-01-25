"use client";

import { AdvancedDataTable, EmptyState } from "@workspace/ui/lib";
import { useMemo } from "react";

import empty1 from "~/images/empty-state.svg";
import { leaveColumns } from "../_views/table-data";
import type { LeaveRequest } from "../types";

interface LeaveBodyProperties {
  searchQuery?: string;
  // IRowAction is declared globally in `apps/user-dashboard/src/modules/@org/admin/types/index.d.ts`
  getRowActions: (row: LeaveRequest) => IRowAction<LeaveRequest>[];
}

export const LeaveBody = ({ searchQuery = "", getRowActions }: LeaveBodyProperties) => {
  // NOTE: This view intentionally uses dummy data for now.
  // It must not call any endpoint.
  const leaveRequests: LeaveRequest[] = useMemo(
    () => [
      {
        id: "lr_001",
        employeeId: "emp_001",
        employeeName: "Jane Doe",
        employeeAvatar: "/images/auth/login-img.svg",
        leaveTypeId: "lt_annual",
        leaveTypeName: "Annual Leave",
        startDate: "2026-01-10",
        endDate: "2026-01-12",
        days: 3,
        reason: "Family event",
        status: "pending",
        createdAt: "2026-01-05",
        updatedAt: "2026-01-05",
      },
      {
        id: "lr_002",
        employeeId: "emp_002",
        employeeName: "John Smith",
        employeeAvatar: "/images/auth/register-img.svg",
        leaveTypeId: "lt_sick",
        leaveTypeName: "Sick Leave",
        startDate: "2026-01-02",
        endDate: "2026-01-03",
        days: 2,
        reason: "Medical appointment",
        status: "approved",
        approvedBy: "HR Admin",
        approvedAt: "2026-01-02",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-02",
      },
      {
        id: "lr_003",
        employeeId: "emp_003",
        employeeName: "Amina Yusuf",
        leaveTypeId: "lt_casual",
        leaveTypeName: "Casual Leave",
        startDate: "2025-12-20",
        endDate: "2025-12-20",
        days: 1,
        reason: "Personal errands",
        status: "declined",
        approvedBy: "Team Lead",
        approvedAt: "2025-12-19",
        createdAt: "2025-12-19",
        updatedAt: "2025-12-19",
      },
    ],
    [],
  );

  const displayRequests: LeaveRequest[] = useMemo(() => {
    if (!searchQuery.trim()) return leaveRequests;
    const lower = searchQuery.toLowerCase();
    return leaveRequests.filter((request) => {
      return (
        request.employeeName.toLowerCase().includes(lower) ||
        request.leaveTypeName.toLowerCase().includes(lower) ||
        request.status.toLowerCase().includes(lower)
      );
    });
  }, [searchQuery, leaveRequests]);

  if (displayRequests.length === 0) {
    return (
      <EmptyState
        className="bg-background"
        images={[{ src: empty1.src, alt: "No leave requests", width: 100, height: 100 }]}
        title={searchQuery?.trim() ? "No matching leave requests" : "No leave requests yet."}
        description={
          searchQuery?.trim()
            ? "Try adjusting your search."
            : "When employees request leave, you'll see them listed here."
        }
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Leave Requests</h1>
      </div>

      <AdvancedDataTable
        columns={leaveColumns}
        data={displayRequests}
        currentPage={1}
        totalPages={1}
        itemsPerPage={displayRequests.length}
        hasPreviousPage={false}
        hasNextPage={false}
        onPageChange={() => {}}
        rowActions={getRowActions}
        showPagination={false}
        enableRowSelection={true}
        enableColumnVisibility={true}
        enableSorting={true}
        enableFiltering={true}
        mobileCardView={true}
        showColumnCustomization={false}
      />
    </section>
  );
};
