import type { Role as FormRole, Team as TeamFormType } from "@/modules/@org/onboarding/_components/forms/schema";
import { create } from "zustand";

export type TeamWorkflowDialog = "none" | "team" | "role" | "employee";

export interface TeamWorkflowState {
  currentTeam: TeamFormType | null;
  currentRole: FormRole | null;
  dialog: TeamWorkflowDialog;
  isSubmitting: boolean;
}

export interface TeamWorkflowActions {
  openTeamDialog: (team?: TeamFormType | null) => void;
  openRoleDialog: (team?: TeamFormType | null, role?: FormRole | null) => void;
  openEmployeeDialog: (team: TeamFormType) => void;
  closeDialog: () => void;
  setCurrentTeam: (team: TeamFormType | null) => void;
  setCurrentRole: (role: FormRole | null) => void;
  setSubmitting: (submitting: boolean) => void;
  resetWorkflow: () => void;
}

export const useTeamWorkflowStore = create<TeamWorkflowState & TeamWorkflowActions>((set) => ({
  currentTeam: null,
  currentRole: null,
  dialog: "none",
  isSubmitting: false,
  openTeamDialog: (team) =>
    set({
      dialog: "team",
      currentTeam: team ?? null,
      currentRole: null,
    }),
  openRoleDialog: (team, role) =>
    set({
      dialog: "role",
      currentTeam: team ?? null,
      currentRole: role ?? null,
    }),
  openEmployeeDialog: (team) =>
    set({
      dialog: "employee",
      currentTeam: team,
    }),
  closeDialog: () => set({ dialog: "none" }),
  setCurrentTeam: (team) => set({ currentTeam: team }),
  setCurrentRole: (role) => set({ currentRole: role }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  resetWorkflow: () =>
    set({
      currentTeam: null,
      currentRole: null,
      dialog: "none",
      isSubmitting: false,
    }),
}));
