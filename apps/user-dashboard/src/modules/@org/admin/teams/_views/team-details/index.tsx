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
import { AddNewEmployees } from '../../_components/forms/add-new-employees';
import { RolesAndPermission } from '../../_components/forms/add-new-roles';
import { ReusableDialog } from '@workspace/ui/lib/dialog';
import { useEmployeeService } from '@/modules/@org/admin/employee/services/use-service';

// ── TeamDetails (orchestrator) ────────────────────────────────────────────────
const TeamDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { useGetTeamsById, useDeleteTeam, useGetRoles, useCreateRole } =
    useTeamService();
  const { useUpdateTeam, useCreateTeam } = useOnboardingService();
  const { useGetAllEmployees, useUpdateEmployee } = useEmployeeService();
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

  // ── Sub-team role / employee inline dialogs ─────────────────────────────────
  const [selectedSubTeam, setSelectedSubTeam] = useState<Team | null>(null);
  const [isSubTeamRoleOpen, setIsSubTeamRoleOpen] = useState(false);
  const [isSubTeamEmployeeOpen, setIsSubTeamEmployeeOpen] = useState(false);
  const [isSubTeamSubmitting, setIsSubTeamSubmitting] = useState(false);

  const { DeleteConfirmationModal } = useSubTeamRowActions((team) => {
    setEditingTeam(team);
    openEditTeam();
  }, id);

  const updateTeamMutation = useUpdateTeam();
  const createTeamMutation = useCreateTeam();
  const deleteTeamMutation = useDeleteTeam();
  const createRoleMutation = useCreateRole();
  const { mutateAsync: updateEmployee, isPending: isAssigningEmployee } =
    useUpdateEmployee();

  // Roles for selected sub-team (fetched when employee dialog opens)
  const { data: subTeamRolesData } = useGetRoles(selectedSubTeam?.id || '', {
    enabled: !!selectedSubTeam?.id && isSubTeamEmployeeOpen,
  });

  // All employees for the sub-team employee assignment dialog
  const { data: allEmployeesData } = useGetAllEmployees(
    { page: 1 },
    {
      enabled: isSubTeamEmployeeOpen,
    }
  );

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

  // ── Sub-team role management ─────────────────────────────────────────────────
  const handleAddSubTeamRole = (team: Team) => {
    setSelectedSubTeam(team);
    queryClient.invalidateQueries({ queryKey: ['roles', team.id] });
    setIsSubTeamRoleOpen(true);
  };

  const handleCreateSubTeamRole = async (teamId: string, data: Role) => {
    setIsSubTeamSubmitting(true);
    try {
      await createRoleMutation.mutateAsync(
        { name: data.name, teamId, permissions: data.permissions || [] },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.team.list() });
            queryClient.invalidateQueries({ queryKey: ['roles', teamId] });
            toast.success(`Role "${data.name}" created successfully!`);
            setIsSubTeamRoleOpen(false);
          },
          onError: (error) => {
            toast.error(
              error instanceof AxiosError
                ? error.response?.data.message
                : 'Failed to create role'
            );
          },
        }
      );
    } finally {
      setIsSubTeamSubmitting(false);
    }
  };

  // ── Sub-team employee management ─────────────────────────────────────────────
  const handleAddSubTeamMembers = (team: Team) => {
    setSelectedSubTeam(team);
    queryClient.invalidateQueries({ queryKey: ['roles', team.id] });
    setIsSubTeamEmployeeOpen(true);
  };

  // ── PATCH /employees/:id — same endpoint as team list ───────────────────────
  const handleAssignSubTeamEmployee = async (data: {
    employeeId: string;
    roleId: string;
    customPermissions?: string[];
  }) => {
    if (!selectedSubTeam?.id) {
      toast.error('No sub-team selected. Please try again.');
      throw new Error('No sub-team selected');
    }
    const formData = new FormData();
    formData.append('teamId', selectedSubTeam.id);
    formData.append('roleId', data.roleId);
    if (data.customPermissions) {
      data.customPermissions.forEach((perm, i) => {
        formData.append(`permissions[${i}]`, perm);
      });
    }
    try {
      await updateEmployee({ id: data.employeeId, data: formData });
      await queryClient.invalidateQueries({ queryKey: ['employee', 'list'] });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.team.details(selectedSubTeam.id),
      });
      toast.success('Employee assigned successfully!');
    } catch (error) {
      toast.error(
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to assign employee'
      );
      throw error;
    }
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
          onAddSubTeamRole={handleAddSubTeamRole}
          onAddSubTeamMembers={handleAddSubTeamMembers}
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

      {/* Add Role to Sub-team */}
      <ReusableDialog
        open={isSubTeamRoleOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsSubTeamRoleOpen(false);
            setSelectedSubTeam(null);
          }
        }}
        title="Add Role"
        description={`Create a new role for "${selectedSubTeam?.name}"`}
        trigger={<span />}
        className="min-w-2xl"
      >
        {selectedSubTeam && (
          <RolesAndPermission
            onSubmit={async (data) => {
              await handleCreateSubTeamRole(selectedSubTeam.id, data);
            }}
            onCancel={(e) => {
              e?.preventDefault?.();
              setIsSubTeamRoleOpen(false);
              setSelectedSubTeam(null);
            }}
            onComplete={() => {
              setIsSubTeamRoleOpen(false);
              setSelectedSubTeam(null);
            }}
            isSubmitting={isSubTeamSubmitting}
          />
        )}
      </ReusableDialog>

      {/* Add Employees to Sub-team */}
      <ReusableDialog
        open={isSubTeamEmployeeOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsSubTeamEmployeeOpen(false);
            setSelectedSubTeam(null);
          }
        }}
        title="Add Members"
        description={`Assign employees to "${selectedSubTeam?.name}"`}
        trigger={<span />}
        className="lg:min-w-2xl"
      >
        {selectedSubTeam && (
          <AddNewEmployees
            onSubmit={handleAssignSubTeamEmployee}
            onCancel={(e) => {
              e?.preventDefault?.();
              setIsSubTeamEmployeeOpen(false);
              setSelectedSubTeam(null);
            }}
            isSubmitting={isAssigningEmployee}
            availableRoles={
              subTeamRolesData?.map((role) => ({
                id: role.id,
                name: role.name,
                description: `Role with ${role.permissions?.length || 0} permissions`,
              })) || []
            }
            availableEmployees={
              allEmployeesData?.data?.items?.map((emp: Employee) => ({
                id: emp.id,
                name: `${emp.firstName} ${emp.lastName}`,
                email: emp.email,
              })) || []
            }
          />
        )}
      </ReusableDialog>
    </>
  );
};

export { TeamDetails };
