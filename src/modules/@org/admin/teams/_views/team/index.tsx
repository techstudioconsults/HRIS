/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import MainButton from "@/components/shared/button";
import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState, FilteredEmptyState } from "@/components/shared/empty-state";
import ExportAction from "@/components/shared/export-action";
import { Button } from "@/components/ui/button";
import { useTeamsSearchParameters } from "@/lib/nuqs/use-teams-search-parameters";
import { AdvancedDataTable } from "@/modules/@org/admin/_components/table/table";
import type { Role as FormRole, Team as TeamFormType } from "@/modules/@org/onboarding/_components/forms/schema";
import { TeamForm } from "@/modules/@org/onboarding/_components/forms/team/team-form";
import type { Team as ServiceTeam } from "@/modules/@org/onboarding/services/service";
import { useOnboardingService } from "@/modules/@org/onboarding/services/use-onboarding-service";
import { useQueryClient } from "@tanstack/react-query";
import { Add, Filter } from "iconsax-reactjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import empty1 from "~/images/empty-state.svg";
import { AddNewEmployees } from "../../_components/forms/add-new-employees";
import { RolesAndPermission } from "../../_components/forms/add-new-roles";
import { FilterForm } from "../../_components/forms/filter-form";
import { useTeamEditing } from "../../_hooks/use-team-editing";
import { useEmployeeService } from "../../../employee/services/use-service";
import { useTeamService } from "../../services/use-service";
import { teamColumn, useTeamRowActions } from "../table-data";

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
    setDialogType("employee");
    setDialogOpen(true);

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

  // Team editing hook
  const {
    isEditing,
    editingTeam,
    openEditDialog,
    closeEditDialog,
    handleUpdateTeam,
    isSubmitting: isEditSubmitting,
  } = useTeamEditing();

  const { getRowActions, DeleteConfirmationModal } = useTeamRowActions(handleOpenEmployeeDialog, handleOpenEditDialog);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<TeamFormType | null>(null);
  const [currentRole, setCurrentRole] = useState<FormRole | null>(null);
  const [dialogType, setDialogType] = useState<"team" | "role" | "employee">("team");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenTeamDialog = (team?: TeamFormType) => {
    setCurrentTeam(team || null);
    setCurrentRole(null);
    setDialogType("team");
    setDialogOpen(true);
  };

  const { useGetAllTeams, useGetRoles, useCreateRole, useUpdateRole, useAssignEmployeeToTeam, useDownloadTeams } =
    useTeamService();
  const { useGetAllEmployees } = useEmployeeService();
  const { refetch: downloadTeams } = useDownloadTeams();

  // Apply debounced search to URL (nuqs) and reset page to 1
  useEffect(() => {
    setSearch(debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : null);
    resetToFirstPage();
  }, [debouncedSearch, setSearch, resetToFirstPage]);

  // Build API filters from URL state (nuqs)
  const apiFilters = useMemo(() => getApiFilters(), [getApiFilters]);

  const {
    data: teamData,
    isLoading,
    refetch,
  } = useGetAllTeams(apiFilters, {
    keepPreviousData: false, // Don't keep previous data to ensure fresh results
    staleTime: 0, // Always consider data stale to ensure fresh API calls
    cacheTime: 0, // Don't cache data to prevent stale data issues
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnReconnect: true, // Refetch when network reconnects
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
  });

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

  useEffect(() => {
    refetch();
  }, [refetch]);

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
    enabled: !!currentTeam?.id && dialogType === "employee",
  });

  const queryClient = useQueryClient();
  const { useCreateTeam } = useOnboardingService();

  const createTeamMutation = useCreateTeam();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const assignEmployeeMutation = useAssignEmployeeToTeam();

  const handleAddTeam = async (name: string) => {
    try {
      setIsSubmitting(true);
      const newTeam = await createTeamMutation.mutateAsync(name);
      // Close team dialog and guide user to create a role for the new team
      setDialogOpen(false);
      const formTeam: TeamFormType = {
        id: (newTeam as ServiceTeam)?.id,
        name: (newTeam as ServiceTeam)?.name,
        roles: [],
      };
      setCurrentTeam(formTeam);
      await queryClient.invalidateQueries({ queryKey: ["teams"] });
      // Continue workflow to Role creation
      setDialogType("role");
      setCurrentRole(null);
      setDialogOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRole = async (teamId: string, data: FormRole) => {
    await createRoleMutation.mutateAsync({
      name: data.name,
      teamId,
      permissions: data.permissions || [],
    });
    // Don't close dialog here - let the form handle completion
    await queryClient.invalidateQueries({ queryKey: ["teams"] });
  };

  const handleRoleCreationComplete = () => {
    // After roles are created, automatically open employee assignment dialog
    setDialogType("employee");
    setDialogOpen(true);
  };

  const handleUpdateRole = async (roleId: string, data: FormRole) => {
    try {
      setIsSubmitting(true);
      await updateRoleMutation.mutateAsync({
        roleId,
        name: data.name,
        permissions: data.permissions,
      });
      setDialogOpen(false);
      setCurrentRole(null);
      await queryClient.invalidateQueries({ queryKey: ["teams"] });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignEmployee = async (data: { employeeId: string; roleId: string; customPermissions?: string[] }) => {
    if (!currentTeam?.id) {
      throw new Error("No team selected");
    }

    try {
      await assignEmployeeMutation.mutateAsync({
        employeeId: data.employeeId,
        teamId: currentTeam.id,
        roleId: data.roleId,
        customPermissions: data.customPermissions,
      });

      // Invalidate queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ["teams"] });
      await queryClient.invalidateQueries({ queryKey: ["employee", "list"] });
    } catch {
      // Handle error silently or show toast notification
      throw new Error("Failed to assign employee");
    }
  };

  return (
    <>
      <section className="space-y-10">
        <section className="space-y-4">
          <DashboardHeader
            title="Teams"
            subtitle="All Teams"
            actionComponent={
              <div className="flex items-center gap-2">
                <SearchInput
                  className="border-border h-10 rounded-md border"
                  placeholder="Search teams..."
                  onSearch={handleSearchChange}
                />
                <GenericDropdown
                  contentClassName="bg-background"
                  trigger={
                    <Button
                      variant={"primaryOutline"}
                      className="data-[state=open]:border-border data-[state=open]:text-gray h-10 rounded-md border px-3 shadow-none"
                    >
                      <Filter className="size-4" />
                      Filter
                    </Button>
                  }
                >
                  <section className="min-w-sm">
                    <FilterForm
                      initialFilters={{
                        search: search || undefined,
                        status: status || undefined,
                        sortBy: sortBy || undefined,
                        limit: limit ? String(limit) : undefined,
                        page: page ? String(page) : undefined,
                      }}
                      onFilterChange={handleFilterChange}
                    />
                  </section>
                </GenericDropdown>
                <ExportAction
                  isDisabled
                  downloadMutation={async (filters) => {
                    const { data } = await downloadTeams(filters);
                    return data as Blob;
                  }}
                  currentPage={undefined}
                  dateRange={undefined}
                  status={undefined}
                  buttonText="Export Teams"
                  fileName="Teams"
                  className="h-10 rounded-md border px-3"
                />
                <MainButton variant="primary" isLeftIconVisible icon={<Add />} onClick={() => handleOpenTeamDialog()}>
                  Add Team
                </MainButton>
              </div>
            }
          />

          {isLoading ? (
            <Loading text={`Loading teams table...`} className={`w-fill h-fit p-20`} />
          ) : (
            <section>
              {Array.isArray(teamData?.data?.items) && teamData?.data?.items.length ? (
                <AdvancedDataTable
                  data={teamData.data.items}
                  columns={teamColumn}
                  currentPage={(teamData.data as any).metadata.page}
                  totalPages={(teamData.data as any).metadata.totalPages}
                  itemsPerPage={(teamData.data as any).metadata.limit}
                  hasPreviousPage={(teamData.data as any).metadata.hasPreviousPage}
                  hasNextPage={(teamData.data as any).metadata.hasNextPage}
                  onPageChange={handlePageChange}
                  rowActions={getRowActions}
                  showPagination={true}
                  enableRowSelection={true}
                  enableColumnVisibility={true}
                  enableSorting={true}
                  enableFiltering={true}
                  mobileCardView={true}
                  showColumnCustomization={false}
                />
              ) : (debouncedSearch && debouncedSearch.trim()) || (status && status !== "all") || sortBy ? (
                <FilteredEmptyState onReset={handleResetFilters} />
              ) : (
                <EmptyState
                  className="bg-background"
                  images={[{ src: empty1.src, alt: "No teams", width: 100, height: 100 }]}
                  title="No team added yet."
                  description="Add teams to better organize your workforce, assign leads, and manage roles across your organization."
                  button={{
                    text: "Add New Team",
                    onClick: () => handleOpenTeamDialog(),
                  }}
                />
              )}
            </section>
          )}
        </section>
      </section>

      <ReusableDialog
        open={dialogOpen && dialogType === "team"}
        onOpenChange={setDialogOpen}
        title={currentTeam ? "Edit Team" : "Add New Team"}
        description={currentTeam ? "Modify the team details" : "Create a new team for your organization"}
        trigger={<span />}
      >
        <TeamForm
          initialData={currentTeam}
          onSubmit={async (data) => {
            return currentTeam ? handleUpdateTeam({ name: data.name }) : handleAddTeam(data.name);
          }}
          onCancel={() => setDialogOpen(false)}
          isSubmitting={isSubmitting}
        />
      </ReusableDialog>

      <ReusableDialog
        open={dialogOpen && dialogType === "role"}
        onOpenChange={setDialogOpen}
        title={currentRole ? "Edit Role" : "Create Roles"}
        description={currentRole ? "Modify the role details" : "Create new roles for this team"}
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
              // prevent dialog bubbling issues and close
              event?.preventDefault?.();
              setDialogOpen(false);
            }}
            onComplete={handleRoleCreationComplete}
            isSubmitting={isSubmitting}
          />
        )}
      </ReusableDialog>

      <ReusableDialog
        open={dialogOpen && dialogType === "employee"}
        onOpenChange={setDialogOpen}
        title="Add Employee"
        description="Assign employees to this team and customize their roles"
        className={`!max-w-2xl`}
        trigger={<span />}
      >
        {currentTeam && (
          <AddNewEmployees
            onSubmit={handleAssignEmployee}
            onCancel={(event) => {
              // prevent dialog bubbling issues and close
              event?.preventDefault?.();
              setDialogOpen(false);
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
              employeesData?.data?.items?.map((employee) => ({
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
        className="!max-w-2xl"
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
