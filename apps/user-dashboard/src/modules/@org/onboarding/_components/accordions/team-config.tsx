"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { MainButton } from "@workspace/ui/lib/button";
import { AxiosError } from "axios";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useTour } from "../../context/tour-context";
import { useOnboardingService } from "../../services/use-onboarding-service";
import { RolesAndPermission } from "../forms/roles&permission";
import { Role, Team } from "../forms/schema";
import { TeamForm } from "../forms/team/team-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { ReusableDialog } from "@workspace/ui/lib";

export const TeamConfig = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [dialogType, setDialogType] = useState<"team" | "role">("team");
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

  const { mutateAsync: deleteTeam, isPending: isDeletingTeam } = useDeleteTeam();
  const { mutateAsync: createRole, isPending: isCreatingRole } = useCreateRole();
  const { mutateAsync: updateRole, isPending: isUpdatingRole } = useUpdateRole();
  const { mutateAsync: deleteRole, isPending: isDeletingRole } = useDeleteRole();
  const { mutateAsync: createTeam, isPending: isCreatingTeam } = useCreateTeam();
  const { mutateAsync: updateTeam, isPending: isUpdatingTeam } = useUpdateTeam();

  const handleOpenTeamDialog = (team?: Team) => {
    stopTour();
    setCurrentTeam(team || null);
    setCurrentRole(null);
    setDialogType("team");
    setDialogOpen(true);
  };

  const handleOpenRoleDialog = (team: Team, role?: Role) => {
    stopTour();
    setCurrentTeam(team);
    setCurrentRole(role || null);
    setDialogType("role");
    setDialogOpen(true);
  };

  const handleAddTeam = async (name: string) => {
    await createTeam(
      { name },
      {
        onSuccess: () => {
          toast.success("Team created successfully");
          setDialogOpen(false);
        },
        onError: (error) => {
          const message = error instanceof AxiosError ? error.response?.data.message : "An unexpected error occurred";
          toast.error("Failed to create team", { description: message });
        },
      },
    );
  };

  const handleUpdateTeam = async (teamId: string, name: string) => {
    await updateTeam(
      { teamId, name },
      {
        onSuccess: () => {
          toast.success("Team updated successfully");
          setDialogOpen(false);
        },
        onError: (error) => {
          const message = error instanceof AxiosError ? error.response?.data.message : "An unexpected error occurred";
          toast.error("Failed to update team", { description: message });
        },
      },
    );
  };

  const handleDeleteTeam = async (teamId: string) => {
    setDeletingTeamId(teamId);
    await deleteTeam(teamId, {
      onSuccess: () => {
        toast.success("Team deleted successfully");
      },
      onError: (error) => {
        const message = error instanceof AxiosError ? error.response?.data.message : "An unexpected error occurred";
        toast.error("Failed to delete team", {
          description: message,
        });
      },
      onSettled: () => setDeletingTeamId(null),
    });
  };

  const handleAddRole = async (teamId: string, role: Omit<Role, "id">) => {
    await createRole(
      {
        name: role.name!,
        teamId,
        permissions: role.permissions,
      },
      {
        onSuccess: () => {
          toast.success("Role created successfully");
          setDialogOpen(false);
        },
        onError: (error) => {
          const message = error instanceof AxiosError ? error.response?.data.message : "An unexpected error occurred";
          toast.error("Failed to create role", { description: message });
        },
      },
    );
  };

  const handleUpdateRole = async (roleId: string, role: Partial<Role> & { teamId?: string }) => {
    try {
      const resolvedTeamId = role.teamId ?? currentTeam?.id;
      if (!resolvedTeamId) {
        toast.error("Failed to update role", { description: "Missing team context for role update" });
        return;
      }
      const updateData: { roleId: string; name?: string; permissions?: string[]; teamId: string } = {
        roleId,
        teamId: resolvedTeamId,
      };
      if (role.name !== undefined) updateData.name = role.name;
      if (role.permissions !== undefined) updateData.permissions = role.permissions;

      await updateRole(updateData, {
        onSuccess: () => {
          toast.success("Role updated successfully");
        },
        onError: (error) => {
          const message = error instanceof AxiosError ? error.response?.data.message : "An unexpected error occurred";
          toast.error("Failed to update role", { description: message });
          setDialogOpen(false);
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Failed to update role", {
        description: message,
      });
    }
  };

  const handleDeleteRole = async (_teamId: string, roleId: string) => {
    setDeletingRoleId(roleId);
    await deleteRole(roleId, {
      onSuccess: (response) => {
        if (response.success) toast.success("Role deleted successfully");
      },
      onError: (error) => {
        const message = error instanceof AxiosError ? error.response?.data.message : error.message;
        toast.error("Failed to delete role", { description: message });
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
            <Skeleton className="h-6 w-[150px]" />
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
      <Accordion type="multiple" className="w-full space-y-4" defaultValue={teams?.map((team) => team.id!)}>
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
                    <Pencil className="mr-2 h-4 w-4" />
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    {isDeletingTeam && deletingTeamId === team.id ? "Deleting..." : "Delete"}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="mt-0.5 space-y-4 rounded-md border border-t p-4 font-medium">
              {team?.roles?.length > 0 ? (
                team.roles.map((role: Role) => (
                  <div key={role.id} className="flex w-full items-center justify-between">
                    <p>{role.name}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span
                        className="flex cursor-pointer items-center text-gray-600 hover:text-gray-900"
                        onClick={() => handleOpenRoleDialog(team, role)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {/* Edit */}
                      </span>
                      <span
                        className="text-destructive hover:text-destructive flex cursor-pointer items-center"
                        onClick={() => {
                          if (isDeletingRole) return;
                          handleDeleteRole(team.id!, role.id!);
                        }}
                      >
                        {isDeletingRole && deletingRoleId === role.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        {/* {isDeletingRole && deletingRoleId === role.id ? "Deleting..." : "Delete"} */}
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
                  <Plus className="h-4 w-4" />
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
          icon={<Plus className="mr-2 h-4 w-4" />}
          isLeftIconVisible
          onClick={() => handleOpenTeamDialog()}
        >
          Add New Team
        </MainButton>
      </div>

      {/* Team Dialog */}
      <ReusableDialog
        open={dialogOpen && dialogType === "team"}
        onOpenChange={setDialogOpen}
        title={currentTeam ? "Edit Team" : "Add New Team"}
        description={currentTeam ? "Modify the team details" : "Create a new team for your organization"}
        trigger={undefined}
      >
        <TeamForm
          initialData={currentTeam}
          onSubmit={(data) => (currentTeam ? handleUpdateTeam(currentTeam.id!, data.name) : handleAddTeam(data.name))}
          onCancel={() => setDialogOpen(false)}
          isSubmitting={isCreatingTeam || isUpdatingTeam}
        />
      </ReusableDialog>

      {/* Role Dialog */}
      <ReusableDialog
        open={dialogOpen && dialogType === "role"}
        onOpenChange={setDialogOpen}
        title={currentRole ? "Edit Role" : "Add New Role"}
        description={currentRole ? "Modify the role details" : "Create a new role for this team"}
        className="!max-w-2xl"
        trigger={undefined}
      >
        {currentTeam && (
          <RolesAndPermission
            initialData={currentRole}
            onSubmit={(data) => {
              return currentRole
                ? handleUpdateRole(currentRole.id!, { ...data, teamId: currentTeam.id! })
                : handleAddRole(currentTeam.id!, data);
            }}
            onCancel={() => setDialogOpen(false)}
            isSubmitting={isCreatingRole || isUpdatingRole}
          />
        )}
      </ReusableDialog>
    </>
  );
};
