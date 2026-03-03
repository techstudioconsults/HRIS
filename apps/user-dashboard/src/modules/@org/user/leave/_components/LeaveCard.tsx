'use client';

import { formatDate } from '@/lib/formatters';
import { Badge } from '@workspace/ui/components/badge';
import { Card, CardContent } from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';
import type { LeaveRequest } from '../types';
import { MainButton } from '@workspace/ui/lib';

interface LeaveCardProps {
  request: LeaveRequest;
  onViewDetails?: (request: LeaveRequest) => void;
}

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

const formatStatusLabel = (status: LeaveRequest['status']) => {
  if (status === 'declined') return 'Rejected';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const LeaveCard = ({ request, onViewDetails }: LeaveCardProps) => {
  return (
    <Card className="bg-background overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
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
              {formatStatusLabel(request.status)}
            </Badge>
          </div>

          <div className="bg-muted flex items-center justify-center rounded-md p-3">
            <div className="text-center">
              <p className="text-3xl font-bold">{request.days}</p>
              <p className="text-muted-foreground text-xs">Working Days</p>
            </div>
          </div>
          <MainButton variant="outline" className=" hover:bg-muted w-full" onClick={() => onViewDetails?.(request)}>
            View Details
          </MainButton>
        </div>
      </CardContent>
    </Card>
  );
};
