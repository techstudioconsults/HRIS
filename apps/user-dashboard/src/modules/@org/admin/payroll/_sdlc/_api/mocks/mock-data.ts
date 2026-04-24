import type {
  PayrollRun,
  RosterEntry,
  Payslip,
  WalletBalance,
  WalletTransaction,
} from '@/modules/@org/admin/payroll/types';

export const mockPayrollSetup = {
  organisationId: 'org_01',
  setupComplete: true,
  payCycle: 'MONTHLY' as const,
  payDay: 28,
  bankName: 'First Bank of Nigeria',
  accountName: 'Techstudio Academy Ltd',
  accountNumber: '0123456789',
};

export const mockPayrollRun: PayrollRun = {
  id: 'run_01',
  organisationId: 'org_01',
  periodStart: '2026-04-01',
  periodEnd: '2026-04-30',
  payDay: '2026-04-28',
  status: 'completed',
  totalGross: 25_000_000,
  totalDeductions: 5_200_000,
  totalNet: 19_800_000,
  employeeCount: 6,
  initiatedBy: 'admin_01',
  createdAt: '2026-04-25T09:00:00Z',
  updatedAt: '2026-04-25T09:45:00Z',
};

export const mockRosterEntries: RosterEntry[] = [
  {
    employeeId: 'emp_01',
    employeeNumber: 'ORG-0001',
    firstName: 'Amara',
    lastName: 'Okafor',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    grossPay: 650_000,
    deductions: [
      { category: 'PAYE', label: 'PAYE Tax', amount: 48_750 },
      { category: 'PENSION', label: 'Pension (8%)', amount: 52_000 },
    ],
    bonuses: [],
    netPay: 549_250,
    status: 'processed',
  },
  {
    employeeId: 'emp_02',
    employeeNumber: 'ORG-0002',
    firstName: 'Chidi',
    lastName: 'Eze',
    department: 'Finance',
    role: 'Payroll Officer',
    grossPay: 450_000,
    deductions: [
      { category: 'PAYE', label: 'PAYE Tax', amount: 33_750 },
      { category: 'PENSION', label: 'Pension (8%)', amount: 36_000 },
    ],
    bonuses: [{ label: 'Performance Bonus', amount: 50_000 }],
    netPay: 430_250,
    status: 'processed',
  },
];

export const mockPayslip: Payslip = {
  id: 'payslip_01',
  runId: 'run_01',
  employeeId: 'emp_01',
  employeeName: 'Amara Okafor',
  employeeNumber: 'ORG-0001',
  periodStart: '2026-04-01',
  periodEnd: '2026-04-30',
  grossPay: 650_000,
  deductions: [
    { category: 'PAYE', label: 'PAYE Tax', amount: 48_750 },
    { category: 'PENSION', label: 'Pension (8%)', amount: 52_000 },
  ],
  bonuses: [],
  netPay: 549_250,
  generatedAt: '2026-04-25T09:45:00Z',
};

export const mockWallet: WalletBalance = {
  organisationId: 'org_01',
  balance: 25_000_000,
  currency: 'NGN',
  lastFundedAt: '2026-04-20T10:00:00Z',
};

export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: 'txn_01',
    type: 'CREDIT',
    amount: 30_000_000,
    description: 'Wallet top-up',
    createdAt: '2026-04-20T10:00:00Z',
  },
  {
    id: 'txn_02',
    type: 'DEBIT',
    amount: 5_000_000,
    description: 'Payroll run — March 2026',
    referenceId: 'run_00',
    createdAt: '2026-03-28T14:00:00Z',
  },
];
