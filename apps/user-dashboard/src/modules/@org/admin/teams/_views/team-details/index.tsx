/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { queryKeys } from '@/lib/react-query/query-keys';
import type { OnboardingSchemaTeam as TeamFormType } from '@/modules/@org/onboarding/types';
import { TeamForm } from '@/modules/@org/onboarding/_components/forms/team/team-form';
import { useOnboardingService } from '@/modules/@org/onboarding/services/use-onboarding-service';
import { useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { Separator } from '@workspace/ui/components/separator';
import { BreadCrumb } from '@workspace/ui/lib/breadcrumb';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { AlertModal, ReusableDialog } from '@workspace/ui/lib/dialog';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { EmptyState, ErrorEmptyState } from '@workspace/ui/lib/empty-state';
import { AdvancedDataTable } from '@workspace/ui/lib/table';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import empty1 from '~/images/empty-state.svg';
import { CardGroup } from '../../../../_components/card-group';
import { DashboardCard } from '../../../../_components/dashboard-card';
import { useTeamService } from '../../services/use-service';
import { subTeamColumn, useSubTeamRowActions } from '../table-data';
import { TeamDetailsSkeleton } from './skeleton';
import { formatDate } from '@/lib/formatters';
import { Button } from '@workspace/ui/components/button';

// Team Details Header Component
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

// Team Details Content Component
const TeamDetailsContent = ({
  teamId,
  onEditSubTeam,
}: {
  teamId: string;
  onEditSubTeam: (team: Team) => void;
}) => {
  const router = useRouter();
  const { useGetTeamsById } = useTeamService();
  const {
    data: teamData,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
    refetch,
  } = useGetTeamsById(teamId, { enabled: !!teamId });
  const { getRowActions, DeleteConfirmationModal } = useSubTeamRowActions(
    onEditSubTeam,
    teamId
  );

  const subTeams = teamData?.subTeams ?? [];

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
            <span className="text-base">{teamData?.subTeams?.length ?? 0}</span>
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
        {subTeams.length > 0 ? (
          <AdvancedDataTable
            data={subTeams as unknown as Team[]}
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
        ) : (
          <EmptyState
            className="bg-background"
            images={[
              { src: empty1.src, alt: 'No sub-team', width: 100, height: 100 },
            ]}
            title="No sub-team yet."
            description="Create sub-teams to better organize your team, assign leads, and manage roles."
          />
        )}
        <DeleteConfirmationModal />
      </section>
    </>
  );
};

const TeamDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { useGetTeamsById, useDeleteTeam } = useTeamService();
  const { useUpdateTeam, useCreateTeam } = useOnboardingService();
  const { data: teamData } = useGetTeamsById(id, { enabled: !!id });

  // Local state for dialogs
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddSubTeamDialogOpen, setIsAddSubTeamDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const { DeleteConfirmationModal } = useSubTeamRowActions((team) => {
    setEditingTeam(team);
    setIsEditDialogOpen(true);
  }, id);

  const updateTeamMutation = useUpdateTeam();
  const createTeamMutation = useCreateTeam();
  const deleteTeamMutation = useDeleteTeam();

  // Track loading states from mutations
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
          // Invalidate list and both affected detail queries (parent & edited team if different)
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
          setIsEditDialogOpen(false);
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
          setIsAddSubTeamDialogOpen(false);
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
          onAddSubTeam={() => setIsAddSubTeamDialogOpen(true)}
          onEditTeam={(team) => {
            setEditingTeam(team);
            setIsEditDialogOpen(true);
          }}
          onDeleteTeam={() => setIsDeleteConfirmOpen(true)}
        />

        <TeamDetailsContent
          teamId={id}
          onEditSubTeam={(team) => {
            setEditingTeam(team);
            setIsEditDialogOpen(true);
          }}
        />
      </section>

      {/* Edit Team Name Dialog */}
      <ReusableDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
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
          onCancel={() => setIsEditDialogOpen(false)}
          isSubmitting={isUpdating}
        />
      </ReusableDialog>

      {/* Add Sub-team Dialog */}
      <ReusableDialog
        open={isAddSubTeamDialogOpen}
        onOpenChange={setIsAddSubTeamDialogOpen}
        title="Add Sub-team"
        description="Create a new sub-team under this team"
        trigger={<span />}
        className="min-w-2xl"
      >
        <TeamForm
          onSubmit={handleAddSubTeam}
          onCancel={() => setIsAddSubTeamDialogOpen(false)}
          isSubmitting={isCreating}
        />
      </ReusableDialog>

      {/* Delete Confirmation Modal for Sub-teams */}
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
