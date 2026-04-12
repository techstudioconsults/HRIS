import { formatDate } from '@/lib/formatters';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';
import { Icon } from '@workspace/ui/lib/icons/icon';
import Image from 'next/image';

import { useLeaveStore } from '../stores/leave-store';
import type { LeaveRequest, LeaveType } from '../types';

export const useLeaveRowActions = () => {
  const {
    setShowLeaveDetailsDrawer,
    setSelectedLeaveRequestId,
    setSelectedLeaveRequest,
  } = useLeaveStore();

  const getRowActions = (request: LeaveRequest) => {
    return [
      {
        label: 'View Details',
        onClick: () => {
          setSelectedLeaveRequestId(request.id);
          setSelectedLeaveRequest(request);
          setShowLeaveDetailsDrawer(true);
        },
        icon: <Icon name="Eye" size={16} variant={`Outline`} />,
      },
    ];
  };

  return { getRowActions };
};
export const leaveColumns: IColumnDefinition<LeaveRequest>[] = [
  {
    header: 'Employee',
    accessorKey: 'employeeName',
    render: (_value, row) => {
      const request = row as LeaveRequest;
      return (
        <div className="flex items-center gap-3">
          {request.employeeAvatar && (
            <div className={`size-10 relative`}>
              <Image
                src={request.employeeAvatar}
                alt={request.employeeName}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <span className="font-medium">{request.employeeName}</span>
        </div>
      );
    },
  },
  {
    header: 'Leave Type',
    accessorKey: 'leaveTypeName',
    render: (_value, row) => (
      <span className="text-sm truncate">{row.leaveTypeName}</span>
    ),
  },
  {
    header: 'Start Date',
    accessorKey: 'startDate',
    render: (_value, row) => (
      <span className="text-sm truncate">{formatDate(row.startDate)}</span>
    ),
  },
  {
    header: 'End Date',
    accessorKey: 'endDate',
    render: (_value, row) => (
      <span className="text-sm truncate">{formatDate(row.endDate)}</span>
    ),
  },
  {
    header: 'Days',
    accessorKey: 'days',
    render: (_value, row) => (
      <span className="text-sm truncate font-medium">{row.days}</span>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    render: (_value, row) => {
      const status = row.status;
      return (
        <Badge
          className={cn(
            'rounded-full py-1 text-xs',
            status === 'pending' && 'bg-warning-50 text-warning',
            status === 'approved' && 'bg-success-50 text-success',
            status === 'declined' && 'bg-destructive/10 text-destructive'
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    header: 'Requested On',
    accessorKey: 'createdAt',
    render: (_value, row) => (
      <span className="text-sm truncate text-gray-500">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
];

export const leaveTypeColumns: IColumnDefinition<LeaveType>[] = [
  {
    accessorKey: 'name',
    header: 'Leave Type',
    render: (_value: unknown, row: LeaveType) => (
      <span className="text-sm font-medium">{row.name}</span>
    ),
  },
  {
    accessorKey: 'days',
    header: 'Days',
    render: (_value: unknown, row: LeaveType) => (
      <span className="text-sm font-medium">{row.days}</span>
    ),
  },
  {
    accessorKey: 'cycle',
    header: 'Cycle',
    render: (_value: unknown, row: LeaveType) => (
      <span className="text-sm font-medium">{row.cycle}</span>
    ),
  },
  {
    accessorKey: 'carryOver',
    header: 'Eligibility',
    render: (_value: unknown, row: LeaveType) => (
      <Badge
        className={cn(
          'text-sm font-medium',
          row.carryOver
            ? 'bg-success/10 text-success'
            : 'bg-warning/10 text-warning'
        )}
      >
        {row.carryOver ? 'Yes' : 'No'}
      </Badge>
    ),
  },
];
