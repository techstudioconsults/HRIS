'use client';

import { useCallback, useMemo, useState } from 'react';
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
import { MainButton } from '@workspace/ui/lib/button';
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
  onDeleteRole?: (role: Role) => void;
}

const SubTeamDetailsContent = ({
  teamId,
  onAddEmployee,
  onAddRole,
  onEditRole,
  onDeleteRole,
}: SubTeamDetailsContentProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 300);

  const [selectedMembers, setSelectedMembers] = useState<Employee[]>([]);

  const handleMembersSelectionChange = useCallback((rows: Employee[]) => {
    setSelectedMembers(rows);
  }, []);

  const handleExportMembers = useCallback(() => {
    if (selectedMembers.length === 0) return;
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Role',
      'Department',
      'Status',
    ];
    const rows = selectedMembers.map((member) => [
      member.firstName,
      member.lastName,
      member.email,
      member.employmentDetails?.role?.name ?? '',
      member.employmentDetails?.team?.name ?? '',
      member.status,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sub-team-members-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(
      `Exported ${selectedMembers.length} member${selectedMembers.length > 1 ? 's' : ''} to CSV.`
    );
  }, [selectedMembers]);

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
  const { data: employeesResp } = useGetAllEmployees(membersFilters, {
    enabled: !!teamId,
  });
  const members: Employee[] = employeesResp?.data?.items ?? [];

  const {
    getRowActions: getEmployeeRowActions,
    DeleteConfirmationModal: EmployeeDeleteModal,
    setActiveEmployee,
  } = useEmployeeRowActions();

  const { data: rolesRaw } = useGetRoles(teamId, { enabled: !!teamId });
  const rolesData = useMemo(
    () =>
      (rolesRaw ?? []).filter(
        (role: Role) => role.name?.toLowerCase().trim() !== 'default'
      ),
    [rolesRaw]
  );

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
      <TeamStatsCards teamData={teamData} variant="sub-team" />

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
                  mobileCardView={true}
                  enableColumnVisibility={true}
                  enableSorting={true}
                  enableFiltering={true}
                  showColumnCustomization={false}
                  onSelectionChange={handleMembersSelectionChange}
                  customFooterRenderer={() =>
                    selectedMembers.length > 0 ? (
                      <div className="flex flex-col gap-3 rounded-b-lg border-t bg-primary/5 px-4 py-3 sm:flex-row sm:items-center">
                        <span className="text-sm font-medium text-primary">
                          {selectedMembers.length} row
                          {selectedMembers.length > 1 ? 's' : ''} selected
                        </span>
                        <div className="sm:ml-auto">
                          <MainButton
                            variant="primaryOutline"
                            onClick={handleExportMembers}
                            isLeftIconVisible
                            icon={
                              <Icon name="DocumentDownload" variant="Outline" />
                            }
                          >
                            Export CSV
                          </MainButton>
                        </div>
                      </div>
                    ) : null
                  }
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
                showColumnCustomization={false}
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
                            onDeleteRole?.(role as Role);
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
                button={{
                  text: 'Add Role',
                  onClick: onAddRole,
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export { SubTeamDetailsContent };
