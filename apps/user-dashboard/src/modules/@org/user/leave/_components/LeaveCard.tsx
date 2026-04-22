'use client';
import { formatDate } from '@/lib/formatters';
import { Badge } from '@workspace/ui/components/badge';
import { Card, CardContent } from '@workspace/ui/components/card';
import { calculateDaysBetween, cn } from '@workspace/ui/lib/utils';
import { MainButton } from '@workspace/ui/lib/button';
import type { LeaveCardProps, LeaveRequest } from '../types';
const STATUS_STYLES: Record<LeaveRequest['status'], string> = {
  pending: 'bg-warning/10 text-warning',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
};
export const LeaveCard = ({ request, onViewDetails }: LeaveCardProps) => {
  const statusLabel =
    request.status.charAt(0).toUpperCase() + request.status.slice(1);
  return (
    <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="space-y-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold">{request.type}</h3>
            <p className="text-muted-foreground text-sm">
              Requested on {formatDate(request.createdAt)}
            </p>
          </div>
          <Badge
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium capitalize',
              STATUS_STYLES[request.status]
            )}
          >
            {statusLabel}
          </Badge>
        </div>
        {/* Days Display */}
        <div className="flex items-center justify-center rounded-md bg-muted p-3">
          <div className="text-center">
            <p className="text-3xl font-bold">
              {calculateDaysBetween(request.startDate, request.endDate)}
            </p>
            <p className="text-muted-foreground text-xs">Working Days</p>
          </div>
        </div>
        {/* Action Button */}
        <MainButton
          className="w-full hover:bg-muted"
          onClick={() => onViewDetails?.(request)}
        >
          View Details
        </MainButton>
      </CardContent>
    </Card>
  );
};
