/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { queryKeys } from '@/lib/react-query/query-keys';
import type { OnboardingSchemaTeam as TeamFormType } from '@/modules/@org/onboarding/types';
import { TeamForm } from '@/modules/@org/onboarding/_components/forms/team/team-form';
import { useOnboardingService } from '@/modules/@org/onboarding/services/use-onboarding-service';
import {
  useTeamDetailsModalParams,
  type TeamDetailsTab,
} from '@/lib/nuqs/use-team-details-modal-params';
import { useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { BreadCrumb } from '@workspace/ui/lib/breadcrumb';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { AlertModal, ReusableDialog } from '@workspace/ui/lib/dialog';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { EmptyState, ErrorEmptyState } from '@workspace/ui/lib/empty-state';
import { Icon } from '@workspace/ui/lib/icons/icon';
import type { IColumnDefinition } from '@workspace/ui/lib/table';
import { AdvancedDataTable } from '@workspace/ui/lib/table';
import { MainButton } from '@workspace/ui/lib/button';
import { cn } from '@workspace/ui/lib/utils';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import empty1 from '~/images/empty-state.svg';
import { CardGroup } from '../../../../_components/card-group';
import { DashboardCard } from '../../../../_components/dashboard-card';
import { useEmployeeRowActions } from '../../../employee/_views/table-data';
import { useEmployeeService } from '../../../employee/services/use-service';
import { useTeamService } from '../../services/use-service';
import { subTeamColumn, useSubTeamRowActions } from '../table-data';
import { TeamDetailsSkeleton } from './skeleton';
import { formatDate } from '@/lib/formatters';

// ── Employee response normalisation helpers ───────────────────────────────────
// Type guards to safely normalise different response shapes without using `any`.
// Pattern mirrored from sub-team-details/index.tsx.
function isEmployeeArray(value: unknown): value is Employee[] {
  return Array.isArray(value);
}
function hasItems(value: unknown): value is { items: unknown[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { items?: unknown[] }).items)
  );
}
function hasDataItems(value: unknown): value is { data: { items: unknown[] } } {
  if (typeof value !== 'object' || value === null) return false;
  const data = (value as { data?: unknown }).data;
  if (typeof data !== 'object' || data === null) return false;
  return Array.isArray((data as { items?: unknown[] }).items);
}

const DEFAULT_AVATAR_URL =
  'https://res.cloudinary.com/kingsleysolomon/image/upload/v1742989662/byte-alley/fisnolvvuvfiebxskgbs.svg';

// ── TeamDetailsHeader ─────────────────────────────────────────────────────────
const TeamDetailsHeader = ({
  teamId,
  onAddSubTeam,
  onEditTeam,
  onDeleteTeam,
}: {
  teamId: string;
  onAddSubTeam: () => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: () => void;
}) => {
  const { useGetTeamsById } = useTeamService();
  const { data: teamData } = useGetTeamsById(teamId, { enabled: !!teamId });

  return (
    <DashboardHeader
      title="Team Details"
      subtitle={
        <BreadCrumb
          items={[
            { label: 'Teams', href: '/admin/teams' },
            { label: teamData?.name || '', href: `/admin/teams/${teamId}` },
          ]}
        />
      }
      actionComponent={
        <div className="flex items-center gap-5">
          <MainButton
            variant="primary"
            isLeftIconVisible
            icon={<Icon name="Add" variant={`Bold`} />}
            onClick={onAddSubTeam}
            className={`w-full`}
          >
            Add Sub-team
          </MainButton>
          <GenericDropdown
            align="end"
            trigger={
              <Button size={`icon`} className={`shadow rounded-md`}>
                <Icon
                  name="More"
                  size={20}
                  variant={`Outline`}
                  className={`text-primary`}
                />
              </Button>
            }
          >
            <DropdownMenuItem
              onClick={() => {
                if (teamData) {
                  onEditTeam(teamData as Team);
                }
              }}
            >
              <span>
                <Icon
                  name="Edit"
                  size={16}
                  className="mr-2"
                  variant={`Outline`}
                />
              </span>
              Edit Team&apos;s Name
            </DropdownMenuItem>
            <Separator className="bg-border/40" />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDeleteTeam}
            >
              <span>
                <Icon
                  name="Trash"
                  size={16}
                  className="text-destructive mr-2"
                  variant={`Outline`}
                />
              </span>
              Delete Team
            </DropdownMenuItem>
          </GenericDropdown>
        </div>
      }
    />
  );
};

