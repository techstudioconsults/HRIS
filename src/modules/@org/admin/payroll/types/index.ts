export interface BonusDeduction {
  id: string;
  name: string;
  valueType: "percentage" | "fixed";
  value: number;
  status: "active" | "inactive";
  type: "bonus" | "deduction";
  createdAt: Date;
  updatedAt: Date;
}

export interface BonusDeductionFormData {
  name: string;
  valueType: "percentage" | "fixed";
  value: number;
  status: boolean;
  type: "bonus" | "deduction";
}

export interface BonusDeductionTableProperties {
  items: BonusDeduction[];
  type: "bonus" | "deduction";
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

export interface PayrollBonusDeduction {
  id: string;
  name: string;
  amount: number;
  type: "fixed" | "percentage";
  status: "active" | "inactive";
}

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
  createdAt: string; // ISO date string
}
