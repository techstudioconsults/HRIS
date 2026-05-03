import { create } from 'zustand';

import type { TeamWorkflowActions, TeamWorkflowState } from '../types';

export type {
  TeamWorkflowActions,
  TeamWorkflowState,
  WorkflowMode,
} from '../types';

export const useTeamWorkflowStore = create<
  TeamWorkflowState & TeamWorkflowActions
>((set) => ({
  currentTeam: null,
  currentRole: null,
  isSubmitting: false,
  workflowMode: 'create',
  skipToNextStep: false,
  setCurrentTeam: (team) => set({ currentTeam: team }),
  setCurrentRole: (role) => set({ currentRole: role }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSkipToNextStep: (skipToNextStep) => set({ skipToNextStep }),
  resetWorkflow: () =>
    set({
      currentTeam: null,
      currentRole: null,
      isSubmitting: false,
      workflowMode: 'create',
      skipToNextStep: false,
    }),
}));
