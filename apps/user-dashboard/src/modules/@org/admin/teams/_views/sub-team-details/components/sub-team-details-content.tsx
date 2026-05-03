'use client';

import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import {
  AdvancedDataTable,
  type IColumnDefinition,
  type IRowAction,
} from '@workspace/ui/lib/table';
import { EmptyState, ErrorEmptyState } from '@workspace/ui/lib/empty-state';
import { SearchInput } from '@/modules/@org/shared';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { toast } from 'sonner';

import empty1 from '~/images/empty-state.svg';
import { useEmployeeRowActions } from '@/modules/@org/admin/employee/_views/table-data';
import { useEmployeeService } from '@/modules/@org/admin/employee/services/use-service';
import { useTeamService } from '@/modules/@org/admin/teams/services/use-service';
import { SubTeamDetailsSkeleton } from '@/modules/@org/admin/teams/_views/sub-team-details/skeleton';
import { TeamStatsCards } from '@/modules/@org/admin/teams/_views/team-details/components/team-stats-cards';
import { useMembersColumns } from '@/modules/@org/admin/teams/_views/team-details/components/members-columns';

interface SubTeamDetailsContentProps {
  teamId: string;
  onAddEmployee: () => void;
  onAddRole: () => void;
  onEditRole?: (role: Role) => void;
}

const SubTeamDetailsContent = ({
  teamId,
  onAddEmployee,
  onAddRole,
  onEditRole,
}: SubTeamDetailsContentProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 300);

  const { useGetTeamsById, useGetRoles } = useTeamService();
  const {
    data: teamData,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
    refetch,
  } = useGetTeamsById(teamId, { enabled: !!teamId });

  const { useGetAllEmployees } = useEmployeeService();
  const membersFilters = { teamId } as Filters;
  if (debouncedSearch.trim()) {
    membersFilters.search = debouncedSearch.trim();
  }
  const { data: employeesResp, isLoading: isLoadingMembers } =
    useGetAllEmployees(membersFilters, { enabled: !!teamId });
  const members: Employee[] = employeesResp?.data?.items ?? [];

  const {
    getRowActions: getEmployeeRowActions,
    DeleteConfirmationModal: EmployeeDeleteModal,
    setActiveEmployee,
  } = useEmployeeRowActions();

  const { data: rolesData } = useGetRoles(teamId, {
    enabled: !!teamId,
  });

  type RoleRow = Role & Record<string, unknown>;

  const roleColumns = useMemo<IColumnDefinition<RoleRow>[]>(
    () => [
      {
        header: 'Role Name',
        accessorKey: 'name',
        render: (_, role) => (
          <span className="text-sm font-medium">{role.name}</span>
        ),
      },
      {
        header: 'Permissions',
        accessorKey: 'permissions',
        render: (_, role) => (
          <span className="text-sm text-muted-foreground">
            {(role.permissions as unknown[])?.length || 0} permissions
          </span>
        ),
      },
    ],
    []
  );

  const membersColumns = useMembersColumns(teamId, setActiveEmployee);

  if (isLoadingTeam) return <SubTeamDetailsSkeleton />;

  if (isErrorTeam) {
    return <ErrorEmptyState onRetry={refetch} />;
  }

  return (
    <>
      <TeamStatsCards teamData={teamData} />

      <section>
        <Tabs defaultValue="members" className="w-full space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="h-auto bg-transparent">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-72">
              <SearchInput
                placeholder="Search members..."
                onSearch={setSearchInput}
                className="h-10"
              />
            </div>
          </div>

          {/* ── MEMBERS TAB ───────────────────────────────────────────────────────── */}
          <TabsContent value="members">
            {members.length > 0 ? (
              <>
                <AdvancedDataTable
                  data={members}
                  columns={membersColumns}
                  rowActions={getEmployeeRowActions}
                  showPagination={false}
                  enableRowSelection={true}
                  enableColumnVisibility={true}
                  enableSorting={true}
                  enableFiltering={true}
                  mobileCardView={true}
                />
                <EmployeeDeleteModal />
              </>
            ) : (
              <EmptyState
                className="bg-background"
                images={[
                  {
                    src: empty1.src,
                    alt: 'No team members',
                    width: 100,
                    height: 100,
                  },
                ]}
                title="No team members yet."
                description="Add employees to this sub-team to collaborate and assign roles."
                button={{
                  text: 'Add Employee',
                  onClick: onAddEmployee,
                }}
              />
            )}
          </TabsContent>

          {/* ── ROLES TAB ─────────────────────────────────────────────────────────── */}
          <TabsContent value="roles">
            {rolesData && rolesData.length > 0 ? (
              <AdvancedDataTable
                data={rolesData as RoleRow[]}
                columns={roleColumns}
                rowActions={(role: RoleRow) => [
                  {
                    label: 'Edit Role',
                    icon: <Icon name="Edit" size={16} variant="Outline" />,
                    onClick: () => {
                      onEditRole?.(role as Role);
                    },
                  },
                  ...(role.id
                    ? [{ type: 'separator' as const } as IRowAction<RoleRow>]
                    : []),
                  ...(role.id
                    ? [
                        {
                          label: 'Delete Role',
                          variant: 'destructive' as const,
                          icon: (
                            <Icon
                              name="Trash"
                              size={16}
                              variant="Outline"
                              className="text-destructive"
                            />
                          ),
                          onClick: () => {
                            toast.info(
                              'Role delete will be available in a future update.'
                            );
                          },
                        } as IRowAction<RoleRow>,
                      ]
                    : []),
                ]}
                showPagination={false}
                enableRowSelection={false}
                enableColumnVisibility={true}
                enableSorting={true}
                enableFiltering={true}
              />
            ) : (
              <EmptyState
                className="bg-background"
                images={[
                  {
                    src: empty1.src,
                    alt: 'No roles yet',
                    width: 100,
                    height: 100,
                  },
                ]}
                title="No roles configured."
                description="Define roles with permissions to control what sub-team members can access."
                // button handled by parent
              />
            )}
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export { SubTeamDetailsContent };
