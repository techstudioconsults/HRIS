// ─── Inline types ─────────────────────────────────────────────────────────────
// Deliberately not imported from ../../types to avoid circular dependency in
// mock/test code. These mirror the canonical shapes in types/index.ts.

type ActiveStatus = 'active' | 'inactive';
type ValueType = 'percentage' | 'fixed';

interface AdjustmentItem {
  id: string;
  name: string;
  type: ValueType;
  amount: number;
  status: ActiveStatus;
}

interface Payroll extends Record<string, unknown> {
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
  walletBalance?: number;
}

interface CompanyPayrollPolicy {
  id: string;
  companyId: string;
  payday: number;
  frequency: 'monthly' | 'weekly' | 'bi-weekly';
  currency: string;
  status: 'incomplete' | 'complete';
  bonuses: AdjustmentItem[];
  deductions: AdjustmentItem[];
  approvers: Array<{ id: string; name: string; avatar: string; role: string }>;
  createdAt: string;
}

interface CompanyWallet {
  id: string;
  companyId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  balance: number;
}

type PayslipStatus = 'pending' | 'processing' | 'paid' | 'failed';

interface PayslipEmployee {
  id: string;
  name: string;
  avatar: string;
  team: { id: string; name: string };
  role: { id: string; name: string };
  workMode: string;
  employmentType: string;
  status: string;
}

interface Payslip extends Record<string, unknown> {
  id: string;
  payProfileId: string;
  payrollId: string;
  status: PayslipStatus;
  paymentDate: string;
  netPay: number;
  grossPay: number;
  baseSalary: number;
  bonuses: AdjustmentItem[];
  deductions: AdjustmentItem[];
  totalBonuses: number;
  totalDeductions: number;
  employee: PayslipEmployee;
}

