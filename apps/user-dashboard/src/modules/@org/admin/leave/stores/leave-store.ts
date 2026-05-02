import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { LeaveUIActions, LeaveUIState } from '../types';

export type { LeaveUIState, LeaveUIActions } from '../types';

const initialState: LeaveUIState = {
  showLeaveSetupModal: false,
  hasCompletedLeaveSetup: false,
  // Drawer open/close and entity ID are managed by nuqs (useLeaveAdminModalParams).
  // This field is a warm cache only — null on cold refresh.
  selectedLeaveRequest: null,
};

export const useLeaveStore = create<LeaveUIState & LeaveUIActions>()(
  devtools(
    (set) => ({
      ...initialState,
      setShowLeaveSetupModal: (open) => set({ showLeaveSetupModal: open }),
      setHasCompletedLeaveSetup: (status) =>
        set({ hasCompletedLeaveSetup: status }),
      setSelectedLeaveRequest: (request) =>
        set({ selectedLeaveRequest: request }),
      resetUI: () => set(initialState),
    }),
    { name: 'leave-ui' }
  )
);

// Legacy aliases for backwards compatibility — prefer importing LeaveUIState / LeaveUIActions directly.
export type {
  LeaveUIState as LeaveState,
  LeaveUIActions as LeaveActions,
} from '../types';
