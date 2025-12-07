/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AdvancedDataTable, EmptyState, ErrorEmptyState, FilteredEmptyState, TableSkeleton } from "@workspace/ui/lib";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import empty1 from "~/images/empty-state.svg";
import { useTeamService } from "../../../services/use-service";
import { teamColumn } from "../../table-data";

interface TeamTableSectionProperties {
  apiFilters: any;
  debouncedSearch: string;
  status: string | null;
  sortBy: string | null;
  onPageChange: (newPage: number) => void;
  onResetFilters: () => void;
  rowActions: (team: any) => any[];
  onAddTeamClick: () => void;
}

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
  const { useGetAllTeams } = useTeamService();

  const { data: teamData, isLoading: isLoadingTeams, isError: isErrorTeams, refetch } = useGetAllTeams(apiFilters);

  const handlePageChange = useCallback(
    (newPage: number) => {
      onPageChange(newPage);
    },
    [onPageChange],
  );

  if (isLoadingTeams) {
    return <TableSkeleton />;
  }

  if (isErrorTeams) {
    return <ErrorEmptyState onRetry={refetch} />;
  }

  const hasFilters = (debouncedSearch && debouncedSearch.trim()) || (status && status !== "all") || sortBy;
  const hasTeams = Array.isArray(teamData?.data?.items) && teamData?.data?.items.length > 0;

  if (!hasTeams && !hasFilters) {
    return (
      <EmptyState
        className="bg-background"
        images={[{ src: empty1.src, alt: "No teams", width: 100, height: 100 }]}
        title="No team added yet."
        description="Add teams to better organize your workforce, assign leads, and manage roles across your organization."
        button={{
          text: "Add New Team",
          onClick: onAddTeamClick,
        }}
      />
    );
  }

  if (!hasTeams && hasFilters) {
    return <FilteredEmptyState onReset={onResetFilters} />;
  }

  return (
    <AdvancedDataTable
      data={teamData!.data!.items as Team[]}
      columns={teamColumn}
      currentPage={(teamData!.data as any).metadata.page}
      totalPages={(teamData!.data as any).metadata.totalPages}
      itemsPerPage={(teamData!.data as any).metadata.limit}
      hasPreviousPage={(teamData!.data as any).metadata.hasPreviousPage}
      hasNextPage={(teamData!.data as any).metadata.hasNextPage}
      onPageChange={handlePageChange}
      onRowClick={(team: any) => {
        if (team?.id) {
          router.push(`/admin/teams/${team.id}`);
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
    />
  );
};
