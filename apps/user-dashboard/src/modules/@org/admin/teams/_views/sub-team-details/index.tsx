'use client';

import { useSubTeamModalParams } from '@/lib/nuqs/use-sub-team-modal-params';
import { Badge } from '@workspace/ui/components/badge';
import { BreadCrumb } from '@workspace/ui/lib/breadcrumb';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { ReusableDialog } from '@workspace/ui/lib/dialog';
import { EmptyState, ErrorEmptyState } from '@workspace/ui/lib/empty-state';
import { AdvancedDataTable } from '@workspace/ui/lib/table';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQueryClient } from '@tanstack/react-query';

import empty1 from '~/images/empty-state.svg';
import AddNewMembers from '../../_components/forms/add-new-members';
import type { MemberAssignment } from '../../types';
import { CardGroup } from '../../../../_components/card-group';
import { DashboardCard } from '../../../../_components/dashboard-card';
import { useEmployeeRowActions } from '../../../employee/_views/table-data';
import { useEmployeeService } from '../../../employee/services/use-service';
import { useTeamService } from '../../services/use-service';
import { SubTeamDetailsSkeleton } from './skeleton';
import { formatDate } from '@/lib/formatters';
import { SearchInput } from '@/modules/@org/shared';

// Sub Team Details Header Component
const SubTeamDetailsHeader = ({
  teamId,
  onAddMemberClick,
}: {
  teamId: string;
  onAddMemberClick: () => void;
}) => {
  const { useGetTeamsById } = useTeamService();
  const { data: teamData } = useGetTeamsById(teamId, { enabled: !!teamId });

  const parentName =
    typeof teamData?.parent === 'object' && teamData?.parent !== null
      ? (teamData.parent as { name?: string }).name
      : undefined;
  const parentId =
    typeof teamData?.parent === 'object' && teamData?.parent !== null
      ? (teamData.parent as { id?: string }).id
      : teamData?.parent;

  return (
    <DashboardHeader
      title="Sub Team Details"
      subtitle={
        <BreadCrumb
          items={[
            { label: 'Teams', href: '/admin/teams' },
            {
              label: parentName || 'Parent Team',
              href: `/admin/teams/${parentId}`,
            },
            { label: teamData?.name || '', href: `/admin/teams/${teamId}` },
          ]}
        />
      }
      actionComponent={
        <MainButton
          variant="primary"
          size="lg"
          isLeftIconVisible
          icon={<Icon name="Plus" />}
          onClick={onAddMemberClick}
        >
          Add Member
        </MainButton>
      }
    />
  );
};

