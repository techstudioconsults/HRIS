'use client';

import { EmptyState } from '@workspace/ui/lib/empty-state';
import { AdvancedDataTable, TableSkeleton } from '@workspace/ui/lib/table';
import type { IColumnDefinition, IRowAction } from '@workspace/ui/lib/table';

import empty1 from '~/images/empty-state.svg';

interface MembersTabProps {
  members: Employee[];
  columns: IColumnDefinition<Employee>[];
  rowActions: (row: Employee) => IRowAction<Employee>[];
  DeleteModal: () => React.JSX.Element;
  isLoading?: boolean;
  onSelectionChange?: (rows: Employee[]) => void;
  customFooterRenderer?: () => React.ReactNode;
}

const MembersTab = ({
  members,
  columns,
  rowActions,
  DeleteModal,
  isLoading = false,
  onSelectionChange,
  customFooterRenderer,
}: MembersTabProps) => {
  if (isLoading) return <TableSkeleton />;

  if (members.length === 0) {
    return (
      <EmptyState
        className="bg-background"
        images={[
          { src: empty1.src, alt: 'No team members', width: 100, height: 100 },
        ]}
        title="No team members yet."
        description="Add members to this team to collaborate and assign roles."
      />
    );
  }

  return (
    <>
      <AdvancedDataTable
        data={members}
        columns={columns}
        rowActions={rowActions}
        showPagination={false}
        enableRowSelection={true}
        enableColumnVisibility={true}
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

export { MembersTab };
