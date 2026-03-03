'use client';
import { formatDate } from '@/lib/formatters';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { EmptyState } from '@workspace/ui/lib';
import { cn } from '@workspace/ui/lib/utils';
import { useMemo } from 'react';
import empty1 from '~/images/empty-state.svg';
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
        endDate: '2026-02-12',
        days: 4,
        reason: 'Vacation',
        status: 'approved',
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

  const getStatusVariant = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'declined':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusBgColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-[#ECFDF3]';
      case 'declined':
        return 'bg-[#FBE9E9]';
      case 'pending':
        return 'bg-[#FCF5E8]';
      default:
        return 'bg-gray-50';
    }
  };

  const getStatusTextColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved':
        return 'text-[#027A48]';
      case 'declined':
        return 'text-[#DB4B46]';
      case 'pending':
        return 'text-[#E49817]';
      default:
        return 'text-gray-700';
    }
  };

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
              <Card
                key={request.id}
                className="bg-background overflow-hidden shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Leave Type and Status Row */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-foreground text-base font-semibold">{request.leaveTypeName}</h3>
                        <p className="text-muted-foreground text-sm">Requested on {formatDate(request.createdAt)}</p>
                      </div>
                      <Badge
                        variant={getStatusVariant(request.status)}
                        className={cn(
                          'min-w-[90px] justify-center rounded-md px-3 py-1 text-xs font-medium capitalize',
                          getStatusBgColor(request.status),
                          getStatusTextColor(request.status)
                        )}
                      >
                        {request.status}
                      </Badge>
                    </div>

                    {/* Working Days */}
                    <div className="bg-muted flex items-center justify-center rounded-md p-3">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{request.days}</p>
                        <p className="text-muted-foreground text-xs">Working Days</p>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Button
                      variant="outline"
                      className="border-border hover:bg-muted w-full"
                      onClick={() => onViewDetails?.(request)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
