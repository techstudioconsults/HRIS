'use client';

import { EmptyState } from '@workspace/ui/lib';
import { useMemo } from 'react';
import empty1 from '~/images/empty-state.svg';
import { useUserLeaveService } from '@/modules/@org/user';
import type { UserLeaveBodyProps } from '../types';
import { LeaveCard } from './LeaveCard';

export const UserLeaveBody = ({
  searchQuery = '',
  onViewDetails,
}: UserLeaveBodyProps) => {
  const { useGetLeaveRequests } = useUserLeaveService();
  const { data, isLoading } = useGetLeaveRequests();

  const requests = data?.items ?? [];

  const query = searchQuery.toLowerCase();

  const filtered = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.leaveTypeName?.toLowerCase().includes(query) ||
          request.reason?.toLowerCase().includes(query)
      ),
    [requests, query]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        image={empty1}
        title="No leave requests yet"
        description="You haven't submitted any leave requests. Click 'Request for Leave' to get started."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {filtered.map((request) => (
        <LeaveCard
          key={request.id}
          request={request}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
