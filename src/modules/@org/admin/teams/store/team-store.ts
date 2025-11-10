import type { Role as FormRole, Team as TeamFormType } from "@/modules/@org/onboarding/_components/forms/schema";
import { create } from "zustand";

export type TeamWorkflowDialog = "none" | "team" | "role" | "employee";
export type WorkflowMode = "create" | "edit" | "standalone";

export interface TeamWorkflowState {
  currentTeam: TeamFormType | null;
  currentRole: FormRole | null;
  dialog: TeamWorkflowDialog;
  isSubmitting: boolean;
  workflowMode: WorkflowMode;
  skipToNextStep: boolean; // Flag to determine if user wants to continue workflow
}

export interface TeamWorkflowActions {
  openTeamDialog: (team?: TeamFormType | null, mode?: WorkflowMode) => void;
  openRoleDialog: (team?: TeamFormType | null, role?: FormRole | null) => void;
  openEmployeeDialog: (team: TeamFormType) => void;
  closeDialog: () => void;
  setCurrentTeam: (team: TeamFormType | null) => void;
  setCurrentRole: (role: FormRole | null) => void;
  setSubmitting: (submitting: boolean) => void;
  setSkipToNextStep: (skip: boolean) => void;
  resetWorkflow: () => void;
}

export const useTeamWorkflowStore = create<TeamWorkflowState & TeamWorkflowActions>((set) => ({
  currentTeam: null,
  currentRole: null,
  dialog: "none",
  isSubmitting: false,
  workflowMode: "create",
  skipToNextStep: false,
  openTeamDialog: (team, mode = "create") =>
    set({
      dialog: "team",
      currentTeam: team ?? null,
      currentRole: null,
      workflowMode: mode,
      skipToNextStep: false,
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
  closeDialog: () => set({ dialog: "none", skipToNextStep: false }),
  setCurrentTeam: (team) => set({ currentTeam: team }),
  setCurrentRole: (role) => set({ currentRole: role }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSkipToNextStep: (skipToNextStep) => set({ skipToNextStep }),
  resetWorkflow: () =>
    set({
      currentTeam: null,
      currentRole: null,
      dialog: "none",
      isSubmitting: false,
      workflowMode: "create",
      skipToNextStep: false,
    }),
}));
