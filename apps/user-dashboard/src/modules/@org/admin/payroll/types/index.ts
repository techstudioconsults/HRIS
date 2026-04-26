// Shared aliases
export type ActiveStatus = 'active' | 'inactive';
export type ValueType = 'percentage' | 'fixed';
export type BonusDeductionKind = 'bonus' | 'deduction';
export type ISODateString = string;

export interface NamedEntity {
  id: string;
  name: string;
}

// Common adjustment item used across payslips and policies
export interface AdjustmentItem {
  id: string;
  name: string;
  type: ValueType; // amount type
  amount: number;
  status: ActiveStatus;
}

export interface Payroll extends Record<string, unknown> {
  id: string;
  policyId: string;
  netPay: number;
  employeesInPayroll: number;
  paymentDate: string;
  status:
    | 'idle'
    | 'awaiting'
    | 'disbursed'
    | 'completed'
    | 'partially_completed'
    | 'failed';
}

export interface BonusDeduction {
  id: string;
  name: string;
  valueType?: ValueType;
  value: number;
  status: ActiveStatus;
  type: BonusDeductionKind;
  createdAt: string;
  updatedAt: string;
}

export interface BonusDeductionFormData {
  name: string;
  valueType: ValueType;
  value: number;
  status: boolean;
  type: BonusDeductionKind;
}

export interface FundWalletFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface FundWalletFormModalProperties {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onFundWallet?: () => void;
  initialData?: FundWalletFormData;
  isGeneratePayrollBannerShowing?: boolean;
}

export interface BonusDeductionFormModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BonusDeductionFormData) => void;
  type: BonusDeductionKind;
  initialData?: BonusDeductionFormData;
  isEditing?: boolean;
}

export interface BonusDeductionManagerProperties {
  type: BonusDeductionKind;
  initialItems?: BonusDeduction[];
  onChange?: (items: BonusDeduction[]) => void;
  policyId?: string;
  profileId?: string;
}

export interface BonusDeductionTableProperties {
  items: BonusDeduction[];
  type: BonusDeductionKind;
  onAdd: () => void;
  onEdit: (id: string, data: BonusDeductionFormData) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export interface PayrollSummary extends Record<string, unknown> {
  id: string;
  name: string;
  role: string;
  grossPay: number;
  netPay: number;
  deduction: number;
  bonus: number;
  status: string;
}

// Reuse the adjustment item for company policy
export type PayrollBonusDeduction = AdjustmentItem;

export interface CompanyPayrollPolicy {
  id: string;
  companyId: string;
  payday: number;
  frequency: 'monthly' | 'weekly' | 'bi-weekly';
  currency: string;
  status: 'incomplete' | 'complete';
  bonuses: PayrollBonusDeduction[];
  deductions: PayrollBonusDeduction[];
  approvers: Array<{ id: string; name: string; avatar: string; role: string }>;
  createdAt: ISODateString;
}

export interface CompanyWallet {
  id: string;
  companyId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  balance: number;
}

// Define Payslip domain types based on provided object
export type PayslipStatus = 'pending' | 'processing' | 'paid' | 'failed';

// Payslip adjustments reuse the common adjustment item
export type PayslipBonus = AdjustmentItem;

export type PayslipDeduction = AdjustmentItem;

export type PayslipTeam = NamedEntity;

export type PayslipRole = NamedEntity;

export interface PayslipEmployee {
  id: string;
  name: string;
  avatar: string;
  team: PayslipTeam;
  role: PayslipRole;
  workMode: string; // e.g., "onsite" | "remote" | "hybrid"
  employmentType: string; // e.g., "full time" | "contract"
  status: string; // e.g., "active" | "inactive"
}

export interface Payslip extends Record<string, unknown> {
  id: string;
  payProfileId: string;
  payrollId: string;
  status: PayslipStatus;
  paymentDate: ISODateString; // ISO date
  netPay: number;
  grossPay: number;
  baseSalary: number;
  bonuses: PayslipBonus[];
  deductions: PayslipDeduction[];
  totalBonuses: number;
  totalDeductions: number;
  employee: PayslipEmployee;
}

export interface PayrollApproval extends Record<string, unknown> {
  status: string;
  payrollId: string;
  employee: {
    id: string;
    name: string;
    avatar: string | null;
  };
  approvedAt: string;
}

// ─── Component prop types ─────────────────────────────────────────────────────

export interface ApprovalProgressModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPayrollId: string;
  approvals: PayrollApproval[];
  isApprovalsLoading: boolean;
}

export interface CalendarModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  onContinue?: (date: Date | undefined) => void;
  /** Indicates if the schedule action is currently submitting */
  isSubmitting?: boolean;
}

export interface DevApprovalActionsModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPayrollId: string;
}

