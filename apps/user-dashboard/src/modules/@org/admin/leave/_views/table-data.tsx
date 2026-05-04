import { formatDate } from '@/lib/formatters';
import { useLeaveAdminModalParams } from '@/lib/nuqs/use-leave-admin-modal-params';
import { Badge } from '@workspace/ui/components/badge';
import { calculateDaysBetween, cn } from '@workspace/ui/lib/utils';
import { Icon } from '@workspace/ui/lib/icons/icon';

import { useLeaveStore } from '../stores/leave-store';
import type { LeaveRequest, LeaveType } from '../types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { NameTooltip } from '@workspace/ui/lib/tooltip';

export const useLeaveRowActions = () => {
  // URL state: modal open + entity ID (survives refresh)
  const { openLeaveDetails } = useLeaveAdminModalParams();
  // Zustand: entity object (non-URL-serializable; warm cache only)
  const { setSelectedLeaveRequest } = useLeaveStore();

  const getRowActions = (request: LeaveRequest) => {
    return [
      {
        label: 'View Details',
        onClick: () => {
          // Cache the entity object for immediate display (avoids list re-fetch)
          setSelectedLeaveRequest(request);
          // Push URL param → drawer survives page refresh
          openLeaveDetails(request.id);
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
    accessorKey: 'employee',
    render: (_value, row) => {
      const request = row as LeaveRequest;
      return (
        <div className="group hover:bg-muted/60 flex w-fit cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 transition-colors">
          <Avatar className={`bg-primary`}>
            <AvatarImage
              src={request.employee.avatar || ''}
              alt={request.employee.name}
            />
            <AvatarFallback className="rounded-lg bg-transparent text-sm text-white">
              {request.employee.name.slice(0, 2).toUpperCase() || 'CN'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <NameTooltip name={request.employee.name}>
              <span className="text-sm font-medium tracking-wide capitalize">
                {request.employee.name}
              </span>
            </NameTooltip>
            <span className="muted-foreground text-[10px] uppercase">
              ID: {request.employee.id.slice(0, 8)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: 'Leave Type',
    accessorKey: 'type',
    render: (_value, row) => (
      <span className="text-sm truncate">{row.type}</span>
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
      <span className="text-sm truncate font-medium">
        {calculateDaysBetween(row.startDate, row.endDate)}
      </span>
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
            'rounded-full px-4 py-1 text-xs',
            status === 'pending' && 'bg-warning-50 text-warning',
            status === 'approved' && 'bg-success-50 text-success',
            status === 'rejected' && 'bg-destructive/10 text-destructive'
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
