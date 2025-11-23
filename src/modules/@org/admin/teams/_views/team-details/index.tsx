/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/app/Loading";
import { BreadCrumb } from "@/components/shared/breadcrumb";
import MainButton from "@/components/shared/button";
import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PageSection, PageWrapper } from "@/lib/animation";
import { queryKeys } from "@/lib/react-query/query-keys";
import { formatDate } from "@/lib/tools/format";
import { AdvancedDataTable } from "@/modules/@org/admin/_components/table/table";
import type { Team as TeamFormType } from "@/modules/@org/onboarding/_components/forms/schema";
import { TeamForm } from "@/modules/@org/onboarding/_components/forms/team/team-form";
import { useOnboardingService } from "@/modules/@org/onboarding/services/use-onboarding-service";
import { useQueryClient } from "@tanstack/react-query";
import { More } from "iconsax-reactjs";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import empty1 from "~/images/empty-state.svg";
import { CardGroup } from "../../../dashboard/_components/card-group";
import { DashboardCard } from "../../../dashboard/_components/dashboard-card";
import { useTeamService } from "../../services/use-service";
import { subTeamColumn, useSubTeamRowActions } from "../table-data";

const TeamDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { useGetTeamsById, useDeleteTeam } = useTeamService();
  const { useUpdateTeam, useCreateTeam } = useOnboardingService();
  const { data: teamData, isLoading } = useGetTeamsById(id, { enabled: !!id });

  // Local state for dialogs
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddSubTeamDialogOpen, setIsAddSubTeamDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const { getRowActions, DeleteConfirmationModal } = useSubTeamRowActions((team) => {
    setEditingTeam(team);
    setIsEditDialogOpen(true);
  }, id);

  const updateTeamMutation = useUpdateTeam();
  const createTeamMutation = useCreateTeam();
  const deleteTeamMutation = useDeleteTeam();

  type TeamWithSubteams = Team & { subteams?: Team[] };
  const subTeams: Team[] = (teamData as TeamWithSubteams)?.subteams ?? [];

  // Handle team name update
  const handleUpdateTeamName = async (data: { name: string }) => {
    try {
      setIsSubmitting(true);
      const targetId = editingTeam?.id || id;
      await updateTeamMutation.mutateAsync({ teamId: targetId, name: data.name });
      // Invalidate list and both affected detail queries (parent & edited team if different)
      await queryClient.invalidateQueries({ queryKey: queryKeys.team.list() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.team.details(targetId) });
      if (editingTeam && editingTeam.id !== id) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.team.details(id) });
      }
      toast.success(`Team name updated successfully!`);
      setIsEditDialogOpen(false);
      setEditingTeam(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update team name";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add sub-team
  const handleAddSubTeam = async (data: { name: string }) => {
    try {
      setIsSubmitting(true);
      await createTeamMutation.mutateAsync({ name: data.name, parentId: id });
      await queryClient.invalidateQueries({ queryKey: queryKeys.team.list() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.team.details(id) });
      toast.success(`Sub-team "${data.name}" created successfully!`);
      setIsAddSubTeamDialogOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create sub-team";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete team
  const handleDeleteTeam = async () => {
    try {
      const response = await deleteTeamMutation.mutateAsync(id);
      if (response?.success) {
        toast.success(`Team "${teamData?.name}" deleted successfully!`);
        router.push("/admin/teams");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete team";
      toast.error(errorMessage);
    }
  };

  return (
    <PageWrapper className="space-y-8">
      <PageSection index={0}>
        <DashboardHeader
          title="Team Details"
          subtitle={
            <BreadCrumb
              items={[
                { label: "Teams", href: "/admin/teams" },
                { label: teamData?.name || "", href: `/admin/teams/${id}` },
              ]}
            />
          }
          actionComponent={
            <div className="flex items-center gap-5">
              <MainButton
                variant="primary"
                isLeftIconVisible
                icon={<Plus />}
                onClick={() => setIsAddSubTeamDialogOpen(true)}
              >
                Add Sub-team
              </MainButton>
              <GenericDropdown
                align="end"
                trigger={
                  <div className="bg-background border-border flex size-10 items-center justify-center rounded-md shadow">
                    <More className="size-5" />
                  </div>
                }
              >
                <DropdownMenuItem
                  onClick={() => {
                    setEditingTeam(teamData as Team);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit Team&apos;s Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                >
                  Delete Team
                </DropdownMenuItem>
              </GenericDropdown>
            </div>
          }
        />
      </PageSection>
      <PageSection index={1}>
        <CardGroup>
          <DashboardCard
            title="Team Name"
            value={<span className="text-base">{teamData?.name}</span>}
            className="flex flex-col items-center justify-center text-center"
          />
          <DashboardCard
            title="Team Manager"
            value={
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-base">{teamData?.manager || `Ifijeh Kingsley`}</span>
              </div>
            }
            className="flex flex-col items-center justify-center gap-4 text-center"
          />
          <DashboardCard
            title="Sub teams"
            value={<span className="text-base">{teamData?.subteams?.length}</span>}
            className="flex flex-col items-center justify-center text-center"
          />
          <DashboardCard
            title="Created On"
            value={<span className="text-base">{formatDate(teamData?.createdAt)}</span>}
            className="flex flex-col items-center justify-center text-center"
          />
        </CardGroup>
      </PageSection>

      <PageSection index={2} className="space-y-4">
        {isLoading ? (
          <Loading text={`Loading sub-teams...`} className={`w-fill h-fit p-20`} />
        ) : subTeams.length > 0 ? (
          <AdvancedDataTable
            data={subTeams}
            columns={subTeamColumn}
            rowActions={getRowActions}
            showPagination={false}
            enableRowSelection={true}
            enableColumnVisibility={true}
            onRowClick={(team: any) => {
              if (team?.id) {
                router.push(`/admin/teams/sub-team/${team.id}`);
              }
            }}
            enableSorting={true}
            enableFiltering={true}
            mobileCardView={true}
            showColumnCustomization={false}
          />
        ) : (
          <EmptyState
            className="bg-background"
            images={[{ src: empty1.src, alt: "No sub-team", width: 100, height: 100 }]}
            title="No sub-team yet."
            description="Create sub-teams to better organize your team, assign leads, and manage roles."
            button={{
              text: "Add Sub-team",
              onClick: () => {
                return;
              },
            }}
          />
        )}
      </PageSection>

      {/* Edit Team Name Dialog */}
      <ReusableDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Team Name"
        description="Update the name of this team"
        trigger={<span />}
        className="min-w-2xl"
      >
        <TeamForm
          initialData={
            editingTeam
              ? ({ id: editingTeam.id, name: editingTeam.name, roles: [] } as TeamFormType)
              : teamData
                ? ({ id: teamData.id, name: teamData.name, roles: [] } as TeamFormType)
                : undefined
          }
          onSubmit={handleUpdateTeamName}
          onCancel={() => setIsEditDialogOpen(false)}
          isSubmitting={isSubmitting}
        />
      </ReusableDialog>

      {/* Add Sub-team Dialog */}
      <ReusableDialog
        open={isAddSubTeamDialogOpen}
        onOpenChange={setIsAddSubTeamDialogOpen}
        title="Add Sub-team"
        description="Create a new sub-team under this team"
        trigger={<span />}
        className="min-w-2xl"
      >
        <TeamForm
          onSubmit={handleAddSubTeam}
          onCancel={() => setIsAddSubTeamDialogOpen(false)}
          isSubmitting={isSubmitting}
        />
      </ReusableDialog>

      {/* Delete Confirmation Modal for Sub-teams */}
      <DeleteConfirmationModal />
      {/* Delete Team Confirmation */}
      <AlertModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => !isSubmitting && setIsDeleteConfirmOpen(false)}
        onConfirm={async () => {
          if (isSubmitting) return;
          setIsSubmitting(true);
          await handleDeleteTeam();
          setIsSubmitting(false);
          setIsDeleteConfirmOpen(false);
        }}
        loading={isSubmitting}
        type="warning"
        title="Delete Team"
        description={`Are you sure you want to delete "${teamData?.name}"? This action cannot be undone.`}
        confirmText={isSubmitting ? "Deleting..." : "Delete Team"}
        cancelText="Cancel"
      />
    </PageWrapper>
  );
};

export { TeamDetails };
