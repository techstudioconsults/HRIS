import { useActiveTarget } from '@/context/active-target';
import { formatDate } from '@/lib/formatters';
import { queryKeys } from '@/lib/react-query/query-keys';

import { useQueryClient } from '@tanstack/react-query';
import type { IColumnDefinition, IRowAction } from '@workspace/ui/lib/table';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useTeamShortcuts } from '../hooks/use-team-shortcuts';
import { useTeamService } from '../services/use-service';
import { Badge } from '@workspace/ui/components/badge';
import { AlertModal } from '@workspace/ui/lib/dialog';

export const teamColumn: IColumnDefinition<Team>[] = [
  {
    header: 'Team Name',
    accessorKey: 'name',
    render: (_value: unknown, team: Team) => (
      <span className="text-sm font-medium">{team.name}</span>
    ),
  },
  {
    header: 'Team Lead',
    accessorKey: 'manager',
    render: (_value: unknown, team: Team) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {team.manager?.name || 'Not assigned'}
      </span>
    ),
  },
  {
    header: 'Team Members',
    accessorKey: 'members',
    render: (_value: unknown, team: Team) => (
      <span className="text-primary text-sm font-medium">
        {team.members || 0} members
      </span>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    render: (_value: unknown, team: Team) => {
      const status = team.status || 'active';
      return (
        <Badge
          variant={status === 'active' ? 'success' : 'destructive'}
          className="min-w-fit"
        >
          {status as string}
        </Badge>
      );
    },
  },
  {
    header: 'Created on',
    accessorKey: 'createdAt',
    render: (_value: unknown, team: Team) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {formatDate(team.createdAt as string)}
      </span>
    ),
  },
];

