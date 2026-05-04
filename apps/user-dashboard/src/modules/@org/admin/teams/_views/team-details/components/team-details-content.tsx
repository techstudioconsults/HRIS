'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { ErrorEmptyState } from '@workspace/ui/lib/empty-state';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { toast } from 'sonner';
import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { formatDate } from '@/lib/formatters';

import {
  useTeamDetailsModalParams,
  type TeamDetailsTab,
} from '@/lib/nuqs/use-team-details-modal-params';
import { useTeamService } from '../../../services/use-service';
import { useSubTeamRowActions } from '../../table-data';
import { AssignManagerDialog } from '../../../_components/forms/assign-manager-dialog';
import { TeamDetailsSkeleton } from '../skeleton';
import { useMembersColumns } from './members-columns';
import { MembersTab } from './members-tab';
import { SubTeamsTab } from './sub-teams-tab';
import { TeamStatsCards } from './team-stats-cards';
import { useEmployeeService } from '@/modules/@org/admin/employee/services/use-service';
import { useEmployeeRowActions } from '@/modules/@org/admin/employee/_views/table-data';
import { SearchInput } from '@/modules/@org/shared';

interface TeamDetailsContentProps {
  teamId: string;
  onEditSubTeam: (team: Team) => void;
  onAddSubTeamRole?: (team: Team) => void;
  onAddSubTeamMembers?: (team: Team) => void;
}

