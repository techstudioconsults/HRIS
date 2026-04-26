import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { PayrollUIActions, PayrollUIState } from '../types';

export type { PayrollUIState, PayrollUIActions } from '../types';

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
  walletSetupCompleted: false,
  showEmployeeInformationDrawer: false,
  selectedPayslipId: null,
  employeeInformationActiveTab: 'employee-information',
};

export const usePayrollStore = create<PayrollUIState & PayrollUIActions>()(
  devtools(
    (set) => ({
      ...initialState,
      setShowPayrollSettingsSetupModal: (open) =>
        set({ showPayrollSettingsSetupModal: open }),
      setShowFundWalletFormModal: (open) =>
        set({ showFundWalletFormModal: open }),
      setShowSchedulePayrollDrawer: (open) =>
        set({ showSchedulePayrollDrawer: open }),
      setShowPayrollDrawer: (open) => set({ showRunPayrollDrawer: open }),
      setShowAddEmployeeModal: (open) =>
        set({ showAddEmployeeToPayrollModal: open }),
      setHideNotificationBanner: (show) =>
        set({ hidePayrollNotificationBanner: show }),
      setPayrollSelectedDate: (date) => set({ payrollSelectedDate: date }),
      setShowFundWalletAccountModal: (open) =>
        set({ showFundWalletAccountModal: open }),
      setHasCompletedPayrollPolicySetupForm: (status) =>
        set({ hasCompletedPayrollPolicySetupForm: status }),
      setWalletSetupCompleted: (status) =>
        set({ walletSetupCompleted: status }),
      setShowEmployeeInformationDrawer: (open) =>
        set({ showEmployeeInformationDrawer: open }),
      setSelectedPayslipId: (id) => set({ selectedPayslipId: id }),
      setEmployeeInformationActiveTab: (tab) =>
        set({ employeeInformationActiveTab: tab }),
      resetUI: () => set(initialState),
    }),
    { name: 'payroll-ui' }
  )
);

// Legacy aliases for backwards compatibility — prefer importing PayrollUIState / PayrollUIActions directly.
export type {
  PayrollUIState as PayrollState,
  PayrollUIActions as PayrollActions,
} from '../types';