// Consolidated hook for team row actions with better state management
const useTeamRowActionsBase = (
  teamType: 'team' | 'sub-team' = 'team',
  onAddEmployees?: (team: Team) => void,
  onEditTeam?: (team: Team) => void,
  onAddRole?: (team: Team) => void,
  parentId?: string
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { useDeleteTeam } = useTeamService();
  const { mutateAsync: deleteTeam, isPending } = useDeleteTeam();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const { entity: activeTeam, set: setActiveTeam } = useActiveTarget<Team>();

  // Bind global shortcuts for teams
  useTeamShortcuts();

  const handleDeleteTeam = useCallback(async () => {
    if (!teamToDelete) return;

    try {
      const response = await deleteTeam(teamToDelete.id);
      if (response?.success) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.team.list(),
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.team.details(parentId!),
        });
        toast.success(
          `${teamType === 'sub-team' ? 'Sub-team' : 'Team'} "${teamToDelete.name}" deleted successfully!`
        );
        setIsDeleteModalOpen(false);
        setTeamToDelete(null);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to delete ${teamType}. Please try again.`;
      toast.error(errorMessage);
    }
  }, [teamToDelete, deleteTeam, queryClient, parentId, teamType]);

  const getRowActions = useCallback(
    (team: Team) => {
      const viewPath =
        teamType === 'sub-team'
          ? `/admin/teams/sub-team/${team.id}`
          : `/admin/teams/${team.id}`;

      const baseActions: IRowAction<Team>[] = [
        {
          label: 'View team',
          // kbd: "Ctrl+V",
          icon: (
            <Icon
              variant={'Outline'}
              name={`Eye`}
              size={4}
              aria-hidden="true"
            />
          ),
          onClick: async () => {
            setActiveTeam(team);
            router.push(viewPath);
          },
        },
        {
          label: 'Edit team',
          // kbd: "Ctrl+E",
          icon: (
            <Icon
              variant={'Outline'}
              name={`Edit`}
              size={4}
              aria-hidden="true"
            />
          ),
          onClick: () => {
            setActiveTeam(team);
            if (onEditTeam) {
              onEditTeam(team);
            } else {
              // router.push(editPath);
            }
          },
        },
        ...(onAddRole ? [{ type: 'separator' } as IRowAction<Team>] : []),
        ...(onAddRole
          ? [
              {
                label: 'Add Role',
                onClick: () => {
                  setActiveTeam(team);
                  onAddRole(team);
                },
              } as IRowAction<Team>,
            ]
          : []),
        ...(onAddEmployees
          ? [
              {
                label:
                  teamType === 'sub-team' ? 'Add Members' : 'Add Employees',
                onClick: () => {
                  setActiveTeam(team);
                  onAddEmployees(team);
                },
              } as IRowAction<Team>,
            ]
          : []),
        { type: 'separator' },
        {
          label: 'Delete team',
          // kbd: "Ctrl+Del",
          variant: 'destructive',
          icon: (
            <Icon
              variant={'Outline'}
              name={`Trash`}
              className={`text-destructive`}
              aria-hidden="true"
            />
          ),
          onClick: () => {
            setActiveTeam(team);
            setTeamToDelete(team);
            setIsDeleteModalOpen(true);
          },
        },
      ];

      return baseActions;
    },
    [teamType, onAddEmployees, onEditTeam, onAddRole, setActiveTeam, router]
  );

  // Listen to global delete requests dispatched by useTeamShortcuts
  useEffect(() => {
    const onDeleteRequest = () => {
      if (!activeTeam) return;
      setTeamToDelete(activeTeam);
      setIsDeleteModalOpen(true);
    };
    window.addEventListener('team:request-delete', onDeleteRequest);
    return () =>
      window.removeEventListener('team:request-delete', onDeleteRequest);
  }, [activeTeam]);

  const DeleteConfirmationModal = useCallback(
    () => (
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isPending) {
            setIsDeleteModalOpen(false);
            setTeamToDelete(null);
          }
        }}
        onConfirm={handleDeleteTeam}
        loading={isPending}
        type="warning"
        title={`Delete ${teamType === 'sub-team' ? 'Sub-team' : 'Team'}`}
        description={`Are you sure you want to delete "${teamToDelete?.name}"? This action cannot be undone.`}
        confirmText={`Delete ${teamType === 'sub-team' ? 'Sub-team' : 'Team'}`}
        cancelText="Cancel"
      />
    ),
    [
      isDeleteModalOpen,
      isPending,
      handleDeleteTeam,
      teamType,
      teamToDelete?.name,
    ]
  );

  return { getRowActions, DeleteConfirmationModal, setActiveTeam };
};

export const useTeamRowActions = (
  onAddEmployees?: (team: Team) => void,
  onEditTeam?: (team: Team) => void,
  onAddRole?: (team: Team) => void
) => {
  return useTeamRowActionsBase('team', onAddEmployees, onEditTeam, onAddRole);
};

export const subTeamColumn: IColumnDefinition<Team>[] = [
  {
    header: 'Sub-team Name',
    accessorKey: 'name',
    render: (_value: unknown, team: Team) => (
      <span className="text-sm">{team.name}</span>
    ),
  },
  {
    header: 'Team Lead',
    accessorKey: 'manager',
    render: (_value: unknown, team: Team) => (
      <span className="text-sm">{team.manager?.name || 'N/A'}</span>
    ),
  },
  {
    header: 'Team Members',
    accessorKey: 'members',
    render: (_value: unknown, team: Team) => (
      <Badge variant={`primary`}>{team.members ?? '—'}</Badge>
    ),
  },
  {
    header: 'Created on',
    accessorKey: 'createdAt',
    render: (_value: unknown, team: Team) => (
      <span className="text-sm">{formatDate(team.createdAt as string)}</span>
    ),
  },
];

export const useSubTeamRowActions = (
  onEditTeam?: (team: Team) => void,
  id?: string,
  onAddRole?: (team: Team) => void,
  onAddMembers?: (team: Team) => void
) => {
  return useTeamRowActionsBase(
    'sub-team',
    onAddMembers,
    onEditTeam,
    onAddRole,
    id
  );
};
