"use client";

import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { EmptyState, FilteredEmptyState } from "@/components/shared/empty-state";
import type { Role as FormRole, Team as TeamFormType } from "@/modules/@org/onboarding/_components/forms/schema";
import { TeamForm } from "@/modules/@org/onboarding/_components/forms/team/team-form";
import type { Team as ServiceTeam } from "@/modules/@org/onboarding/services/service";
import { useOnboardingService } from "@/modules/@org/onboarding/services/use-onboarding-service";
import { useQueryClient } from "@tanstack/react-query";
import { Add } from "iconsax-reactjs";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import empty1 from "~/images/empty-state.svg";
import { AddNewEmployees } from "../../_components/forms/add-new-employees";
import { RolesAndPermission } from "../../_components/forms/add-new-roles";
import { DashboardTable } from "../../../_components/dashboard-table";
import { useEmployeeService } from "../../../employee/services/use-service";
import { useTeamService } from "../../services/use-service";
import { teamColumn, useTeamRowActions } from "../table-data";

export const AllTeams = () => {
  // const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [status, setStatus] = useState<string>("all");
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

  const { getRowActions, DeleteConfirmationModal } = useTeamRowActions(handleOpenEmployeeDialog);
  const [searchQuery, setSearchQuery] = useState("");
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

  const { useGetAllTeams, useGetRoles, useCreateRole, useUpdateRole, useAssignEmployeeToTeam } = useTeamService();
  const { useGetAllEmployees } = useEmployeeService();

  // Create filters object
  const filters: IFilters = {
    page: currentPage,
    ...(status !== "all" && { status: status as "published" | "draft" }),
    ...(searchQuery && { search: searchQuery }),
  };

  // Fetch teams data
  const { data: teamData, isLoading: isProductsLoading } = useGetAllTeams(filters);

  // Fetch employees data
  const { data: employeesData } = useGetAllEmployees({ page: 1 });

  // Fetch roles for current team - only when employee dialog is open
  const { data: rolesData } = useGetRoles(currentTeam?.id || "", {
    enabled: !!currentTeam?.id && dialogType === "employee",
  });

  const queryClient = useQueryClient();
  const { useCreateTeam, useUpdateTeam } = useOnboardingService();

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const assignEmployeeMutation = useAssignEmployeeToTeam();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  const handleUpdateTeam = async (id: string, name: string) => {
    try {
      setIsSubmitting(true);
      await updateTeamMutation.mutateAsync({ teamId: id, name });
      setDialogOpen(false);
      setCurrentTeam(null);
      await queryClient.invalidateQueries({ queryKey: ["teams"] });
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
      <section className={`space-y-10`}>
        <section className={`space-y-4`}>
          <section className={`flex flex-col-reverse justify-between gap-4 lg:flex-row lg:items-center`}>
            <div className="">
              <h1 className="text-2xl font-bold">Teams</h1>
              <p>All Teams</p>
            </div>
            <div className="">
              <div className="flex items-center gap-2">
                <SearchInput className={`h-10`} placeholder={`Search teams...`} onSearch={setSearchQuery} />
                {/* <MainButton
                className="border-gray-75 bg-background border-1 px-3 text-black dark:text-white"
                variant="outline"
                isLeftIconVisible
                size="lg"
                icon={<Filter />}
              >
                Filter
              </MainButton>
              <MainButton
                className="border-gray-75 bg-background border-1 px-3 text-black dark:text-white"
                variant="outline"
                size="lg"
                isLeftIconVisible={true}
                icon={<Export />}
              >
                Export
              </MainButton> */}
                <MainButton
                  variant="primary"
                  isLeftIconVisible
                  size="lg"
                  icon={<Add />}
                  onClick={() => handleOpenTeamDialog()}
                >
                  Add Team
                </MainButton>
              </div>
            </div>
          </section>
          {isProductsLoading ? (
            <Loading text={`Loading teams table...`} className={`w-fill h-fit p-20`} />
          ) : (
            <section>
              {teamData?.data?.items.length ? (
                <section>
                  <DashboardTable
                    data={teamData.data.items}
                    columns={teamColumn}
                    // currentPage={teamData.data.metadata.page}
                    // totalPages={teamData.data.metadata.totalPages}
                    // itemsPerPage={teamData.data.metadata.limit}
                    // hasPreviousPage={teamData.data.metadata.hasPreviousPage}
                    // hasNextPage={teamData.data.metadata.hasNextPage}
                    onPageChange={handlePageChange}
                    rowActions={getRowActions}
                    showPagination
                    // onRowClick={(employee) => {
                    //   router.push(`/dashboard/${user?.id}/products/${product.id}`);
                    // }}
                  />
                </section>
              ) : dateRange?.from || dateRange?.to || status !== "all" ? (
                <FilteredEmptyState
                  onReset={() => {
                    setDateRange(undefined);
                    setStatus("all");
                    setCurrentPage(1);
                  }}
                />
              ) : (
                <EmptyState
                  className={`bg-background`}
                  images={[{ src: empty1.src, alt: "No employees", width: 100, height: 100 }]}
                  title="No team added yet."
                  description="Add teams  to better organize your workforce, assign leads, and manage roles across your organization.."
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
            return currentTeam ? handleUpdateTeam(currentTeam.id!, data.name) : handleAddTeam(data.name);
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
              rolesData?.map((role) => ({
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
    </>
  );
};
