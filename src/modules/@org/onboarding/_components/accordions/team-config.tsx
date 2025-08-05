/* eslint-disable @typescript-eslint/no-explicit-any */
// components/accordions/TeamConfig.tsx
"use client";

import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useOnboardingService } from "../../services/use-onboarding-service";
import { RolesAndPermission } from "../forms/roles&permission";
import { Role, Team } from "../forms/schema";
import { TeamForm } from "../forms/team/team-form";

interface TeamConfigProperties {
  teams: Team[];
  onTeamsChange: (teams: Team[]) => void;
}

export const TeamConfig = ({ teams, onTeamsChange }: TeamConfigProperties) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [dialogType, setDialogType] = useState<"team" | "role">("team");

  const { useCreateTeam, useUpdateTeam, useDeleteTeam, useCreateRole, useUpdateRole, useDeleteRole } =
    useOnboardingService();

  // Mutations
  const { mutateAsync: createTeam, isPending: isCreatingTeam } = useCreateTeam();
  const { mutateAsync: updateTeam, isPending: isUpdatingTeam } = useUpdateTeam();
  const { mutateAsync: deleteTeam } = useDeleteTeam();
  const { mutateAsync: createRole, isPending: isCreatingRole } = useCreateRole();
  const { mutateAsync: updateRole, isPending: isUpdatingRole } = useUpdateRole();
  const { mutateAsync: deleteRole } = useDeleteRole();

  const handleOpenTeamDialog = (team?: Team) => {
    setCurrentTeam(team || null);
    setCurrentRole(null);
    setDialogType("team");
    setDialogOpen(true);
  };

  const handleOpenRoleDialog = (team: Team, role?: Role) => {
    setCurrentTeam(team);
    setCurrentRole(role || null);
    setDialogType("role");
    setDialogOpen(true);
  };

  const handleAddTeam = async (name: string) => {
    try {
      const newTeam = await createTeam(name);
      onTeamsChange([...teams, newTeam]);
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to add team", {
        description: error.message,
      });
    }
  };

  const handleUpdateTeam = async (teamId: string, name: string) => {
    try {
      const updatedTeam = await updateTeam({ teamId, name });
      onTeamsChange(teams.map((t) => (t.id === teamId ? { ...updatedTeam, roles: t.roles } : t)));
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to update team", {
        description: error.message,
      });
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam(teamId);
      onTeamsChange(teams.filter((t) => t.id !== teamId));
    } catch (error: any) {
      toast.error("Failed to delete team", {
        description: error.message,
      });
    }
  };

  const handleAddRole = async (teamId: string, role: Omit<Role, "id">) => {
    try {
      const newRole = await createRole({ ...role, teamId });
      onTeamsChange(teams.map((team) => (team.id === teamId ? { ...team, roles: [...team.roles, newRole] } : team)));
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to add role", {
        description: error.message,
      });
    }
  };

  const handleUpdateRole = async (roleId: string, role: Partial<Role>) => {
    try {
      const updatedRole = await updateRole({ roleId, role });
      onTeamsChange(
        teams.map((team) =>
          team.id === currentTeam?.id
            ? {
                ...team,
                roles: team.roles.map((r) => (r.id === roleId ? { ...r, ...updatedRole } : r)),
              }
            : team,
        ),
      );
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to update role", {
        description: error.message,
      });
    }
  };

  const handleDeleteRole = async (teamId: string, roleId: string) => {
    try {
      await deleteRole(roleId);
      onTeamsChange(
        teams.map((team) =>
          team.id === teamId ? { ...team, roles: team.roles.filter((r) => r.id !== roleId) } : team,
        ),
      );
    } catch (error: any) {
      toast.error("Failed to delete role", {
        description: error.message,
      });
    }
  };

  return (
    <>
      <Accordion type="multiple" className="w-full space-y-4">
        {teams.map((team) => (
          <AccordionItem key={team.id} value={team.id!} className="rounded-lg border">
            <AccordionTrigger className="flex-row-reverse p-4 text-left text-sm md:text-[16px]">
              <div className="flex w-full items-center justify-between">
                <p>{team.name}</p>
                <div className="flex items-center gap-1 space-x-2 text-sm">
                  <span
                    className="flex cursor-pointer items-center gap-1 text-gray-600 hover:text-gray-900"
                    onClick={() => handleOpenTeamDialog(team)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </span>
                  <span
                    className="text-destructive hover:text-destructive flex cursor-pointer items-center gap-1"
                    onClick={() => handleDeleteTeam(team.id!)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 border-t p-4 font-medium">
              {team?.roles?.length > 0 ? (
                team.roles.map((role) => (
                  <div key={role.id} className="flex w-full items-center justify-between">
                    <p>{role.name}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span
                        className="flex cursor-pointer items-center text-gray-600 hover:text-gray-900"
                        onClick={() => handleOpenRoleDialog(team, role)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </span>
                      <span
                        className="text-destructive hover:text-destructive flex cursor-pointer items-center"
                        onClick={() => handleDeleteRole(team.id!, role.id!)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No roles added yet</p>
              )}
              <div className="mt-4">
                <span
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

      <div className="mt-4">
        <MainButton
          type="button"
          variant="default"
          size="xl"
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
          onSubmit={(data) => {
            return currentTeam ? handleUpdateTeam(currentTeam.id!, data.name) : handleAddTeam(data.name);
          }}
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
              return currentRole ? handleUpdateRole(currentRole.id!, data) : handleAddRole(currentTeam.id!, data);
            }}
            onCancel={() => setDialogOpen(false)}
            isSubmitting={isCreatingRole || isUpdatingRole}
          />
        )}
      </ReusableDialog>
    </>
  );
};
