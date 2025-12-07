// Shared aliases
export type ActiveStatus = "active" | "inactive";
export type ValueType = "percentage" | "fixed";
export type BonusDeductionKind = "bonus" | "deduction";
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
  status: "idle" | "completed" | "disbursed" | "awaiting";
}

export interface BonusDeduction {
  id: string;
  name: string;
  valueType?: ValueType;
  value: number;
  status: ActiveStatus;
  type: BonusDeductionKind;
  createdAt: Date;
  updatedAt: Date;
}

export interface BonusDeductionFormData {
  name: string;
  valueType: ValueType;
  value: number;
  status: boolean;
  type: BonusDeductionKind;
}

export interface BonusDeductionTableProperties {
  items: BonusDeduction[];
  type: BonusDeductionKind;
  onAdd: (event: React.BaseSyntheticEvent) => void;
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
  frequency: string;
  currency: string;
  status: "incomplete" | "complete"; // assuming possible statuses
  bonuses: PayrollBonusDeduction[];
  deductions: PayrollBonusDeduction[];
  approvers: string[]; // assuming array of user IDs or emails
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: ISODateString; // ISO date string
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
export type PayslipStatus = "pending" | "draft" | "failed" | "paid" | "cancelled";

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