export interface PayslipDetailsDialogProperties {
  payrollId?: string | null;
  payslipId?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface PayslipLineItemsProperties {
  title: string;
  items: Array<{
    id: string;
    label: string;
    amount: number;
    tone?: 'default' | 'positive' | 'negative';
  }>;
  totalLabel: string;
  totalAmount: number;
}

export interface EmployeeInformationDrawerProperties {
  payrollId?: string | null;
}

/** Payslip row used in the history table (payrollId may differ from the active one) */
export type PayslipRow = Payslip & {
  payrollId?: string;
};

export interface SchedulePayrollDrawerProperties {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  payrollId: string | null;
  summary?: Payroll;
  canRunNow?: boolean;
}

/**
 * Shared filter shape used by both the payroll filter form and the
 * add-employee drawer. If shapes ever diverge, split into distinct types.
 */
export interface PayrollFilterValues {
  search?: string;
  teamId?: string;
  roleId?: string;
  status?: string;
  sortBy?: string;
  limit?: string;
  page?: string;
}

/** Local helpers for the filter-form teams prop */
export interface PayrollFilterRole {
  id: string;
  name: string;
}

export interface PayrollFilterTeam {
  id: string;
  name: string;
  roles: PayrollFilterRole[];
}

export interface AddEmployeeDrawerProperties {
  payrollId: string | null;
  hasPayslips: boolean;
}

export interface EmployeeInformationProperties {
  payslip?: Payslip | null;
}

export interface PayrollNotificationBannerProps {
  hasCompletedPayrollPolicySetupForm: boolean;
  payrollPolicyStatus: boolean;
  walletSetupCompleted: boolean;
  showNoPayrollBanner: boolean;
  isCreatingPayroll: boolean;
  onSetupWallet: () => void;
  onFundWallet: () => void;
  onGeneratePayroll: () => void;
  onDismissNoPayrollBanner: () => void;
  showPayrollBanner: boolean;
  shouldShowApprovalProgressBanner: boolean;
  approvalBannerDateLabel: string;
  isDisbursed: boolean;
  nextScheduledPayroll: Payroll | null;
  payrollDataPaymentDate: string;
  walletBalance: number;
  onOpenApprovalProgress: () => void;
}

// ─── Internal utility types ───────────────────────────────────────────────────

/** Row type for the bonus/deduction table (supports generic Record access) */
export type BonusDeductionRow = BonusDeduction & Record<string, unknown>;

/**
 * Extends the common adjustment item with optional backend field variants
 * (amount vs value, createdAt/updatedAt) to avoid casting when mapping API data.
 */
export type APIBonusDeduction = PayrollBonusDeduction & {
  createdAt?: string;
  updatedAt?: string;
  /** Backend may return `amount` instead of `value` */
  amount?: number;
  value?: number;
};

export type PayrollSetupFormValues = {
  payday: string;
  frequency: string;
  currency?: string;
  approvers: string[];
};

/**
 * API entity shape returned from bonus/deduction mutation responses.
 * Kept loose to accommodate varying backend field names across create/update operations.
 */
export type PayrollAPIEntity = {
  id?: string;
  name?: string;
  amount?: number;
  type?: 'fixed' | 'percentage';
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Narrowed payroll shape used in the schedule-payroll list view.
 * Extends Payroll with optional display-only fields (name, role, grossPay, bonus, deduction).
 */
export type ListPayroll = Pick<
  Payroll,
  'id' | 'policyId' | 'netPay' | 'employeesInPayroll' | 'paymentDate'
> & {
  status?: string;
  name?: string;
  role?: string;
  grossPay?: number;
  bonus?: number;
  deduction?: number;
};

// ─── Test-only types ──────────────────────────────────────────────────────────

export type RunProgress = {
  runId: string | null;
  progress: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
  errorMessage: string | null;
};

export type PayrollRunStore = RunProgress & {
  setProgress: (runId: string, progress: number) => void;
  setCompleted: (runId: string) => void;
  setError: (runId: string, message: string) => void;
  reset: () => void;
};

// ─── SSE event registry ───────────────────────────────────────────────────────

export const EventRegistry = {
  PAYROLL_APPROVE_REQUEST: 'payroll.approve.request',
  PAYROLL_APPROVED: 'payroll.approve.success',
  PAYROLL_REJECTED: 'payroll.approve.rejected',
  PAYROLL_COMPLETED: 'payroll.completed',
  PAYROLL_STATUS: 'payroll.status',
  SALARY_PAID: 'salary.paid',
  WALLET_CREATED_SUCCESS: 'wallet.created.success',
} as const;

export type EventNameType = (typeof EventRegistry)[keyof typeof EventRegistry];

// ─── Payroll UI store state & actions ─────────────────────────────────────────

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
  showEmployeeInformationDrawer: boolean;
  selectedPayslipId: string | null;
  /**
   * Indicates that the company wallet setup has just been completed
   * via the FundWalletFormModal flow.
   * Used as a one-shot signal to update other UI (e.g. enabling Fund Wallet button,
   * showing the "No payroll" banner) before the backend status catches up.
   */
  walletSetupCompleted: boolean;
  employeeInformationActiveTab:
    | 'employee-information'
    | 'salary-details'
    | 'payroll-history';
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
  setWalletSetupCompleted: (status: boolean) => void;
  setShowEmployeeInformationDrawer: (open: boolean) => void;
  setSelectedPayslipId: (id: string | null) => void;
  setEmployeeInformationActiveTab: (
    tab: 'employee-information' | 'salary-details' | 'payroll-history'
  ) => void;
  resetUI: () => void;
}
