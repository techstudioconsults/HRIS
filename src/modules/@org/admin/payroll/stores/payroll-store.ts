import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface PayrollUIState {
  showPayrollSettingsSetupModal: boolean;
  hasCompletedPayrollPolicySetupForm: boolean;
  showFundWalletFormModal: boolean;
  showSchedulePayrollDrawer: boolean;
  showRunPayrollDrawer: boolean;
  showAddEmployeeToPayrollModal: boolean;
  hidePayrollNotificationBanner?: boolean;
  payrollSelectedDate?: Date;
  showFundWalletAccountModal: boolean;
}

export interface PayrollUIActions {
  setShowPayrollSettingsSetupModal: (open: boolean) => void;
  setShowFundWalletFormModal: (open: boolean) => void;
  setShowSchedulePayrollDrawer: (open: boolean) => void;
  setShowPayrollDrawer: (open: boolean) => void;
  setShowAddEmployeeModal: (open: boolean) => void;
  setHideNotificationBanner: (show: boolean) => void;
  setPayrollSelectedDate: (date: Date | undefined) => void;
  setShowFundWalletAccountModal: (open: boolean) => void;
  setHasCompletedPayrollPolicySetupForm: (status: boolean) => void;
  resetUI: () => void;
}

const initialState: PayrollUIState = {
  showPayrollSettingsSetupModal: false,
  showFundWalletFormModal: false,
  showSchedulePayrollDrawer: false,
  showRunPayrollDrawer: false,
  showAddEmployeeToPayrollModal: false,
  hidePayrollNotificationBanner: true,
  payrollSelectedDate: undefined,
  showFundWalletAccountModal: false,
  hasCompletedPayrollPolicySetupForm: false,
};

export const usePayrollStore = create<PayrollUIState & PayrollUIActions>()(
  devtools(
    (set) => ({
      ...initialState,
      setShowPayrollSettingsSetupModal: (open) => set({ showPayrollSettingsSetupModal: open }),
      setShowFundWalletFormModal: (open) => set({ showFundWalletFormModal: open }),
      setShowSchedulePayrollDrawer: (open) => set({ showSchedulePayrollDrawer: open }),
      setShowPayrollDrawer: (open) => set({ showRunPayrollDrawer: open }),
      setShowAddEmployeeModal: (open) => set({ showAddEmployeeToPayrollModal: open }),
      setHideNotificationBanner: (show) => set({ hidePayrollNotificationBanner: show }),
      setPayrollSelectedDate: (date) => set({ payrollSelectedDate: date }),
      setShowFundWalletAccountModal: (open) => set({ showFundWalletAccountModal: open }),
      setHasCompletedPayrollPolicySetupForm: (status) => set({ hasCompletedPayrollPolicySetupForm: status }),

      resetUI: () => set(initialState),
    }),
    { name: "payroll-ui" },
  ),
);

export type { PayrollUIState as PayrollState, PayrollUIActions as PayrollActions };
