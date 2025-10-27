import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface PayrollUIState {
  showSetupModal: boolean;
  showFundWalletModal: boolean;
  showScheduleDrawer: boolean;
  showPayrollDrawer: boolean;
  showAddEmployeeModal: boolean;
  isNetPayVisible: boolean;
  columnVisibility: Record<string, boolean>;
  selectedRowIds: string[];
  togglePayrollAction: "GENERATE" | "RUN" | "SCHEDULE";
  hideNotificationBanner?: boolean;
  payrollSelectedDate?: Date;
}

export interface PayrollUIActions {
  setShowSetupModal: (open: boolean) => void;
  setShowFundWalletModal: (open: boolean) => void;
  setShowScheduleDrawer: (open: boolean) => void;
  setShowPayrollDrawer: (open: boolean) => void;
  setShowAddEmployeeModal: (open: boolean) => void;
  setTogglePayrollAction: (action: "GENERATE" | "RUN" | "SCHEDULE") => void;
  setHideNotificationBanner: (show: boolean) => void;
  setPayrollSelectedDate: (date: Date | undefined) => void;

  toggleNetPayVisibility: () => void;

  setColumnVisibility: (id: string, visible: boolean) => void;
  setColumnVisibilityBatch: (visibility: Record<string, boolean>) => void;

  selectRow: (id: string) => void;
  deselectRow: (id: string) => void;
  setSelection: (ids: string[]) => void;
  clearSelection: () => void;

  resetUI: () => void;
}

const initialState: PayrollUIState = {
  showSetupModal: true,
  showFundWalletModal: false,
  showScheduleDrawer: false,
  showPayrollDrawer: false,
  showAddEmployeeModal: false,
  isNetPayVisible: false,
  columnVisibility: {},
  selectedRowIds: [],
  togglePayrollAction: "GENERATE",
  hideNotificationBanner: true,
  payrollSelectedDate: undefined,
};

export const usePayrollStore = create<PayrollUIState & PayrollUIActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Visibility toggles
        setShowSetupModal: (open) => set({ showSetupModal: open }),
        setShowFundWalletModal: (open) => set({ showFundWalletModal: open }),
        setShowScheduleDrawer: (open) => set({ showScheduleDrawer: open }),
        setShowPayrollDrawer: (open) => set({ showPayrollDrawer: open }),
        setShowAddEmployeeModal: (open) => set({ showAddEmployeeModal: open }),
        setTogglePayrollAction: (action) => set({ togglePayrollAction: action }),
        setHideNotificationBanner: (show) => set({ hideNotificationBanner: show }),
        setPayrollSelectedDate: (date) => set({ payrollSelectedDate: date }),

        // Net pay visibility
        toggleNetPayVisibility: () => set((s) => ({ isNetPayVisible: !s.isNetPayVisible })),

        // Table preferences
        setColumnVisibility: (id, visible) =>
          set((s) => ({ columnVisibility: { ...s.columnVisibility, [id]: visible } })),
        setColumnVisibilityBatch: (visibility) =>
          set((s) => ({ columnVisibility: { ...s.columnVisibility, ...visibility } })),

        // Selection helpers
        selectRow: (id) =>
          set((s) => (s.selectedRowIds.includes(id) ? s : { selectedRowIds: [...s.selectedRowIds, id] })),
        deselectRow: (id) => set((s) => ({ selectedRowIds: s.selectedRowIds.filter((x) => x !== id) })),
        setSelection: (ids) => set({ selectedRowIds: [...new Set(ids)] }),
        clearSelection: () => set({ selectedRowIds: [] }),

        // Reset non-persisted UI
        resetUI: () =>
          set((s) => ({
            ...s,
            showSetupModal: initialState.showSetupModal,
            showFundWalletModal: initialState.showFundWalletModal,
            showScheduleDrawer: initialState.showScheduleDrawer,
            showPayrollDrawer: initialState.showPayrollDrawer,
            showAddEmployeeModal: initialState.showAddEmployeeModal,
            selectedRowIds: initialState.selectedRowIds,
          })),
      }),
      {
        name: "payroll-ui-store",
        version: 1,
        storage: createJSONStorage(() => localStorage),
        // Persist only long-lived, user-preference-like values
        partialize: (s) => ({
          isNetPayVisible: s.isNetPayVisible,
          columnVisibility: s.columnVisibility,
        }),
      },
    ),
    { name: "payroll-ui" },
  ),
);

export type { PayrollUIState as PayrollState, PayrollUIActions as PayrollActions };
