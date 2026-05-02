'use client';

import { queryKeys } from '@/lib/react-query/query-keys';
import { useOnboardingService } from '@/modules/@org/onboarding/services/use-onboarding-service';
import { useTeamDetailsModalParams } from '@/lib/nuqs/use-team-details-modal-params';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useTeamService } from '../../services/use-service';
import { useSubTeamRowActions } from '../table-data';
import { TeamDetailsContent } from './components/team-details-content';
import { TeamDetailsDialogs } from './components/team-details-dialogs';
import { TeamDetailsHeader } from './components/team-details-header';

// ── TeamDetails (orchestrator) ────────────────────────────────────────────────
const TeamDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { useGetTeamsById, useDeleteTeam } = useTeamService();
  const { useUpdateTeam, useCreateTeam } = useOnboardingService();
  const { data: teamData } = useGetTeamsById(id, { enabled: !!id });

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

  const handleUpdateTeamName = async (data: { name: string }) => {
    const targetId = editingTeam?.id || id;
    await updateTeamMutation.mutateAsync(
      { teamId: targetId, name: data.name },
      {
        onError: (error) => {
          toast.error(
            error instanceof AxiosError && error.response?.data?.message
              ? error.response.data.message
              : 'Failed to update team name'
          );
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
          toast.success('Team name updated successfully!');
          closeModal();
          setEditingTeam(null);
        },
      }
    );
  };

  const handleAddSubTeam = async (data: { name: string }) => {
    await createTeamMutation.mutateAsync(
      { name: data.name, parentId: id },
      {
        onError: (error) => {
          toast.error(
            error instanceof AxiosError && error.response?.data?.message
              ? error.response.data.message
              : 'Failed to create sub-team'
          );
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

  const handleDeleteTeam = async () => {
    await deleteTeamMutation.mutateAsync(id, {
      onError: (error) => {
        toast.error(
          error instanceof AxiosError && error.response?.data?.message
            ? error.response.data.message
            : 'Failed to delete team'
        );
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

      <TeamDetailsDialogs
        isEditTeamOpen={isEditTeamOpen}
        onCloseEditTeam={closeModal}
        editingTeam={editingTeam}
        teamData={teamData}
        onUpdateTeamName={handleUpdateTeamName}
        isUpdating={updateTeamMutation.isPending}
        isAddSubTeamOpen={isAddSubTeamOpen}
        onCloseAddSubTeam={closeModal}
        onAddSubTeam={handleAddSubTeam}
        isCreating={createTeamMutation.isPending}
        SubTeamDeleteModal={DeleteConfirmationModal}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        teamName={teamData?.name}
        isDeleting={deleteTeamMutation.isPending}
        onCloseDeleteConfirm={() =>
          !deleteTeamMutation.isPending && setIsDeleteConfirmOpen(false)
        }
        onConfirmDeleteTeam={async () => {
          if (deleteTeamMutation.isPending) return;
          await handleDeleteTeam();
          setIsDeleteConfirmOpen(false);
        }}
      />
    </>
  );
};

export { TeamDetails };
