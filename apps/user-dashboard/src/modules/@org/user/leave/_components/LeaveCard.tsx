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

const formatStatusLabel = (status: LeaveRequest['status']) => {
  if (status === 'declined') return 'Rejected';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const LeaveCard = ({ request, onViewDetails }: LeaveCardProps) => {
  return (
    <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-foreground text-base font-semibold">
                {request.leaveTypeName}
              </h3>
              <p className="text-muted-foreground text-sm">
                Requested on {formatDate(request.createdAt)}
              </p>
            </div>
            <Badge
              className={cn(
                'min-w-22.5 justify-center rounded-full px-3 py-1 text-xs font-medium capitalize',
                request.status === `pending` && `bg-warning/10 text-warning`,
                request.status === `approved` && `bg-success/10 text-success`,
                request.status === `declined` &&
                  `bg-destructive/10 text-destructive`
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
          <MainButton
            className=" hover:bg-muted w-full"
            onClick={() => onViewDetails?.(request)}
          >
            View Details
          </MainButton>
        </div>
      </CardContent>
    </Card>
  );
};
