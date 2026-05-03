'use client';

import { EmptyState } from '@workspace/ui/lib/empty-state';
import { AdvancedDataTable, TableSkeleton } from '@workspace/ui/lib/table';
import type { IRowAction } from '@workspace/ui/lib/table';
import { useRouter } from 'next/navigation';

import empty1 from '~/images/empty-state.svg';
import { subTeamColumn } from '../../table-data';

interface SubTeamsTabProps {
  subTeams: Team[];
  rowActions: (row: Team) => IRowAction<Team>[];
  DeleteModal: () => React.JSX.Element;
  isLoading?: boolean;
  onSelectionChange?: (rows: Team[]) => void;
  customFooterRenderer?: () => React.ReactNode;
}

const SubTeamsTab = ({
  subTeams,
  rowActions,
  DeleteModal,
  isLoading = false,
  onSelectionChange,
  customFooterRenderer,
}: SubTeamsTabProps) => {
  const router = useRouter();

  if (isLoading) return <TableSkeleton />;

  if (subTeams.length === 0) {
    return (
      <EmptyState
        className="bg-background"
        images={[
          { src: empty1.src, alt: 'No sub-team', width: 100, height: 100 },
        ]}
        title="No sub-team yet."
        description="Create sub-teams to better organize your team, assign leads, and manage roles."
      />
    );
  }

  return (
    <>
      <AdvancedDataTable
        data={subTeams}
        columns={subTeamColumn}
        rowActions={rowActions}
        showPagination={false}
        enableRowSelection={true}
        enableColumnVisibility={true}
        onRowClick={(team: Team) => {
          if (team?.id) router.push(`/admin/teams/sub-team/${team.id}`);
        }}
        enableSorting={true}
        enableFiltering={true}
        mobileCardView={true}
        showColumnCustomization={false}
        onSelectionChange={onSelectionChange}
        customFooterRenderer={customFooterRenderer}
      />
      <DeleteModal />
    </>
  );
};

export { SubTeamsTab };