interface PayrollApproval extends Record<string, unknown> {
  status: string;
  payrollId: string;
  employee: { id: string; name: string; avatar: string | null };
  approvedAt: string;
  approverRole?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const MOCK_POLICY_ID = 'policy_01';

// ─── Policy & Wallet ──────────────────────────────────────────────────────────

export const mockPayrollPolicy: CompanyPayrollPolicy = {
  id: MOCK_POLICY_ID,
  companyId: 'company_01',
  payday: 25,
  frequency: 'monthly',
  currency: 'NGN',
  status: 'complete',
  bonuses: [
    {
      id: 'bonus_01',
      name: 'Performance Bonus',
      type: 'fixed',
      amount: 50_000,
      status: 'active',
    },
  ],
  deductions: [
    {
      id: 'deduction_01',
      name: 'Pension',
      type: 'percentage',
      amount: 8,
      status: 'active',
    },
  ],
  approvers: [
    {
      id: 'approver_01',
      name: 'Ngozi Adeyemi',
      avatar: '',
      role: 'HR Director',
    },
    {
      id: 'approver_02',
      name: 'Chidi Eze',
      avatar: '',
      role: 'Finance Manager',
    },
  ],
  createdAt: '2026-01-15T08:00:00.000Z',
};

export const mockCompanyWallet: CompanyWallet = {
  id: 'wallet_01',
  companyId: 'company_01',
  accountName: 'Techstudio Academy Ltd',
  accountNumber: '1234567890',
  bankName: 'First Bank',
  balance: 50_000_000,
};

// ─── Payrolls ─────────────────────────────────────────────────────────────────

export const mockPayrolls: Payroll[] = [
  {
    id: 'payroll_feb_2026',
    policyId: MOCK_POLICY_ID,
    paymentDate: '2026-02-25T00:00:00.000Z',
    status: 'completed',
    netPay: 4_200_000,
    employeesInPayroll: 6,
    walletBalance: 50_000_000,
  },
  {
    id: 'payroll_mar_2026',
    policyId: MOCK_POLICY_ID,
    paymentDate: '2026-03-25T00:00:00.000Z',
    status: 'completed',
    netPay: 4_350_000,
    employeesInPayroll: 6,
    walletBalance: 50_000_000,
  },
  {
    id: 'payroll_apr_2026',
    policyId: MOCK_POLICY_ID,
    paymentDate: '2026-04-25T00:00:00.000Z',
    status: 'partially_completed',
    netPay: 4_180_000,
    employeesInPayroll: 5,
    walletBalance: 50_000_000,
  },
  {
    id: 'payroll_may_2026',
    policyId: MOCK_POLICY_ID,
    paymentDate: '2026-05-25T00:00:00.000Z',
    status: 'idle',
    netPay: 4_500_000,
    employeesInPayroll: 6,
    walletBalance: 50_000_000,
  },
];

// ─── Employee stubs ───────────────────────────────────────────────────────────

const employeeAmaraOkafor: PayslipEmployee = {
  id: 'emp_01',
  name: 'Amara Okafor',
  avatar: '',
  team: { id: 'team_engineering', name: 'Engineering' },
  role: { id: 'role_senior_swe', name: 'Senior Software Engineer' },
  workMode: 'onsite',
  employmentType: 'full time',
  status: 'active',
};

const employeeChidiEze: PayslipEmployee = {
  id: 'emp_02',
  name: 'Chidi Eze',
  avatar: '',
  team: { id: 'team_finance', name: 'Finance' },
  role: { id: 'role_payroll_officer', name: 'Payroll Officer' },
  workMode: 'onsite',
  employmentType: 'full time',
  status: 'active',
};

// ─── Payslip builder helper ───────────────────────────────────────────────────

function buildPayslip(
  id: string,
  payrollId: string,
  paymentDate: string,
  employee: PayslipEmployee,
  status: PayslipStatus
): Payslip {
  return {
    id,
    payProfileId: employee.id,
    payrollId,
    status,
    paymentDate,
    baseSalary: 600_000,
    grossPay: 650_000,
    netPay: 560_000,
    bonuses: [
      {
        id: 'bonus_01',
        name: 'Performance Bonus',
        type: 'fixed',
        amount: 50_000,
        status: 'active',
      },
    ],
    deductions: [
      {
        id: 'deduction_01',
        name: 'Pension',
        type: 'percentage',
        amount: 8,
        status: 'active',
      },
    ],
    totalBonuses: 50_000,
    totalDeductions: 90_000,
    employee,
  };
}

// ─── Payslips keyed by payrollId ──────────────────────────────────────────────

export const mockPayslipsByPayroll: Record<string, Payslip[]> = {
  payroll_feb_2026: [
    buildPayslip(
      'payslip_feb_emp01',
      'payroll_feb_2026',
      '2026-02-25T00:00:00.000Z',
      employeeAmaraOkafor,
      'paid'
    ),
    buildPayslip(
      'payslip_feb_emp02',
      'payroll_feb_2026',
      '2026-02-25T00:00:00.000Z',
      employeeChidiEze,
      'paid'
    ),
  ],
  payroll_mar_2026: [
    buildPayslip(
      'payslip_mar_emp01',
      'payroll_mar_2026',
      '2026-03-25T00:00:00.000Z',
      employeeAmaraOkafor,
      'paid'
    ),
    buildPayslip(
      'payslip_mar_emp02',
      'payroll_mar_2026',
      '2026-03-25T00:00:00.000Z',
      employeeChidiEze,
      'paid'
    ),
  ],
  payroll_apr_2026: [
    buildPayslip(
      'payslip_apr_emp01',
      'payroll_apr_2026',
      '2026-04-25T00:00:00.000Z',
      employeeAmaraOkafor,
      'paid'
    ),
    buildPayslip(
      'payslip_apr_emp02',
      'payroll_apr_2026',
      '2026-04-25T00:00:00.000Z',
      employeeChidiEze,
      'failed'
    ),
  ],
  payroll_may_2026: [
    buildPayslip(
      'payslip_may_emp01',
      'payroll_may_2026',
      '2026-05-25T00:00:00.000Z',
      employeeAmaraOkafor,
      'pending'
    ),
    buildPayslip(
      'payslip_may_emp02',
      'payroll_may_2026',
      '2026-05-25T00:00:00.000Z',
      employeeChidiEze,
      'pending'
    ),
  ],
};

// ─── Approvals ────────────────────────────────────────────────────────────────

export const mockApprovals: PayrollApproval[] = [
  {
    status: 'pending',
    payrollId: 'payroll_may_2026',
    employee: { id: 'approver_01', name: 'Ngozi Adeyemi', avatar: null },
    approvedAt: '',
    approverRole: 'HR Director',
  },
  {
    status: 'pending',
    payrollId: 'payroll_may_2026',
    employee: { id: 'approver_02', name: 'Chidi Eze', avatar: null },
    approvedAt: '',
    approverRole: 'Finance Manager',
  },
];
