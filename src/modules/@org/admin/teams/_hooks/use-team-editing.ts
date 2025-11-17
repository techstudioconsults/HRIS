/* eslint-disable no-console */
import type { Team as TeamFormType } from "@/modules/@org/onboarding/_components/forms/schema";
import { useOnboardingService } from "@/modules/@org/onboarding/services/use-onboarding-service";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface UseTeamEditingReturn {
  isEditing: boolean;
  editingTeam: TeamFormType | null;
  openEditDialog: (team: TeamFormType) => void;
  closeEditDialog: () => void;
  handleUpdateTeam: (data: { name: string }) => Promise<void>;
  isSubmitting: boolean;
}

export const useTeamEditing = (): UseTeamEditingReturn => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamFormType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const { useUpdateTeam } = useOnboardingService();
  const { mutateAsync: updateTeamMutation } = useUpdateTeam();

  const openEditDialog = (team: TeamFormType) => {
    setEditingTeam(team);
    setIsEditing(true);
  };

  const closeEditDialog = () => {
    setEditingTeam(null);
    setIsEditing(false);
    setIsSubmitting(false);
  };

  const handleUpdateTeam = async (data: { name: string }) => {
    if (!editingTeam?.id) {
      throw new Error("No team selected for editing");
    }

    try {
      setIsSubmitting(true);
      await updateTeamMutation({
        teamId: editingTeam.id,
        name: data.name,
      });

      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ["teams"] });

      // Close the dialog
      closeEditDialog();
    } catch (error) {
      console.error("Failed to update team:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditing,
    editingTeam,
    openEditDialog,
    closeEditDialog,
    handleUpdateTeam,
    isSubmitting,
  };
};
