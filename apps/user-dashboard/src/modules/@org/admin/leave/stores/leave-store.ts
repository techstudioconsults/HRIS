import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface LeaveUIState {
  showLeaveSetupModal: boolean;
  hasCompletedLeaveSetup: boolean;

  showLeaveDetailsDrawer: boolean;
  selectedLeaveRequestId: string | null;
}

export interface LeaveUIActions {
  setShowLeaveSetupModal: (open: boolean) => void;
  setHasCompletedLeaveSetup: (status: boolean) => void;

  setShowLeaveDetailsDrawer: (open: boolean) => void;
  setSelectedLeaveRequestId: (id: string | null) => void;

  resetUI: () => void;
}

const initialState: LeaveUIState = {
  showLeaveSetupModal: false,
  hasCompletedLeaveSetup: false,
  showLeaveDetailsDrawer: false,
  selectedLeaveRequestId: null,
};

export const useLeaveStore = create<LeaveUIState & LeaveUIActions>()(
  devtools(
    (set) => ({
      ...initialState,
      setShowLeaveSetupModal: (open) => set({ showLeaveSetupModal: open }),
      setHasCompletedLeaveSetup: (status) => set({ hasCompletedLeaveSetup: status }),
      setShowLeaveDetailsDrawer: (open) => set({ showLeaveDetailsDrawer: open }),
      setSelectedLeaveRequestId: (id) => set({ selectedLeaveRequestId: id }),
      resetUI: () => set(initialState),
    }),
    { name: "leave-ui" },
  ),
);

export type { LeaveUIState as LeaveState, LeaveUIActions as LeaveActions };