// ── TeamDetailsContent ────────────────────────────────────────────────────────
const TeamDetailsContent = ({
  teamId,
  onEditSubTeam,
}: {
  teamId: string;
  onEditSubTeam: (team: Team) => void;
}) => {
  const router = useRouter();

  // Tab URL state — survives page refresh (nuqs)
  const { tab, setTab } = useTeamDetailsModalParams();

  const { useGetTeamsById } = useTeamService();
  const {
    data: teamData,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
    refetch,
  } = useGetTeamsById(teamId, { enabled: !!teamId });

  // Sub-team row actions (used by the Sub Teams tab)
  const { getRowActions, DeleteConfirmationModal } = useSubTeamRowActions(
    onEditSubTeam,
    teamId
  );

  // Employee data for the "All Team Members" tab
  const { useGetAllEmployees } = useEmployeeService();
  const { data: employeesResp } = useGetAllEmployees({}, { enabled: true });

  const {
    getRowActions: getEmployeeRowActions,
    DeleteConfirmationModal: EmployeeDeleteModal,
    setActiveEmployee,
  } = useEmployeeRowActions();

  // Local search — single client-side filter shared across both tabs
  const [search, setSearch] = useState('');

  const subTeams = teamData?.subteams ?? [];

  // Normalise the employee response shape (same type-guard pattern as sub-team-details)
  const allEmployees: Employee[] = useMemo(() => {
    const payload = employeesResp as unknown;
    if (
      hasDataItems(payload) &&
      isEmployeeArray((payload as { data: { items: unknown[] } }).data.items)
    ) {
      return (payload as { data: { items: Employee[] } }).data.items;
    }
    if (
      hasItems(payload) &&
      isEmployeeArray((payload as { items: unknown[] }).items)
    ) {
      return (payload as { items: Employee[] }).items;
    }
    if (isEmployeeArray(payload)) {
      return payload as Employee[];
    }
    return [];
  }, [employeesResp]);

  // Sub-team ID set for O(1) membership lookup
  const subTeamIdSet = useMemo(
    () => new Set(subTeams.map((st) => st.id)),
    [subTeams]
  );

  // All members: direct parent-team members plus members of each sub-team
  const teamMembers = useMemo(
    () =>
      allEmployees.filter(
        (emp) =>
          emp?.employmentDetails?.team?.id === teamId ||
          subTeamIdSet.has(emp?.employmentDetails?.team?.id ?? '')
      ),
    [allEmployees, teamId, subTeamIdSet]
  );

  // Search-filtered members
  const filteredMembers = useMemo(() => {
    if (!search.trim()) return teamMembers;
    const q = search.toLowerCase();
    return teamMembers.filter(
      (emp) =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(q) ||
        emp.email?.toLowerCase().includes(q) ||
        emp.employmentDetails?.role?.name?.toLowerCase().includes(q) ||
        emp.employmentDetails?.team?.name?.toLowerCase().includes(q) ||
        emp.employmentDetails?.workMode?.toLowerCase().includes(q)
    );
  }, [teamMembers, search]);

  // Search-filtered sub-teams
  const filteredSubTeams = useMemo(() => {
    const items = subTeams as unknown as Team[];
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (st) =>
        st.name?.toLowerCase().includes(q) ||
        st.manager?.name?.toLowerCase().includes(q)
    );
  }, [subTeams, search]);

  // Members table column definitions (per Figma: Team Members, Email, Role, Work Mode, Sub Team, Status)
  const membersColumns = useMemo<IColumnDefinition<Employee>[]>(
    () => [
      {
        header: 'Team Members',
        accessorKey: 'firstName',
        render: (_, employee: Employee) => (
          <div
            className="flex w-fit items-center gap-2"
            onMouseEnter={() => setActiveEmployee(employee)}
            onFocus={() => setActiveEmployee(employee)}
            tabIndex={0}
          >
            <Image
              src={
                typeof employee.avatar === 'string' &&
                employee.avatar.length > 0
                  ? employee.avatar
                  : DEFAULT_AVATAR_URL
              }
              alt={`${employee.firstName} ${employee.lastName}`}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">
              {`${employee.firstName} ${employee.lastName}`}
            </span>
          </div>
        ),
      },
      {
        header: 'Email',
        accessorKey: 'email',
        render: (_, employee: Employee) => (
          <span className="text-sm">{employee?.email ?? 'N/A'}</span>
        ),
      },
      {
        header: 'Role',
        accessorKey: 'role',
        render: (_, employee: Employee) => (
          <span className="text-sm">
            {employee?.employmentDetails?.role?.name ?? 'N/A'}
          </span>
        ),
      },
      {
        header: 'Work Mode',
        accessorKey: 'workMode',
        render: (_, employee: Employee) => (
          <span className="text-sm capitalize">
            {employee?.employmentDetails?.workMode ?? 'N/A'}
          </span>
        ),
      },
      {
        header: 'Sub Team',
        accessorKey: 'subTeam',
        render: (_, employee: Employee) => {
          // Direct parent-team members have no sub-team → show "Unassigned"
          const isDirectMember =
            employee?.employmentDetails?.team?.id === teamId;
          const subTeamName = isDirectMember
            ? null
            : employee?.employmentDetails?.team?.name;
          return (
            <span className={cn('text-sm', !subTeamName && 'text-destructive')}>
              {subTeamName ?? 'Unassigned'}
            </span>
          );
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        render: (_, employee: Employee) => (
          <Badge
            className="min-w-fit"
            variant={employee.status === 'active' ? 'success' : 'warning'}
          >
            {employee.status === 'active' ? 'Active' : 'On Leave'}
          </Badge>
        ),
      },
    ],
    [setActiveEmployee, teamId]
  );

  if (isLoadingTeam) {
    return <TeamDetailsSkeleton />;
  }

  if (isErrorTeam) {
    return <ErrorEmptyState onRetry={refetch} />;
  }

  return (
    <>
      <CardGroup>
        <DashboardCard
          title="Team Name"
          value={<span className="text-base">{teamData?.name}</span>}
          className="flex flex-col items-center justify-center text-center"
        />
        <DashboardCard
          title="Team Manager"
          value={
            <div className="flex items-center gap-4">
              <Avatar className={`size-5 lg:size-8`}>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-sm lg:text-base text-balance">
                {teamData?.manager?.name || 'No manager assigned'}
              </span>
            </div>
          }
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Sub teams"
          value={
            <span className="text-base">{teamData?.subteams?.length ?? 0}</span>
          }
          className="flex flex-col items-center justify-center text-center"
        />
        <DashboardCard
          title="Created On"
          value={
            <span className="text-base">{formatDate(teamData?.createdAt)}</span>
          }
          className="flex flex-col items-center justify-center text-center"
        />
      </CardGroup>

      <section>
        <Tabs
          value={tab ?? 'members'}
          onValueChange={(v) => setTab(v as TeamDetailsTab)}
          className="w-full space-y-4"
        >
          {/* Tab triggers + shared search input */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="h-auto bg-transparent">
              <TabsTrigger value="members">All Team Members</TabsTrigger>
              <TabsTrigger value="sub-teams">Sub Teams</TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-72">
              <Icon
                name="SearchNormal1"
                size={16}
                variant="Outline"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search sub team, member..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search team members and sub-teams"
              />
            </div>
          </div>

          {/* ── All Team Members tab ──────────────────────────────────── */}
          <TabsContent value="members">
            {filteredMembers.length > 0 ? (
              <>
                <AdvancedDataTable
                  data={filteredMembers}
                  columns={membersColumns}
                  rowActions={getEmployeeRowActions}
                  showPagination={false}
                  enableRowSelection={true}
                  enableColumnVisibility={true}
                  enableSorting={true}
                  enableFiltering={true}
                  mobileCardView={true}
                  showColumnCustomization={false}
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
                description="Add members to this team to collaborate and assign roles."
              />
            )}
          </TabsContent>

          {/* ── Sub Teams tab ─────────────────────────────────────────── */}
          <TabsContent value="sub-teams">
            {filteredSubTeams.length > 0 ? (
              <>
                <AdvancedDataTable
                  data={filteredSubTeams}
                  columns={subTeamColumn}
                  rowActions={getRowActions}
                  showPagination={false}
                  enableRowSelection={true}
                  enableColumnVisibility={true}
                  onRowClick={(team: any) => {
                    if (team?.id) {
                      router.push(`/admin/teams/sub-team/${team.id}`);
                    }
                  }}
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
                    alt: 'No sub-team',
                    width: 100,
                    height: 100,
                  },
                ]}
                title="No sub-team yet."
                description="Create sub-teams to better organize your team, assign leads, and manage roles."
              />
            )}
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

