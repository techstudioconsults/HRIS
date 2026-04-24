import type { PayslipListItem, Payslip } from '../../_domain/models/entities';

export const fixturePayslipListItems: PayslipListItem[] = [
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
];

export const fixturePayslipDetail: Payslip = {
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
};