const TeamDetailsContent = ({
  teamId,
  onEditSubTeam,
  onAddSubTeamRole,
  onAddSubTeamMembers,
}: TeamDetailsContentProps) => {
  const { tab, setTab } = useTeamDetailsModalParams();

  // ── Bulk selection state ───────────────────────────────────────────────────
  const [selectedMembers, setSelectedMembers] = useState<Employee[]>([]);
  const [selectedSubTeams, setSelectedSubTeams] = useState<Team[]>([]);

  const handleMembersSelectionChange = useCallback((rows: Employee[]) => {
    setSelectedMembers(rows);
  }, []);

  const handleSubTeamsSelectionChange = useCallback((rows: Team[]) => {
    setSelectedSubTeams(rows);
  }, []);

  const exportToCsv = useCallback((rows: Array<string[]>, filename: string) => {
    const csvContent = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleExportMembers = useCallback(() => {
    if (selectedMembers.length === 0) return;
    exportToCsv(
      [
        ['First Name', 'Last Name', 'Email', 'Role', 'Department', 'Status'],
        ...selectedMembers.map((member) => [
          member.firstName,
          member.lastName,
          member.email,
          member.employmentDetails?.role?.name ?? '',
          member.employmentDetails?.team?.name ?? '',
          member.status,
        ]),
      ],
      `team-members-${new Date().toISOString().split('T')[0]}.csv`
    );
    toast.success(
      `Exported ${selectedMembers.length} member${selectedMembers.length > 1 ? 's' : ''} to CSV.`
    );
  }, [exportToCsv, selectedMembers]);

  const handleExportSubTeams = useCallback(() => {
    if (selectedSubTeams.length === 0) return;
    exportToCsv(
      [
        ['Sub-team Name', 'Team Lead', 'Members', 'Created On'],
        ...selectedSubTeams.map((subTeam) => [
          subTeam.name,
          subTeam.manager?.name ?? '',
          String(subTeam.members ?? 0),
          formatDate(subTeam.createdAt as string),
        ]),
      ],
      `sub-teams-${new Date().toISOString().split('T')[0]}.csv`
    );
    toast.success(
      `Exported ${selectedSubTeams.length} sub-team${selectedSubTeams.length > 1 ? 's' : ''} to CSV.`
    );
  }, [exportToCsv, selectedSubTeams]);

  // ── Team stats ─────────────────────────────────────────────────────────────
  const { useGetTeamsById } = useTeamService();
  const {
    data: teamData,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
    refetch,
  } = useGetTeamsById(teamId, { enabled: !!teamId });

  // ── Assign manager state ──────────────────────────────────────────────────
  const [assignManagerSubTeam, setAssignManagerSubTeam] = useState<Team | null>(
    null
  );

  // ── Sub-team row actions ───────────────────────────────────────────────────
  const { getRowActions, DeleteConfirmationModal } = useSubTeamRowActions(
    onEditSubTeam,
    teamId,
    onAddSubTeamRole,
    onAddSubTeamMembers,
    (team) => setAssignManagerSubTeam(team)
  );

  // ── Search: local input state, debounced before API call ──────────────────
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 300);

  const handleSearchChange = useCallback((query: string) => {
    setSearchInput(query);
  }, []);

  // ── Members: backend search via /employees?teamId=&search= ─────────────────
  const { useGetAllEmployees } = useEmployeeService();
  const membersFilters: Filters = { teamId };
  if (debouncedSearch.trim()) {
    membersFilters.search = debouncedSearch.trim();
  }
  const { data: employeesResp, isLoading: isLoadingMembers } =
    useGetAllEmployees(membersFilters, { enabled: !!teamId });

  const {
    getRowActions: getEmployeeRowActions,
    DeleteConfirmationModal: EmployeeDeleteModal,
    setActiveEmployee,
  } = useEmployeeRowActions();

  const allEmployees: Employee[] = employeesResp?.data?.items ?? [];

  // ── Sub-teams: frontend filter on embedded teamData.subteams ────────────────
  // (backend has no search endpoint for sub-teams yet)
  const allSubTeams: Team[] = useMemo(
    () =>
      ((teamData?.subteams ?? []) as unknown as Team[]).filter(
        (subTeam) => subTeam.name?.toLowerCase().trim() !== 'default'
      ),

    [teamData?.subteams]
  );
  const subTeams: Team[] = useMemo(
    () =>
      debouncedSearch.trim()
        ? allSubTeams.filter((subTeam) =>
            subTeam.name
              ?.toLowerCase()
              .includes(debouncedSearch.trim().toLowerCase())
          )
        : allSubTeams,
    [allSubTeams, debouncedSearch]
  );

  const membersColumns = useMembersColumns(teamId, setActiveEmployee);

  if (isLoadingTeam) return <TeamDetailsSkeleton />;
  if (isErrorTeam) return <ErrorEmptyState onRetry={refetch} />;

  return (
    <>
      <TeamStatsCards teamData={teamData} />
      <section>
        <Tabs
          value={tab ?? 'members'}
          onValueChange={(value) => setTab(value as TeamDetailsTab)}
          className="w-full space-y-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="h-auto bg-transparent">
              <TabsTrigger value="members">All Team Members</TabsTrigger>
              <TabsTrigger value="sub-teams">Sub Teams</TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-72">
              <SearchInput
                placeholder="Search sub team, member..."
                onSearch={handleSearchChange}
                className="h-10"
              />
            </div>
          </div>

          <TabsContent value="members">
            <MembersTab
              members={allEmployees}
              columns={membersColumns}
              rowActions={getEmployeeRowActions}
              DeleteModal={EmployeeDeleteModal}
              isLoading={isLoadingMembers}
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
          </TabsContent>

          <TabsContent value="sub-teams">
            <SubTeamsTab
              subTeams={subTeams}
              rowActions={getRowActions}
              DeleteModal={DeleteConfirmationModal}
              isLoading={isLoadingTeam}
              onSelectionChange={handleSubTeamsSelectionChange}
              customFooterRenderer={() =>
                selectedSubTeams.length > 0 ? (
                  <div className="flex flex-col gap-3 rounded-b-lg border-t bg-primary/5 px-4 py-3 sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-primary">
                      {selectedSubTeams.length} row
                      {selectedSubTeams.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="sm:ml-auto">
                      <MainButton
                        variant="primaryOutline"
                        onClick={handleExportSubTeams}
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
          </TabsContent>
        </Tabs>
      </section>

      <AssignManagerDialog
        team={assignManagerSubTeam}
        open={!!assignManagerSubTeam}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setAssignManagerSubTeam(null);
        }}
      />
    </>
  );
};

export { TeamDetailsContent };