// ── TeamDetails (orchestration) ───────────────────────────────────────────────
const TeamDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { useGetTeamsById, useDeleteTeam } = useTeamService();
  const { useUpdateTeam, useCreateTeam } = useOnboardingService();
  const { data: teamData } = useGetTeamsById(id, { enabled: !!id });

  // Modal URL state (nuqs) — edit-team and add-sub-team survive refresh
  const {
    isEditTeamOpen,
    isAddSubTeamOpen,
    openEditTeam,
    openAddSubTeam,
    closeModal,
  } = useTeamDetailsModalParams();

  // Destructive confirm stays as useState (never persist)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const { DeleteConfirmationModal } = useSubTeamRowActions((team) => {
    setEditingTeam(team);
    openEditTeam();
  }, id);

  const updateTeamMutation = useUpdateTeam();
  const createTeamMutation = useCreateTeam();
  const deleteTeamMutation = useDeleteTeam();

  const isUpdating = updateTeamMutation.isPending;
  const isCreating = createTeamMutation.isPending;
  const isDeleting = deleteTeamMutation.isPending;

  // Handle team name update
  const handleUpdateTeamName = async (data: { name: string }) => {
    const targetId = editingTeam?.id || id;
    await updateTeamMutation.mutateAsync(
      { teamId: targetId, name: data.name },
      {
        onError: (error) => {
          const errorMessage =
            error instanceof AxiosError && error.response?.data?.message
              ? error.response?.data?.message
              : 'Failed to update team name';
          toast.error(errorMessage);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.team.list() });
          queryClient.invalidateQueries({
            queryKey: queryKeys.team.details(targetId),
          });
          if (editingTeam && editingTeam.id !== id) {
            queryClient.invalidateQueries({
              queryKey: queryKeys.team.details(id),
            });
          }
          toast.success(`Team name updated successfully!`);
          closeModal();
          setEditingTeam(null);
        },
      }
    );
  };

  // Handle add sub-team
  const handleAddSubTeam = async (data: { name: string }) => {
    await createTeamMutation.mutateAsync(
      { name: data.name, parentId: id },
      {
        onError: (error) => {
          const errorMessage =
            error instanceof AxiosError && error.response?.data?.message
              ? error.response?.data?.message
              : 'Failed to create sub-team';
          toast.error(errorMessage);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.team.list() });
          queryClient.invalidateQueries({
            queryKey: queryKeys.team.details(id),
          });
          toast.success(`Sub-team "${data.name}" created successfully!`);
          closeModal();
        },
      }
    );
  };

  // Handle delete team
  const handleDeleteTeam = async () => {
    await deleteTeamMutation.mutateAsync(id, {
      onError: (error) => {
        const errorMessage =
          error instanceof AxiosError && error.response?.data?.message
            ? error.response?.data?.message
            : 'Failed to delete team';
        toast.error(errorMessage);
      },
      onSuccess: (response) => {
        if (response?.success) {
          toast.success(`Team "${teamData?.name}" deleted successfully!`);
          router.push('/admin/teams');
        }
      },
    });
  };

  return (
    <>
      <section className="space-y-8">
        <TeamDetailsHeader
          teamId={id}
          onAddSubTeam={openAddSubTeam}
          onEditTeam={(team) => {
            setEditingTeam(team);
            openEditTeam();
          }}
          onDeleteTeam={() => setIsDeleteConfirmOpen(true)}
        />

        <TeamDetailsContent
          teamId={id}
          onEditSubTeam={(team) => {
            setEditingTeam(team);
            openEditTeam();
          }}
        />
      </section>

      {/* Edit Team Name Dialog */}
      <ReusableDialog
        open={isEditTeamOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title="Edit Team Name"
        description="Update the name of this team"
        trigger={<span />}
        className="min-w-2xl"
      >
        <TeamForm
          initialData={
            editingTeam
              ? ({
                  id: editingTeam.id,
                  name: editingTeam.name,
                  roles: [],
                } as TeamFormType)
              : teamData
                ? ({
                    id: teamData.id,
                    name: teamData.name,
                    roles: [],
                  } as TeamFormType)
                : undefined
          }
          onSubmit={handleUpdateTeamName}
          onCancel={closeModal}
          isSubmitting={isUpdating}
        />
      </ReusableDialog>

      {/* Add Sub-team Dialog */}
      <ReusableDialog
        open={isAddSubTeamOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title="Add Sub-team"
        description="Create a new sub-team under this team"
        trigger={<span />}
        className="min-w-2xl"
      >
        <TeamForm
          onSubmit={handleAddSubTeam}
          onCancel={closeModal}
          isSubmitting={isCreating}
        />
      </ReusableDialog>

      {/* Delete Confirmation Modal for Sub-teams (from orchestration-level hook) */}
      <DeleteConfirmationModal />

      {/* Delete Team Confirmation */}
      <AlertModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => !isDeleting && setIsDeleteConfirmOpen(false)}
        onConfirm={async () => {
          if (isDeleting) return;
          await handleDeleteTeam();
          setIsDeleteConfirmOpen(false);
        }}
        loading={isDeleting}
        type="warning"
        title="Delete Team"
        description={`Are you sure you want to delete "${teamData?.name}"? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Team'}
        cancelText="Cancel"
      />
    </>
  );
};

export { TeamDetails };