// Sub Team Details Content Component
const SubTeamDetailsContent = ({ teamId }: { teamId: string }) => {
  const { isAddMemberOpen, openAddMember, closeModal } =
    useSubTeamModalParams();

  const { useGetTeamsById } = useTeamService();
  const {
    data: teamData,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
    refetch,
  } = useGetTeamsById(teamId, { enabled: !!teamId });

  // ── Search: debounced input ───────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 300);

  const handleSearchChange = useCallback((query: string) => {
    setSearchInput(query);
  }, []);

  // ── Members: backend search via /employees?teamId=&search= ────────────────
  const { useGetAllEmployees } = useEmployeeService();
  const membersFilters: Filters = { teamId };
  if (debouncedSearch.trim()) {
    membersFilters.search = debouncedSearch.trim();
  }
  const { data: employeesResp, isLoading: isLoadingMembers } =
    useGetAllEmployees(membersFilters, { enabled: !!teamId });

  const members: Employee[] = employeesResp?.data?.items ?? [];

  const { getRowActions, DeleteConfirmationModal, setActiveEmployee } =
    useEmployeeRowActions();
  const columns = useMemo<IColumnDefinition<Employee>[]>(
    () => [
      {
        header: 'Team Member',
        accessorKey: 'firstName',
        render: (_, employee: Employee) => (
          <div
            className={'flex w-fit items-center gap-2'}
            onMouseEnter={() => setActiveEmployee(employee)}
            onFocus={() => setActiveEmployee(employee)}
            tabIndex={0}
          >
            <Image
              src={
                typeof employee.avatar === 'string' &&
                employee.avatar.length > 0
                  ? employee.avatar
                  : 'https://res.cloudinary.com/kingsleysolomon/image/upload/v1742989662/byte-alley/fisnolvvuvfiebxskgbs.svg'
              }
              alt={employee.firstName}
              width={100}
              height={100}
              className={`bg-low-grey-III h-8 w-8 rounded-full object-cover`}
            />
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium">{`${employee.firstName} ${employee.lastName}`}</span>
            </div>
          </div>
        ),
      },
      {
        header: 'Email',
        accessorKey: 'email',
        render: (_, employee: Employee) => (
          <span className="text-sm">{employee?.email || 'N/A'}</span>
        ),
      },
      {
        header: 'Role',
        accessorKey: 'role',
        render: (_, employee: Employee) => (
          <span className="text-sm">
            {employee?.employmentDetails?.role?.name || 'N/A'}
          </span>
        ),
      },
      {
        header: 'Work Mode',
        accessorKey: 'workMode',
        render: (_, employee: Employee) => (
          <span className="text-sm capitalize">
            {employee?.employmentDetails?.workMode || 'N/A'}
          </span>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        render: (_, employee: Employee) => (
          <Badge
            className="min-w-fit"
            variant={employee.status === `active` ? `success` : `warning`}
          >
            {employee.status === `active` ? 'Active' : 'On Leave'}
          </Badge>
        ),
      },
    ],
    [setActiveEmployee]
  );

  if (isLoadingTeam || isLoadingMembers) {
    return <SubTeamDetailsSkeleton />;
  }

  if (isErrorTeam) {
    return <ErrorEmptyState onRetry={refetch} />;
  }

  return (
    <>
      <CardGroup>
        <DashboardCard
          title="Team Name"
          value={<p className="text-base">{teamData?.name}</p>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Team Manager"
          value={
            <p className="text-base">
              {teamData?.manager?.name || 'No manager assigned'}
            </p>
          }
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Team Members"
          value={<p className="text-base">{members.length}</p>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Created On"
          value={<p className="text-base">{formatDate(teamData?.createdAt)}</p>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
      </CardGroup>

      <section className="space-y-4">
        <div className="relative w-full sm:w-72">
          <SearchInput
            placeholder="Search members..."
            onSearch={handleSearchChange}
            className="h-10"
          />
        </div>
        {members.length > 0 ? (
          <>
            <AdvancedDataTable
              data={members}
              columns={columns}
              rowActions={getRowActions}
              showPagination={false}
              enableDragAndDrop={true}
              enableRowSelection={true}
              enableColumnVisibility={true}
              enableSorting={true}
              enableFiltering={true}
              mobileCardView={true}
              showColumnCustomization={false}
            />
            <DeleteConfirmationModal />
          </>
        ) : (
          <EmptyState
            className="bg-background"
            images={[
              {
                src: empty1.src,
                alt: 'No team member',
                width: 100,
                height: 100,
              },
            ]}
            title="No team member yet."
            description="Add members to this team to collaborate and assign roles."
            button={{
              text: 'Add Member',
              onClick: openAddMember,
            }}
          />
        )}
      </section>
    </>
  );
};

const SubTeamDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { isAddMemberOpen, openAddMember, closeModal } =
    useSubTeamModalParams();
  const { useGetTeamsById, useAssignEmployeeToTeam } = useTeamService();
  const { data: teamData } = useGetTeamsById(id, { enabled: !!id });
  const queryClient = useQueryClient();
  const { mutateAsync: assignEmployee, isPending: isAssigning } =
    useAssignEmployeeToTeam();

  // Derive the parent team id from the team's parent field
  const parentTeamId = (() => {
    const parent: unknown = (teamData as unknown as { parent?: unknown })
      ?.parent;
    if (
      parent &&
      typeof parent === 'object' &&
      (parent as { id?: string }).id
    ) {
      return (parent as { id: string }).id;
    }
    if (typeof parent === 'string') return parent;
    return id;
  })();

  const handleAddMember = async (assignment: MemberAssignment) => {
    await assignEmployee({
      employeeId: assignment.employeeId,
      teamId: id,
      roleId: assignment.roleId,
    });
    // Refresh the members list for this sub-team
    await queryClient.invalidateQueries({
      queryKey: ['employee', 'list'],
    });
    await queryClient.invalidateQueries({
      queryKey: ['team', 'details', id],
    });
  };

  return (
    <>
      <section className="space-y-8">
        <SubTeamDetailsHeader teamId={id} onAddMemberClick={openAddMember} />
        <SubTeamDetailsContent teamId={id} />
      </section>

      <ReusableDialog
        open={isAddMemberOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title="Assign Members"
        description="Assign existing parent team members to this sub-team."
        trigger={<span />}
        className="min-w-2xl"
      >
        <AddNewMembers
          parentTeamId={parentTeamId}
          availableRoles={[]}
          onSubmit={handleAddMember}
          onCancel={closeModal}
          isSubmitting={isAssigning}
        />
      </ReusableDialog>
    </>
  );
};

export { SubTeamDetails };
