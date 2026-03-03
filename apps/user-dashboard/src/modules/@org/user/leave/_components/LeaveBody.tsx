'use client';
import { Button } from '@workspace/ui/components/button';
import { EmptyState } from '@workspace/ui/lib';
import { useMemo } from 'react';
import empty1 from '~/images/empty-state.svg';
import { LeaveCard } from './LeaveCard';
import type { LeaveRequest } from '../types';

interface UserLeaveBodyProps {
  searchQuery?: string;
  onViewDetails?: (request: LeaveRequest) => void;
}

export const UserLeaveBody = ({ searchQuery = '', onViewDetails }: UserLeaveBodyProps) => {
  // NOTE: This view intentionally uses placeholder data.
  // It will be replaced with actual user data from the service.
  const leaveRequests: LeaveRequest[] = useMemo(
    () => [
      {
        id: 'lr_001',
        employeeId: 'emp_001',
        employeeName: 'You',
        leaveTypeId: 'lt_annual',
        leaveTypeName: 'Annual Leave',
        startDate: '2026-02-10',
        endDate: '2026-02-13',
        days: 4,
        reason: 'Travelling for an event',
        status: 'approved',
        approvedBy: 'Abdulhafeez Kekerekun',
        supportingDocumentName: 'travel-docs.pdf',
        createdAt: '2026-02-01',
        updatedAt: '2026-02-01',
      },
      {
        id: 'lr_002',
        employeeId: 'emp_001',
        employeeName: 'You',
        leaveTypeId: 'lt_sick',
        leaveTypeName: 'Sick Leave',
        startDate: '2026-01-15',
        endDate: '2026-01-22',
        days: 8,
        reason: 'Medical appointment',
        status: 'declined',
        approvedBy: 'Adaeze Okafor',
        createdAt: '2026-01-10',
        updatedAt: '2026-01-10',
      },
      {
        id: 'lr_003',
        employeeId: 'emp_001',
        employeeName: 'You',
        leaveTypeId: 'lt_annual',
        leaveTypeName: 'Annual Leave',
        startDate: '2026-03-10',
        endDate: '2026-03-17',
        days: 8,
        reason: 'Family trip',
        status: 'pending',
        createdAt: '2026-02-25',
        updatedAt: '2026-02-25',
      },
      {
        id: 'lr_004',
        employeeId: 'emp_001',
        employeeName: 'You',
        leaveTypeId: 'lt_sick',
        leaveTypeName: 'Sick Leave',
        startDate: '2025-12-20',
        endDate: '2025-12-23',
        days: 4,
        reason: 'Illness',
        status: 'approved',
        approvedBy: 'Abdulhafeez Kekerekun',
        createdAt: '2025-12-15',
        updatedAt: '2025-12-15',
      },
    ],
    []
  );

  const filteredData = useMemo(
    () =>
      leaveRequests.filter(
        (request) =>
          request.leaveTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.reason.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [leaveRequests, searchQuery]
  );

  return (
    <div className="space-y-6">
      {filteredData.length === 0 ? (
        <EmptyState
          image={empty1}
          title="No leave requests yet"
          description="You haven't submitted any leave requests. Click 'Request for Leave' to get started."
        />
      ) : (
        <>
          {/* Leave Request Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredData.map((request) => (
              <LeaveCard key={request.id} request={request} onViewDetails={onViewDetails} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Entries per page:</span>
              <select className="border-border bg-background h-9 rounded-md border px-3 text-sm">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Page 1 of 1</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="border-border">
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled className="border-border">
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
