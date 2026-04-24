import type { PayslipListItem, Payslip } from '../../_domain/models/entities';

// ---------------------------------------------------------------------------
// List items (lightweight — no line items)
// ---------------------------------------------------------------------------

export const mockPayslipListItems: PayslipListItem[] = [
  {
    id: 'ps_01',
    period: '2025-06',
    periodLabel: 'June 2025',
    netPay: 450000,
    status: 'FINALIZED',
    generatedAt: '2025-06-30T12:00:00Z',
  },
  {
    id: 'ps_02',
    period: '2025-05',
    periodLabel: 'May 2025',
    netPay: 448500,
    status: 'FINALIZED',
    generatedAt: '2025-05-31T12:00:00Z',
  },
  {
    id: 'ps_03',
    period: '2025-04',
    periodLabel: 'April 2025',
    netPay: 448500,
    status: 'FINALIZED',
    generatedAt: '2025-04-30T12:00:00Z',
  },
  {
    id: 'ps_04',
    period: '2025-03',
    periodLabel: 'March 2025',
    netPay: 445000,
    status: 'FINALIZED',
    generatedAt: '2025-03-31T12:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Full detail payslips (with line items)
// ---------------------------------------------------------------------------

export const mockPayslips: Record<string, Payslip> = {
  ps_01: {
    id: 'ps_01',
    employeeId: 'emp_01',
    period: '2025-06',
    periodLabel: 'June 2025',
    grossPay: 500000,
    totalDeductions: 50000,
    netPay: 450000,
    status: 'FINALIZED',
    earnings: [
      { id: 'el_01', label: 'Basic Salary', amount: 450000 },
      { id: 'el_02', label: 'Housing Allowance', amount: 50000 },
    ],
    deductions: [
      { id: 'dl_01', label: 'PAYE Tax', amount: 35000 },
      { id: 'dl_02', label: 'Pension (Employee)', amount: 15000 },
    ],
    generatedAt: '2025-06-30T12:00:00Z',
  },
  ps_02: {
    id: 'ps_02',
    employeeId: 'emp_01',
    period: '2025-05',
    periodLabel: 'May 2025',
    grossPay: 498500,
    totalDeductions: 50000,
    netPay: 448500,
    status: 'FINALIZED',
    earnings: [
      { id: 'el_03', label: 'Basic Salary', amount: 450000 },
      { id: 'el_04', label: 'Transport Allowance', amount: 48500 },
    ],
    deductions: [
      { id: 'dl_03', label: 'PAYE Tax', amount: 35000 },
      { id: 'dl_04', label: 'Pension (Employee)', amount: 15000 },
    ],
    generatedAt: '2025-05-31T12:00:00Z',
  },
};
