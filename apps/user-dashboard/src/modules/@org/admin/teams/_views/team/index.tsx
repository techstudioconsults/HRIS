/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTeamsSearchParameters } from "@/lib/nuqs/use-teams-search-parameters";
import { useTeamWorkflowStore } from "@/modules/@org/admin/teams/store/team-store";
import type { Role as FormRole, Team as TeamFormType } from "@/modules/@org/onboarding/_components/forms/schema";
import { TeamForm } from "@/modules/@org/onboarding/_components/forms/team/team-form";
import { useOnboardingService } from "@/modules/@org/onboarding/services/use-onboarding-service";
import { useQueryClient } from "@tanstack/react-query";
import { ReusableDialog } from "@workspace/ui/lib";
import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { AddNewEmployees } from "../../_components/forms/add-new-employees";
import { RolesAndPermission } from "../../_components/forms/add-new-roles";
import { useTeamEditing } from "../../_hooks/use-team-editing";
import { useEmployeeService } from "../../../employee/services/use-service";
import { useTeamService } from "../../services/use-service";
import { useTeamRowActions } from "../table-data";
import { TeamHeaderSection } from "./components/team-header-section";
import { TeamTableSection } from "./components/team-table-section";

export const AllTeams = () => {
  const {
    page,
    search,
    status,
    sortBy,
    limit,
    setPage,
    setSearch,
    setStatus,
    setSortBy,
    setLimit,
    resetFilters,
    resetToFirstPage,
    getApiFilters,
  } = useTeamsSearchParameters();

  // Local input state (debounced) to throttle URL updates via nuqs
  const [searchInput, setSearchInput] = useState(search || "");
  const [debouncedSearch] = useDebounce(searchInput, 300);

  const handleOpenEmployeeDialog = (team: Team) => {
    const formTeam: TeamFormType = {
      id: team.id,
      name: team.name,
      roles: [],
    };
    setCurrentTeam(formTeam);
    setCurrentRole(null);
    openEmployeeDialog(formTeam);

    // Force refetch roles for this team
    queryClient.invalidateQueries({ queryKey: ["roles", team.id] });
  };

  const handleOpenEditDialog = (team: Team) => {
    const formTeam: TeamFormType = {
      id: team.id,
      name: team.name,
      roles: [],
    };
    openEditDialog(formTeam);
  };

  const handleOpenRoleDialog = (team: Team) => {
    const formTeam: TeamFormType = {
      id: team.id,
      name: team.name,
      roles: [],
    };
    setCurrentTeam(formTeam);
    setCurrentRole(null);
    openRoleDialog(formTeam, null);

    // Force refetch roles for this team
    queryClient.invalidateQueries({ queryKey: ["roles", team.id] });
  };

  // Team editing hook
  const {
    isEditing,
    editingTeam,
    openEditDialog,
    closeEditDialog,
    handleUpdateTeam,
    isSubmitting: isEditSubmitting,
  } = useTeamEditing();

  const { getRowActions, DeleteConfirmationModal } = useTeamRowActions(
    handleOpenEmployeeDialog,
    handleOpenEditDialog,
    handleOpenRoleDialog,
  );
  const {
    dialog,
    currentTeam,
    currentRole,
    isSubmitting,
    workflowMode,
    skipToNextStep,
    openTeamDialog,
    openRoleDialog,
    openEmployeeDialog,
    closeDialog,
    setCurrentTeam,
    setCurrentRole,
    setSubmitting,
    setSkipToNextStep,
  } = useTeamWorkflowStore();

  const handleOpenTeamDialog = (team?: TeamFormType) => {
    openTeamDialog(team || null, team ? "edit" : "create");
  };

  const { useGetRoles, useCreateRole, useUpdateRole } = useTeamService();
  const { useGetAllEmployees, useUpdateEmployee } = useEmployeeService();
  const { mutateAsync: updateEmployee } = useUpdateEmployee();

  // Apply debounced search to URL (nuqs) and reset page to 1
  useEffect(() => {
    setSearch(debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : null);
    resetToFirstPage();
  }, [debouncedSearch, setSearch, resetToFirstPage]);

  // Build API filters from URL state (nuqs)
  const apiFilters = useMemo(() => getApiFilters(), [getApiFilters]);

  // Apply filter values to URL (nuqs) and reset page
  const handleFilterChange = useCallback(
    (newFilters: any) => {
      setStatus(newFilters.status ?? null);
      setSortBy(newFilters.sortBy ?? null);
      if (newFilters.limit != null) setLimit(Number(newFilters.limit));
      resetToFirstPage();
    },
    [setStatus, setSortBy, setLimit, resetToFirstPage],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage],
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchInput(query);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    resetFilters();
  }, [resetFilters]);

  // Fetch employees data
  const { data: employeesData } = useGetAllEmployees({ page: 1 });

  // Fetch roles for current team - only when employee dialog is open
  const { data: rolesData } = useGetRoles(currentTeam?.id || "", {
    enabled: !!currentTeam?.id && dialog === "employee",
  });

  const queryClient = useQueryClient();
  const { useCreateTeam } = useOnboardingService();

  const { mutateAsync: createTeam } = useCreateTeam();
  const { mutateAsync: createRoleMutation } = useCreateRole();
  const { mutateAsync: updateRoleMutation } = useUpdateRole();

  const handleAddTeam = async (name: string) => {
    try {
      setSubmitting(true);

      const newTeam = await createTeam(
        { name },
        {
          onSuccess: () => {
            toast.success(`Team "${name}" created successfully!`);
            queryClient.invalidateQueries({ queryKey: ["teams"] });
          },
          onError: (error) => {
            const message = error instanceof AxiosError ? error.response?.data.message : "An unexpected error occurred";
            toast.error("Failed to create team", { description: message });
          },
        },
      );
      const formTeam: TeamFormType = {
        id: (newTeam as Team)?.id,
        name: (newTeam as Team)?.name,
        roles: [],
      };

      // Close team dialog
      closeDialog();

      // Set current team for potential next steps
      setCurrentTeam(formTeam);

      // Ask user if they want to continue with role creation
      setSkipToNextStep(true);

      // Auto-open role dialog after brief delay for better UX
      setTimeout(() => {
        openRoleDialog(formTeam, null);
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create team. Please try again.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddRole = async (teamId: string, data: FormRole) => {
    try {
      setSubmitting(true);
      await createRoleMutation(
        {
          name: data.name,
          teamId,
          permissions: data.permissions || [],
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            queryClient.invalidateQueries({ queryKey: ["roles", teamId] });
            closeDialog();
          },
          onError: (error) => {
            const message = error instanceof AxiosError ? error.response?.data.message : "An unexpected error occurred";
            toast.error("Failed to create role", { description: message });
          },
        },
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create role. Please try again.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleCreationComplete = () => {
    // After roles are created, ask if user wants to assign employees
    if (currentTeam && skipToNextStep) {
      // Auto-open employee dialog after brief delay
      setTimeout(() => {
        openEmployeeDialog(currentTeam);
      }, 500);
    }
  };

  const handleUpdateRole = async (roleId: string, data: FormRole) => {
    try {
      setSubmitting(true);
      await updateRoleMutation({
        roleId,
        name: data.name,
        permissions: data.permissions,
      });
      await queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success(`Role "${data.name}" updated successfully!`);
      closeDialog();
      setCurrentRole(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update role. Please try again.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignEmployee = async (data: { employeeId: string; roleId: string; customPermissions?: string[] }) => {
    if (!currentTeam?.id) {
      toast.error("No team selected. Please try again.");
      throw new Error("No team selected");
    }

    try {
      // Find the full employee data from the available employees
      const selectedEmployee = employeesData?.data?.items?.find((emp: Employee) => emp.id === data.employeeId);

      if (!selectedEmployee) {
        toast.error("Employee not found. Please try again.");
        throw new Error("Employee not found");
      }

      // Build FormData with ONLY fields being reassigned/changed
      const formData = new FormData();
      formData.append("teamId", currentTeam.id);
      formData.append("roleId", data.roleId);
      if (data.customPermissions && data.customPermissions.length > 0) {
        let index = 0;
        for (const perm of data.customPermissions) {
          formData.append(`permissions[${index}]`, perm);
          index++;
        }
      }

      // Call updateEmployee mutation using expected signature { id, data }
      await updateEmployee({ id: selectedEmployee.id, data: formData });

      // Invalidate queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ["teams"] });
      await queryClient.invalidateQueries({ queryKey: ["employee", "list"] });

      toast.success("Employee assigned successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to assign employee. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <>
      <section className="space-y-4">
        <TeamHeaderSection
          search={search}
          status={status}
          sortBy={sortBy}
          limit={limit}
          page={page ?? 1}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onAddTeamClick={() => handleOpenTeamDialog()}
        />

        <TeamTableSection
          apiFilters={apiFilters}
          debouncedSearch={debouncedSearch}
          status={status}
          sortBy={sortBy}
          onPageChange={handlePageChange}
          onResetFilters={handleResetFilters}
          rowActions={getRowActions}
          onAddTeamClick={() => handleOpenTeamDialog()}
        />
      </section>

      <ReusableDialog
        open={dialog === "team"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
            setSkipToNextStep(false);
          }
        }}
        title={workflowMode === "edit" ? "Edit Team" : "Add New Team"}
        description={
          workflowMode === "edit"
            ? "Modify the team details"
            : "Create a new team for your organization. You can add roles and employees later."
        }
        trigger={<span />}
        className="min-w-2xl"
      >
        <TeamForm
          initialData={currentTeam}
          onSubmit={async (data) => {
            return workflowMode === "edit" ? handleUpdateTeam({ name: data.name }) : handleAddTeam(data.name);
          }}
          onCancel={() => {
            closeDialog();
            setSkipToNextStep(false);
          }}
          isSubmitting={isSubmitting}
        />
      </ReusableDialog>

      <ReusableDialog
        open={dialog === "role"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
            setSkipToNextStep(false);
          }
        }}
        title={currentRole ? "Edit Role" : "Create Roles"}
        description={
          currentRole
            ? "Modify the role details"
            : skipToNextStep
              ? `Add roles to "${currentTeam?.name}" to define permissions. You can skip this and add roles later.`
              : "Create new roles for this team"
        }
        className={`!max-w-2xl`}
        trigger={<span />}
      >
        {currentTeam && (
          <RolesAndPermission
            initialData={currentRole}
            onSubmit={async (data) => {
              return currentRole ? handleUpdateRole(currentRole.id!, data) : handleAddRole(currentTeam.id!, data);
            }}
            onCancel={(event) => {
              event?.preventDefault?.();
              if (skipToNextStep) {
                toast.info("Role creation skipped. You can add roles later from the team details page.");
              }
              closeDialog();
              setSkipToNextStep(false);
            }}
            onComplete={handleRoleCreationComplete}
            isSubmitting={isSubmitting}
          />
        )}
      </ReusableDialog>

      <ReusableDialog
        open={dialog === "employee"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
            setSkipToNextStep(false);
          }
        }}
        title="Add Employees"
        description={
          skipToNextStep
            ? `Assign employees to "${currentTeam?.name}". You can skip this and add employees later.`
            : "Assign employees to this team and customize their roles"
        }
        className={`!max-w-2xl`}
        trigger={<span />}
      >
        {currentTeam && (
          <AddNewEmployees
            onSubmit={handleAssignEmployee}
            onCancel={(event) => {
              event?.preventDefault?.();
              if (skipToNextStep) {
                toast.info("Employee assignment skipped. Your team has been created successfully!");
              }
              closeDialog();
              setSkipToNextStep(false);
            }}
            isSubmitting={isSubmitting}
            availableRoles={
              rolesData?.map((role: { id: any; name: any; permissions: string | any[] }) => ({
                id: role.id,
                name: role.name,
                description: `Role with ${role.permissions.length} permissions`,
              })) || []
            }
            availableEmployees={
              employeesData?.data?.items?.map((employee: Employee) => ({
                id: employee.id,
                name: `${employee.firstName} ${employee.lastName}`,
                email: employee.email,
              })) || []
            }
          />
        )}
      </ReusableDialog>

      <DeleteConfirmationModal />

      {/* Edit Team Dialog */}
      <ReusableDialog
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) closeEditDialog();
        }}
        title="Edit Team"
        description="Update team information and settings"
        className="min-w-2xl"
        trigger={<span />}
      >
        {editingTeam && (
          <TeamForm
            initialData={editingTeam}
            onSubmit={async (data) => {
              await handleUpdateTeam({ name: data.name });
            }}
            onCancel={() => {
              closeEditDialog();
            }}
            isSubmitting={isEditSubmitting}
          />
        )}
      </ReusableDialog>
    </>
  );
};
