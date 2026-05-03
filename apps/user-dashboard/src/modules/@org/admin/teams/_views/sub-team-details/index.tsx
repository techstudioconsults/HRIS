'use client';

import { queryKeys } from '@/lib/react-query/query-keys';
import { useOnboardingService } from '@/modules/@org/onboarding/services/use-onboarding-service';
import { useSubTeamModalParams } from '@/lib/nuqs/use-sub-team-modal-params';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useTeamService } from '../../services/use-service';
import { useSubTeamRowActions } from '@/modules/@org/admin/teams/_views/table-data';
import { SubTeamDetailsHeader } from './components/sub-team-details-header';
import { SubTeamDetailsContent } from './components/sub-team-details-content';
import { TeamForm } from '@/modules/@org/onboarding/_components/forms/team/team-form';
import { AddNewEmployees } from '../../_components/forms/add-new-employees';
import { RolesAndPermission } from '../../_components/forms/add-new-roles';
import { ReusableDialog } from '@workspace/ui/lib/dialog';
import { AlertModal } from '@workspace/ui/lib/dialog';
import { useEmployeeService } from '@/modules/@org/admin/employee/services/use-service';
import type { OnboardingSchemaTeam as TeamFormType } from '@/modules/@org/onboarding/types';

interface SubTeamDetailsProps {
  params: { id: string };
}

