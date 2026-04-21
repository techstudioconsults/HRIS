'use client';

import {
  AdvancedDataTable,
  EmptyState,
  ErrorEmptyState,
  TableSkeleton,
} from '@workspace/ui/lib';

import empty1 from '~/images/empty-state.svg';
import { leaveColumns } from '../_views/table-data';
import { useLeaveService } from '../services/use-service';
import type { LeaveBodyProperties } from '../types';

export const LeaveBody = ({
  searchQuery = '',
  getRowActions,
}: LeaveBodyProperties) => {
  const { useGetLeaveRequests } = useLeaveService();
  const apiFilters = searchQuery?.trim() ? { search: searchQuery.trim() } : {};
  const {
    data: leaveRequests,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetLeaveRequests(apiFilters);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <ErrorEmptyState
        description={(error as Error | undefined)?.message}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!leaveRequests?.data?.items.length) {
    return (
      <EmptyState
        className="bg-background"
        images={[
          {
            src: empty1.src,
            alt: 'No leave requests',
            width: 100,
            height: 100,
          },
        ]}
        title={
          searchQuery?.trim()
            ? 'No matching leave requests'
            : 'No leave requests yet.'
        }
        description={
          searchQuery?.trim()
            ? 'Try adjusting your search.'
            : "When employees request leave, you'll see them listed here."
        }
      />
    );
  }

  const { items, metadata } = leaveRequests.data;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Leave Requests</h1>
      </div>

      <AdvancedDataTable
        columns={leaveColumns}
        data={items}
        currentPage={metadata.page}
        totalPages={metadata.totalPages}
        itemsPerPage={metadata.limit}
        hasPreviousPage={metadata.hasPreviousPage}
        hasNextPage={metadata.hasNextPage}
        onPageChange={() => {}}
        rowActions={getRowActions}
        showPagination={false}
        enableRowSelection={false}
        enableColumnVisibility={true}
        enableSorting={false}
        enableFiltering={false}
        mobileCardView={true}
        showColumnCustomization={false}
        desktopTableClassname={`lg:hidden xl:block`}
        mobileTableClassname={`lg:grid xl:hidden`}
      />
    </section>
  );
};
