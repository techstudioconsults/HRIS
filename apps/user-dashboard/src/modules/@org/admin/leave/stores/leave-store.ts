import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { LeaveUIActions, LeaveUIState } from '../types';

export type { LeaveUIState, LeaveUIActions } from '../types';

const initialState: LeaveUIState = {
  showLeaveSetupModal: false,
  hasCompletedLeaveSetup: false,
  showLeaveDetailsDrawer: false,
  selectedLeaveRequestId: null,
  selectedLeaveRequest: null,
};

export const useLeaveStore = create<LeaveUIState & LeaveUIActions>()(
  devtools(
    (set) => ({
      ...initialState,
      setShowLeaveSetupModal: (open) => set({ showLeaveSetupModal: open }),
      setHasCompletedLeaveSetup: (status) =>
        set({ hasCompletedLeaveSetup: status }),
      setShowLeaveDetailsDrawer: (open) =>
        set({ showLeaveDetailsDrawer: open }),
      setSelectedLeaveRequestId: (id) => set({ selectedLeaveRequestId: id }),
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