const SubTeamDetails = ({ params }: SubTeamDetailsProps) => {
  const { id } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    isEmployeeOpen,
    openEmployeeDialog,
    closeModal,
    isRoleOpen,
    openRoleDialog,
  } = useSubTeamModalParams();

  const {
    useGetTeamsById,
    useDeleteTeam,
    useGetRoles,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
  } = useTeamService();
  const { useUpdateTeam } = useOnboardingService();
  const { useGetAllEmployees, useUpdateEmployee } = useEmployeeService();

  const { data: teamData } = useGetTeamsById(id, { enabled: !!id });
  const { data: rolesData } = useGetRoles(id, { enabled: !!id });
  const { data: allEmployeesData } = useGetAllEmployees(
    { page: 1 },
    { enabled: isEmployeeOpen }
  );

  // ── Mutations (hoisted to top level — never call hooks inside callbacks) ────
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const { mutateAsync: deleteRole } = useDeleteRole();
  const { mutateAsync: updateEmployee, isPending: isAssigning } =
    useUpdateEmployee();

  // ── UI state (non-URL) ───────────────────────────────────────────────────────
  const [isEditSubTeamOpen, setIsEditSubTeamOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteRoleConfirmOpen, setIsDeleteRoleConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [editingSubTeam, setEditingSubTeam] = useState<Team | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Row actions hook (provides DeleteConfirmationModal component)
  const { DeleteConfirmationModal } = useSubTeamRowActions((team: Team) => {
    setEditingSubTeam(team);
    setIsEditSubTeamOpen(true);
  }, id);

  // ── Edit Sub-team Name ────────────────────────────────────────────────────────
  const closeEditModal = () => {
    setIsEditSubTeamOpen(false);
    setEditingSubTeam(null);
  };

  const handleUpdateSubTeamName = async (data: { name: string }) => {
    const targetId = editingSubTeam?.id || id;
    setIsSubmitting(true);
    try {
      await updateTeamMutation.mutateAsync(
        { teamId: targetId, name: data.name },
        {
          onError: (error) => {
            toast.error(
              error instanceof AxiosError && error.response?.data?.message
                ? error.response.data.message
                : 'Failed to update sub-team name'
            );
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.team.list() });
            queryClient.invalidateQueries({
              queryKey: queryKeys.team.details(targetId),
            });
            toast.success('Sub-team name updated successfully!');
            closeEditModal();
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Add Role ───────────────────────────────────────────────────────────────────
  const handleOpenRoleDialog = (role?: Role) => {
    setCurrentRole(role ?? null);
    openRoleDialog(id, { id: role?.id });
  };

  const handleAddRole = async (teamId: string, data: Role) => {
    setIsSubmitting(true);
    try {
      await createRoleMutation.mutateAsync(
        {
          name: data.name,
          teamId,
          permissions: data.permissions || [],
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.team.list() });
            queryClient.invalidateQueries({ queryKey: ['roles', teamId] });
            closeModal();
            toast.success(`Role "${data.name}" created successfully!`);
          },
          onError: (error) => {
            const msg =
              error instanceof AxiosError
                ? error.response?.data.message
                : 'Failed to create role';
            toast.error(msg);
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (roleId: string, data: Role) => {
    setIsSubmitting(true);
    try {
      await updateRoleMutation.mutateAsync({
        roleId,
        name: data.name,
        permissions: data.permissions,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.team.list() });
      await queryClient.invalidateQueries({ queryKey: ['roles', id] });
      toast.success(`Role "${data.name}" updated successfully!`);
      closeModal();
      setCurrentRole(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update role.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete Role ───────────────────────────────────────────────────────────────
  const handleDeleteRole = async (roleId: string) => {
    const roleName = currentRole?.name;
    setIsSubmitting(true);
    try {
      await deleteRole(roleId);
      await queryClient.invalidateQueries({ queryKey: queryKeys.team.list() });
      await queryClient.invalidateQueries({ queryKey: ['roles', id] });
      toast.success(
        `Role${roleName ? ` "${roleName}"` : ''} deleted successfully!`
      );
      closeModal();
      setCurrentRole(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete role.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete Sub-team ────────────────────────────────────────────────────────────
  const handleDeleteSubTeam = async () => {
    setIsSubmitting(true);
    try {
      const response = await deleteTeamMutation.mutateAsync(id, {
        onError: (error) => {
          toast.error(
            error instanceof AxiosError && error.response?.data?.message
              ? error.response.data.message
              : 'Failed to delete sub-team'
          );
        },
        onSuccess: (res) => {
          if (res?.success) {
            toast.success(`Sub-team "${teamData?.name}" deleted successfully!`);
            router.push('/admin/teams');
          }
        },
      });
      if (response?.success) {
        router.push('/admin/teams');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Employee Assignment — PATCH /employees/:id ─────────────────────────────
  const handleAssignEmployee = async (data: {
    employeeId: string;
    roleId: string;
    customPermissions?: string[];
  }) => {
    const formData = new FormData();
    formData.append('teamId', id);
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
        queryKey: queryKeys.team.details(id),
      });
      toast.success('Employee assigned successfully!');
      closeModal();
    } catch (error) {
      toast.error(
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to assign employee'
      );
      throw error;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <section className="space-y-8">
        <SubTeamDetailsHeader
          teamId={id}
          onAddEmployee={() => openEmployeeDialog(id)}
          onAddRole={() => handleOpenRoleDialog()}
          onEditSubTeam={() => {
            setEditingSubTeam(teamData ?? null);
            setIsEditSubTeamOpen(true);
          }}
          onDeleteSubTeam={() => setIsDeleteConfirmOpen(true)}
        />

        <SubTeamDetailsContent
          teamId={id}
          onAddEmployee={() => openEmployeeDialog(id)}
          onAddRole={() => handleOpenRoleDialog()}
          onEditRole={(role) => {
            setCurrentRole(role);
            handleOpenRoleDialog(role);
          }}
          onDeleteRole={(role) => {
            setRoleToDelete(role);
            setIsDeleteRoleConfirmOpen(true);
          }}
        />
      </section>

      {/* ── DIALOGS ──────────────────────────────────────────────────────────────── */}

      {/* Edit Sub-team Name */}
      <ReusableDialog
        open={isEditSubTeamOpen}
        onOpenChange={(open) => {
          if (!open) closeEditModal();
        }}
        title="Edit Sub-team Name"
        description="Update the name of this sub-team"
        trigger={<span />}
        className="min-w-2xl"
      >
        <TeamForm
          initialData={
            editingSubTeam
              ? ({
                  id: editingSubTeam.id,
                  name: editingSubTeam.name,
                  roles: [],
                } as TeamFormType)
              : undefined
          }
          onSubmit={handleUpdateSubTeamName}
          onCancel={closeEditModal}
          isSubmitting={isSubmitting}
        />
      </ReusableDialog>

      {/* Add / Edit Role Modal */}
      <ReusableDialog
        open={isRoleOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
            setCurrentRole(null);
          }
        }}
        title={currentRole ? 'Edit Role' : 'Create Role'}
        description={
          currentRole
            ? 'Modify the role details'
            : 'Create a new role for this sub-team'
        }
        trigger={<span />}
        className="min-w-2xl"
      >
        <RolesAndPermission
          initialData={currentRole ?? undefined}
          onSubmit={async (roleData) => {
            if (currentRole) {
              await handleUpdateRole(currentRole.id, roleData);
            } else {
              await handleAddRole(id, roleData);
            }
          }}
          onDelete={currentRole ? handleDeleteRole : undefined}
          onCancel={(e) => {
            e?.preventDefault?.();
            closeModal();
            setCurrentRole(null);
          }}
          onComplete={() => {
            closeModal();
            setCurrentRole(null);
          }}
          isSubmitting={isSubmitting}
          isEdit={!!currentRole}
        />
      </ReusableDialog>

      {/* Add Employee Modal */}
      <ReusableDialog
        open={isEmployeeOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title="Add Employees"
        description="Assign employees to this sub-team and set their roles"
        trigger={<span />}
        className="lg:min-w-2xl"
      >
        <AddNewEmployees
          onSubmit={handleAssignEmployee}
          onCancel={(e) => {
            e?.preventDefault?.();
            closeModal();
          }}
          isSubmitting={isAssigning}
          availableRoles={
            rolesData?.map((r) => ({
              id: r.id,
              name: r.name,
              description: `Role with ${r.permissions?.length || 0} permissions`,
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
      </ReusableDialog>

      {/* Delete Sub-team Confirmation */}
      <AlertModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          if (!isSubmitting) setIsDeleteConfirmOpen(false);
        }}
        onConfirm={async () => {
          await handleDeleteSubTeam();
          setIsDeleteConfirmOpen(false);
        }}
        loading={isSubmitting}
        type="warning"
        title="Delete Sub-team"
        description={`Are you sure you want to delete "${teamData?.name}"? This action cannot be undone.`}
        confirmText={isSubmitting ? 'Deleting...' : 'Delete Sub-team'}
        cancelText="Cancel"
      />

      {/* Delete Role Confirmation */}
      <AlertModal
        isOpen={isDeleteRoleConfirmOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsDeleteRoleConfirmOpen(false);
            setRoleToDelete(null);
          }
        }}
        onConfirm={async () => {
          if (!roleToDelete?.id) return;
          await handleDeleteRole(roleToDelete.id);
          setIsDeleteRoleConfirmOpen(false);
          setRoleToDelete(null);
        }}
        loading={isSubmitting}
        type="warning"
        title="Delete Role"
        description={`Are you sure you want to delete "${roleToDelete?.name}"? This action cannot be undone.`}
        confirmText={isSubmitting ? 'Deleting...' : 'Delete Role'}
        cancelText="Cancel"
      />

      {/* Sub-team row action delete modal */}
      <DeleteConfirmationModal />
    </>
  );
};

export { SubTeamDetails };
