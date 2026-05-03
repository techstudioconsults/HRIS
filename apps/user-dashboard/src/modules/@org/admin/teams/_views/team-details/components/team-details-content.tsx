'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { ErrorEmptyState } from '@workspace/ui/lib/empty-state';
import { useCallback, useState } from 'react';
import { useDebounce } from 'use-debounce';

import {
  useTeamDetailsModalParams,
  type TeamDetailsTab,
} from '@/lib/nuqs/use-team-details-modal-params';
import { useTeamService } from '../../../services/use-service';
import { useSubTeamRowActions } from '../../table-data';
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

  // ── Team stats ─────────────────────────────────────────────────────────────
  const { useGetTeamsById } = useTeamService();
  const {
    data: teamData,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
    refetch,
  } = useGetTeamsById(teamId, { enabled: !!teamId });

  // ── Sub-team row actions ───────────────────────────────────────────────────
  const { getRowActions, DeleteConfirmationModal } = useSubTeamRowActions(
    onEditSubTeam,
    teamId,
    onAddSubTeamRole,
    onAddSubTeamMembers
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
  const allSubTeams: Team[] = (teamData?.subteams ?? []) as unknown as Team[];
  const subTeams: Team[] = debouncedSearch.trim()
    ? allSubTeams.filter((t) =>
        t.name?.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
      )
    : allSubTeams;

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
            />
          </TabsContent>

          <TabsContent value="sub-teams">
            <SubTeamsTab
              subTeams={subTeams}
              rowActions={getRowActions}
              DeleteModal={DeleteConfirmationModal}
              isLoading={isLoadingTeam}
            />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export { TeamDetailsContent };
