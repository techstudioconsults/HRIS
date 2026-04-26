import { create } from 'zustand';

import type { TeamWorkflowActions, TeamWorkflowState } from '../types';

export type {
  TeamWorkflowActions,
  TeamWorkflowDialog,
  TeamWorkflowState,
  WorkflowMode,
} from '../types';

export const useTeamWorkflowStore = create<
  TeamWorkflowState & TeamWorkflowActions
>((set) => ({
  currentTeam: null,
  currentRole: null,
  dialog: 'none',
  isSubmitting: false,
  workflowMode: 'create',
  skipToNextStep: false,
  openTeamDialog: (team, mode = 'create') =>
    set({
      dialog: 'team',
      currentTeam: team ?? null,
      currentRole: null,
      workflowMode: mode,
      skipToNextStep: false,
    }),
  openRoleDialog: (team, role) =>
    set({
      dialog: 'role',
      currentTeam: team ?? null,
      currentRole: role ?? null,
    }),
  openEmployeeDialog: (team) =>
    set({
      dialog: 'employee',
      currentTeam: team,
    }),
  closeDialog: () => set({ dialog: 'none', skipToNextStep: false }),
  setCurrentTeam: (team) => set({ currentTeam: team }),
  setCurrentRole: (role) => set({ currentRole: role }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSkipToNextStep: (skipToNextStep) => set({ skipToNextStep }),
  resetWorkflow: () =>
    set({
      currentTeam: null,
      currentRole: null,
      dialog: 'none',
      isSubmitting: false,
      workflowMode: 'create',
      skipToNextStep: false,
    }),
}));
