'use client';

import { Skeleton } from '@workspace/ui/components/skeleton';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useTour } from '@workspace/ui/context/tour-context';
import { useOnboardingService } from '../../services/use-onboarding-service';
import { RolesAndPermission } from '../forms/roles&permission';
import type {
  OnboardingSchemaRole as Role,
  OnboardingSchemaTeam as Team,
} from '../../types';
import { TeamForm } from '../forms/team/team-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { ReusableDialog } from '@workspace/ui/lib/dialog';
import { useOnboardingModalParams } from '@/lib/nuqs/use-onboarding-modal-params';

export const TeamConfig = () => {
  // Modal URL state (nuqs) — team and role dialogs survive refresh
  const {
    modalId,
    modalMode,
    teamId: modalTeamId,
    isTeamModalOpen,
    isRoleModalOpen,
    openTeamModal,
    openRoleModal,
    closeModal,
  } = useOnboardingModalParams();

  // Local entity state — non-URL-serializable; populated from fetched list or user action
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
  const { stopTour } = useTour();

  const {
    useGetTeamsWithRoles,
    useDeleteTeam,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
    useCreateTeam,
    useUpdateTeam,
  } = useOnboardingService();

  const { data: teams, isLoading: isLoadingTeams } = useGetTeamsWithRoles();

  const { mutateAsync: deleteTeam, isPending: isDeletingTeam } =
    useDeleteTeam();
  const { mutateAsync: createRole, isPending: isCreatingRole } =
    useCreateRole();
  const { mutateAsync: updateRole, isPending: isUpdatingRole } =
    useUpdateRole();
  const { mutateAsync: deleteRole, isPending: isDeletingRole } =
    useDeleteRole();
  const { mutateAsync: createTeam, isPending: isCreatingTeam } =
    useCreateTeam();
  const { mutateAsync: updateTeam, isPending: isUpdatingTeam } =
    useUpdateTeam();

  // On cold-refresh: recover currentTeam / currentRole from fetched teams list using URL params
  useEffect(() => {
    if (!teams || teams.length === 0) return;

    if (isTeamModalOpen && modalId && !currentTeam) {
      const found = teams.find((t: Team) => t.id === modalId) ?? null;
      if (found) setCurrentTeam(found);
    }

    if (isRoleModalOpen && modalTeamId && !currentTeam) {
      const foundTeam = teams.find((t: Team) => t.id === modalTeamId) ?? null;
      if (foundTeam) setCurrentTeam(foundTeam);

      if (modalId && foundTeam) {
        const foundRole =
          (foundTeam.roles ?? []).find((r: Role) => r.id === modalId) ?? null;
        if (foundRole) setCurrentRole(foundRole);
      }
    }
  }, [
    teams,
    isTeamModalOpen,
    isRoleModalOpen,
    modalId,
    modalTeamId,
    currentTeam,
  ]);

  const handleOpenTeamDialog = (team?: Team) => {
    stopTour();
    setCurrentTeam(team ?? null);
    setCurrentRole(null);
    if (team) {
      openTeamModal({ id: team.id, mode: 'edit' });
    } else {
      openTeamModal({ mode: 'create' });
    }
  };

  const handleOpenRoleDialog = (team: Team, role?: Role) => {
    stopTour();
    setCurrentTeam(team);
    setCurrentRole(role ?? null);
    openRoleModal(team.id!, role ? { id: role.id, mode: 'edit' } : undefined);
  };

  const handleAddTeam = async (name: string) => {
    await createTeam(
      { name },
      {
        onSuccess: () => {
          toast.success('Team created successfully');
          closeModal();
          setCurrentTeam(null);
        },
        onError: (error) => {
          const message =
            error instanceof AxiosError
              ? error.response?.data.message
              : 'An unexpected error occurred';
          toast.error('Failed to create team', { description: message });
        },
      }
    );
  };

  const handleUpdateTeam = async (teamId: string, name: string) => {
    await updateTeam(
      { teamId, name },
      {
        onSuccess: () => {
          toast.success('Team updated successfully');
          closeModal();
          setCurrentTeam(null);
        },
        onError: (error) => {
          const message =
            error instanceof AxiosError
              ? error.response?.data.message
              : 'An unexpected error occurred';
          toast.error('Failed to update team', { description: message });
        },
      }
    );
  };

  const handleDeleteTeam = async (teamId: string) => {
    setDeletingTeamId(teamId);
    await deleteTeam(teamId, {
      onSuccess: () => {
        toast.success('Team deleted successfully');
      },
      onError: (error) => {
        const message =
          error instanceof AxiosError
            ? error.response?.data.message
            : 'An unexpected error occurred';
        toast.error('Failed to delete team', { description: message });
      },
      onSettled: () => setDeletingTeamId(null),
    });
  };

  const handleAddRole = async (teamId: string, role: Omit<Role, 'id'>) => {
    await createRole(
      {
        name: role.name!,
        teamId,
        permissions: role.permissions,
      },
      {
        onSuccess: () => {
          toast.success('Role created successfully');
          closeModal();
          setCurrentRole(null);
        },
        onError: (error) => {
          const message =
            error instanceof AxiosError
              ? error.response?.data.message
              : 'An unexpected error occurred';
          toast.error('Failed to create role', { description: message });
        },
      }
    );
  };

  const handleUpdateRole = async (
    roleId: string,
    role: Partial<Role> & { teamId?: string }
  ) => {
    const resolvedTeamId = role.teamId ?? currentTeam?.id;
    if (!resolvedTeamId) {
      toast.error('Failed to update role', {
        description: 'Missing team context for role update',
      });
      return;
    }
    const updateData: {
      roleId: string;
      name?: string;
      permissions?: string[];
      teamId: string;
    } = { roleId, teamId: resolvedTeamId };
    if (role.name !== undefined) updateData.name = role.name;
    if (role.permissions !== undefined)
      updateData.permissions = role.permissions;

    await updateRole(updateData, {
      onSuccess: () => {
        toast.success('Role updated successfully');
        closeModal();
        setCurrentRole(null);
      },
      onError: (error) => {
        const message =
          error instanceof AxiosError
            ? error.response?.data.message
            : 'An unexpected error occurred';
        toast.error('Failed to update role', { description: message });
        closeModal();
      },
    });
  };

  const handleDeleteRole = async (_teamId: string, roleId: string) => {
    setDeletingRoleId(roleId);
    await deleteRole(roleId, {
      onSuccess: (response) => {
        if (response.success) toast.success('Role deleted successfully');
      },
      onError: (error) => {
        const message =
          error instanceof AxiosError
            ? error.response?.data.message
            : error.message;
        toast.error('Failed to delete role', { description: message });
      },
      onSettled: () => setDeletingRoleId(null),
    });
  };

  if (isLoadingTeams) {
    return (
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-37.5" />
          </div>
          <div className="flex space-x-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Accordion
        type="multiple"
        className="w-full space-y-4"
        defaultValue={teams?.map((team) => team.id!)}
      >
        {teams?.map((team) => (
          <AccordionItem key={team.id} value={team.id!}>
            <AccordionTrigger className="flex-row-reverse border p-4 text-left text-sm md:text-[16px]">
              <div className="flex w-full items-center justify-between">
                <p>{team.name}</p>
                <div className="flex items-center gap-1 space-x-2 text-sm">
                  <span
                    className="flex cursor-pointer items-center gap-1 text-gray-600 hover:text-gray-900"
                    onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
                      event.stopPropagation();
                      handleOpenTeamDialog(team);
                    }}
                  >
                    <Icon
                      variant={`Outline`}
                      name="Edit"
                      size={16}
                      className="mr-2"
                    />
                    Edit
                  </span>
                  <span
                    className="text-destructive hover:text-destructive flex cursor-pointer items-center gap-1"
                    onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
                      if (isDeletingTeam) return;
                      event.stopPropagation();
                      handleDeleteTeam(team.id!);
                    }}
                  >
                    {isDeletingTeam && deletingTeamId === team.id ? (
                      <Icon
                        variant={`Outline`}
                        name="Loader2"
                        size={16}
                        className="mr-2 animate-spin"
                      />
                    ) : (
                      <Icon
                        variant={`Outline`}
                        name="Trash"
                        size={16}
                        className="mr-2 text-danger"
                      />
                    )}
                    {isDeletingTeam && deletingTeamId === team.id
                      ? 'Deleting...'
                      : 'Delete'}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="mt-0.5 space-y-4 rounded-md border border-t p-4 font-medium">
              {team?.roles?.length > 0 ? (
                team.roles.map((role: Role) => (
                  <div
                    key={role.id}
                    className="flex w-full items-center justify-between"
                  >
                    <p>{role.name}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span
                        className="flex cursor-pointer items-center text-gray-600 hover:text-gray-900"
                        onClick={() => handleOpenRoleDialog(team, role)}
                      >
                        <Icon
                          variant={`Outline`}
                          name="Edit"
                          size={16}
                          className="mr-2"
                        />
                      </span>
                      <span
                        className="text-destructive hover:text-destructive flex cursor-pointer items-center"
                        onClick={() => {
                          if (isDeletingRole) return;
                          handleDeleteRole(team.id!, role.id!);
                        }}
                      >
                        {isDeletingRole && deletingRoleId === role.id ? (
                          <Icon
                            variant={`Outline`}
                            name="Loader2"
                            size={16}
                            className="mr-2 animate-spin"
                          />
                        ) : (
                          <Icon
                            variant={`Outline`}
                            name="Trash"
                            size={16}
                            className="mr-2 text-danger"
                          />
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No roles added yet</p>
              )}
              <div className="mt-4">
                <span
                  data-tour="add-role-button"
                  className="text-primary flex cursor-pointer items-center gap-1 font-medium"
                  onClick={() => handleOpenRoleDialog(team)}
                >
                  <Icon variant={`Outline`} name="Add" size={16} />
                  Add New Role
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-4 w-fit" data-tour="add-team-button">
        <MainButton
          type="button"
          variant="default"
          className="text-primary h-fit rounded-none p-0"
          icon={
            <Icon variant={`Outline`} name="Add" size={16} className="mr-2" />
          }
          isLeftIconVisible
          onClick={() => handleOpenTeamDialog()}
        >
          Add New Team
        </MainButton>
      </div>

      {/* Team Create/Edit Dialog — persists across refresh */}
      <ReusableDialog
        open={isTeamModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
            setCurrentTeam(null);
          }
        }}
        title={modalMode === 'edit' ? 'Edit Team' : 'Add New Team'}
        wrapperClassName={`text-left`}
        description={
          modalMode === 'edit'
            ? 'Modify the team details'
            : 'Create a new team for your organization'
        }
        trigger={undefined}
      >
        <TeamForm
          initialData={currentTeam ?? undefined}
          onSubmit={(data) =>
            currentTeam
              ? handleUpdateTeam(currentTeam.id!, data.name)
              : handleAddTeam(data.name)
          }
          onCancel={() => {
            closeModal();
            setCurrentTeam(null);
          }}
          isSubmitting={isCreatingTeam || isUpdatingTeam}
        />
      </ReusableDialog>

      {/* Role Create/Edit Dialog — persists across refresh */}
      <ReusableDialog
        open={isRoleModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
            setCurrentRole(null);
          }
        }}
        title={currentRole ? 'Edit Role' : 'Add New Role'}
        wrapperClassName={`text-left`}
        description={
          currentRole
            ? 'Modify the role details'
            : 'Create a new role for this team'
        }
        trigger={undefined}
      >
        {currentTeam && (
          <RolesAndPermission
            initialData={currentRole ?? undefined}
            onSubmit={(data) => {
              return currentRole
                ? handleUpdateRole(currentRole.id!, {
                    ...data,
                    teamId: currentTeam.id!,
                  })
                : handleAddRole(currentTeam.id!, data);
            }}
            onCancel={() => {
              closeModal();
              setCurrentRole(null);
            }}
            isSubmitting={isCreatingRole || isUpdatingRole}
          />
        )}
      </ReusableDialog>
    </>
  );
};
