/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import empty1 from '~/images/empty-state.svg';
import { useTeamService } from '../../../services/use-service';
import { teamColumn } from '../../table-data';
import {
  EmptyState,
  ErrorEmptyState,
  FilteredEmptyState,
} from '@workspace/ui/lib/empty-state';
import { AdvancedDataTable, TableSkeleton } from '@workspace/ui/lib/table';
import { AlertModal } from '@workspace/ui/lib/dialog';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useBulkTeamActions } from '../../../hooks/use-bulk-team-actions';
import type { TeamTableSectionProperties } from '../../../types';
import { routes } from '@/lib/routes/routes';

export const TeamTableSection = ({
  apiFilters,
  debouncedSearch,
  status,
  sortBy,
  onPageChange,
  onResetFilters,
  rowActions,
  onAddTeamClick,
}: TeamTableSectionProperties) => {
  const router = useRouter();
  const {
    selectedCount,
    handleSelectionChange,
    isBulkDeleteModalOpen,
    isBulkDeleting,
    openBulkDeleteModal,
    closeBulkDeleteModal,
    handleBulkDelete,
    handleBulkExport,
  } = useBulkTeamActions();
  const { useGetAllTeams } = useTeamService();

  const {
    data: teamData,
    isLoading: isLoadingTeams,
    isError: isErrorTeams,
    refetch,
  } = useGetAllTeams(apiFilters);

  const handlePageChange = useCallback(
    (newPage: number) => {
      onPageChange(newPage);
    },
    [onPageChange]
  );

  const visibleTeams = useMemo(
    () =>
      ((teamData?.data?.items ?? []) as Team[]).filter(
        (team) => team.name?.toLowerCase().trim() !== 'default'
      ),

    [teamData?.data?.items]
  );

  if (isLoadingTeams) {
    return <TableSkeleton />;
  }

  if (isErrorTeams) {
    return <ErrorEmptyState onRetry={refetch} />;
  }

  const hasFilters =
    (debouncedSearch && debouncedSearch.trim()) ||
    (status && status !== 'all') ||
    sortBy;

  const hasTeams = visibleTeams.length > 0;

  if (!hasTeams && !hasFilters) {
    return (
      <EmptyState
        className="bg-background"
        images={[{ src: empty1.src, alt: 'No teams', width: 100, height: 100 }]}
        title="No team added yet."
        description="Add teams to better organize your workforce, assign leads, and manage roles across your organization."
        button={{
          text: 'Add New Team',
          onClick: onAddTeamClick,
        }}
      />
    );
  }

  if (!hasTeams && hasFilters) {
    return <FilteredEmptyState onReset={onResetFilters} />;
  }

  return (
    <>
      <AdvancedDataTable
        data={visibleTeams as Team[]}
        columns={teamColumn}
        currentPage={(teamData!.data as any).metadata.page}
        totalPages={(teamData!.data as any).metadata.totalPages}
        itemsPerPage={(teamData!.data as any).metadata.limit}
        hasPreviousPage={(teamData!.data as any).metadata.hasPreviousPage}
        hasNextPage={(teamData!.data as any).metadata.hasNextPage}
        onPageChange={handlePageChange}
        onRowClick={(team: any) => {
          if (team?.id) {
            router.push(routes.admin.teams.detail(team.id));
          }
        }}
        rowActions={rowActions}
        showPagination={true}
        enableRowSelection={true}
        enableColumnVisibility={true}
        enableSorting={true}
        enableFiltering={true}
        mobileCardView={true}
        showColumnCustomization={false}
        onSelectionChange={handleSelectionChange}
        customFooterRenderer={() =>
          selectedCount > 0 ? (
            <div className="flex flex-col gap-3 rounded-b-lg border-t bg-primary/5 px-4 py-3 sm:flex-row sm:items-center">
              <span className="text-sm font-medium text-primary">
                {selectedCount} row{selectedCount > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2 sm:ml-auto">
                <MainButton
                  variant="primaryOutline"
                  onClick={handleBulkExport}
                  isLeftIconVisible
                  icon={<Icon name="DocumentDownload" variant="Outline" />}
                >
                  Export CSV
                </MainButton>
                <MainButton
                  variant="destructive"
                  onClick={openBulkDeleteModal}
                  isLeftIconVisible
                  icon={<Icon name="Trash" variant="Outline" />}
                >
                  Delete Selected
                </MainButton>
              </div>
            </div>
          ) : null
        }
      />
      <AlertModal
        isOpen={isBulkDeleteModalOpen}
        onClose={closeBulkDeleteModal}
        onConfirm={() => {
          void handleBulkDelete();
        }}
        loading={isBulkDeleting}
        type="warning"
        title="Delete selected teams"
        description={`Are you sure you want to delete ${selectedCount} team${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText={
          isBulkDeleting
            ? 'Deleting...'
            : `Delete ${selectedCount} team${selectedCount > 1 ? 's' : ''}`
        }
        cancelText="Cancel"
      />
    </>
  );
};
