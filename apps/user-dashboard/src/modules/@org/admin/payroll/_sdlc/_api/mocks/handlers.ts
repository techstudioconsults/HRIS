import { http, HttpResponse, delay } from 'msw';
import {
  mockPayrollPolicy,
  mockCompanyWallet,
  mockPayrolls,
  mockPayslipsByPayroll,
  mockApprovals,
  MOCK_POLICY_ID,
} from './mock-data';

// ─── Inline types ─────────────────────────────────────────────────────────────
// Mirrors types/index.ts — not imported to avoid circular dependency in mocks.

type PayrollStatus =
  | 'idle'
  | 'awaiting'
  | 'disbursed'
  | 'completed'
  | 'partially_completed'
  | 'failed';
type PayslipStatus = 'pending' | 'processing' | 'paid' | 'failed';
type ValueType = 'percentage' | 'fixed';
type ActiveStatus = 'active' | 'inactive';

interface AdjustmentItem {
  id: string;
  name: string;
  type: ValueType;
  amount: number;
  status: ActiveStatus;
}

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

interface Payroll extends Record<string, unknown> {
  id: string;
  policyId: string;
  netPay: number;
  employeesInPayroll: number;
  paymentDate: string;
  status: PayrollStatus;
  walletBalance?: number;
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

// ─── Known employee stubs for payslip creation lookup ─────────────────────────

const knownEmployeeStubs: Record<string, PayslipEmployee> = {
  emp_01: {
    id: 'emp_01',
    name: 'Amara Okafor',
    avatar: '',
    team: { id: 'team_engineering', name: 'Engineering' },
    role: { id: 'role_senior_swe', name: 'Senior Software Engineer' },
    workMode: 'onsite',
    employmentType: 'full time',
    status: 'active',
  },
  emp_02: {
    id: 'emp_02',
    name: 'Chidi Eze',
    avatar: '',
    team: { id: 'team_finance', name: 'Finance' },
    role: { id: 'role_payroll_officer', name: 'Payroll Officer' },
    workMode: 'onsite',
    employmentType: 'full time',
    status: 'active',
  },
};

function resolveEmployeeStub(employeeId: string): PayslipEmployee {
  return (
    knownEmployeeStubs[employeeId] ?? {
      id: employeeId,
      name: 'Unknown Employee',
      avatar: '',
      team: { id: 'team_unknown', name: 'Unknown' },
      role: { id: 'role_unknown', name: 'Unknown' },
      workMode: 'onsite',
      employmentType: 'full time',
      status: 'active',
    }
  );
}

// ─── Compute current-month 25th for default paymentDate ───────────────────────

function currentMonthPayday(): string {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 25)
  ).toISOString();
}

// ─── Mutable in-memory state ──────────────────────────────────────────────────

let payrollsDb: Payroll[] = [...mockPayrolls];
let payslipsDb: Payslip[] = Object.values(mockPayslipsByPayroll).flat();

// ─── Handler factory ──────────────────────────────────────────────────────────
// Accepts a base URL so the same handler logic works for both:
//   - Browser worker: full API origin (e.g. https://hrdev.techstudioacademy.com/api/v1)
//   - Test setupServer: relative path (/api/v1) resolved against localhost

export function createPayrollHandlers(base: string) {
  // Reset in-memory state on each factory call so tests are isolated
  payrollsDb = [...mockPayrolls];
  payslipsDb = Object.values(mockPayslipsByPayroll).flat();

  return [
    // 1. GET /payroll-policy/company
    http.get(`${base}/payroll-policy/company`, async () => {
      await delay(250);
      return HttpResponse.json({ data: mockPayrollPolicy });
    }),

    // 2. GET /wallets/company
    http.get(`${base}/wallets/company`, async () => {
      await delay(200);
      return HttpResponse.json({ data: mockCompanyWallet });
    }),

    // 3. GET /payrolls
    http.get(`${base}/payrolls`, async () => {
      await delay(300);
      return HttpResponse.json({ data: payrollsDb });
    }),

    // 4. GET /payrolls/:id
    http.get(`${base}/payrolls/:id`, async ({ params }) => {
      await delay(200);
      const foundPayroll = payrollsDb.find(
        (payroll) => payroll.id === params.id
      );
      if (!foundPayroll) {
        return HttpResponse.json(
          {
            title: 'Not Found',
            status: 404,
            message: `Payroll '${params.id}' not found`,
          },
          { status: 404 }
        );
      }
      return HttpResponse.json({ data: foundPayroll });
    }),

    // 5. POST /payrolls — generate a new payroll
    http.post(`${base}/payrolls`, async ({ request }) => {
      await delay(400);
      const body = (await request.json()) as {
        payrollPolicyId?: string;
        paymentDate?: string;
      };

      const newPayroll: Payroll = {
        id: `payroll_${Date.now()}`,
        policyId: body.payrollPolicyId ?? MOCK_POLICY_ID,
        paymentDate: body.paymentDate ?? currentMonthPayday(),
        status: 'idle',
        netPay: 0,
        employeesInPayroll: 0,
        walletBalance: mockCompanyWallet.balance,
      };

      payrollsDb = [...payrollsDb, newPayroll];

      return HttpResponse.json({ data: newPayroll }, { status: 201 });
    }),

    // 6. PATCH /payrolls/:id — reschedule payment date
    http.patch(`${base}/payrolls/:id`, async ({ params, request }) => {
      await delay(300);
      const body = (await request.json()) as { paymentDate: string };

      const payrollIndex = payrollsDb.findIndex(
        (payroll) => payroll.id === params.id
      );
      if (payrollIndex === -1) {
        return HttpResponse.json(
          {
            title: 'Not Found',
            status: 404,
            message: `Payroll '${params.id}' not found`,
          },
          { status: 404 }
        );
      }

      const updatedPayroll: Payroll = {
        ...payrollsDb[payrollIndex],
        paymentDate: body.paymentDate,
      };

      payrollsDb = [
        ...payrollsDb.slice(0, payrollIndex),
        updatedPayroll,
        ...payrollsDb.slice(payrollIndex + 1),
      ];

      return HttpResponse.json({ data: updatedPayroll });
    }),

    // 7. POST /payrolls/:id/run — run payroll (transitions to awaiting)
    http.post(`${base}/payrolls/:id/run`, async ({ params }) => {
      await delay(500);

      const payrollIndex = payrollsDb.findIndex(
        (payroll) => payroll.id === params.id
      );
      if (payrollIndex === -1) {
        return HttpResponse.json(
          {
            title: 'Not Found',
            status: 404,
            message: `Payroll '${params.id}' not found`,
          },
          { status: 404 }
        );
      }

      const updatedPayroll: Payroll = {
        ...payrollsDb[payrollIndex],
        status: 'awaiting',
      };

      payrollsDb = [
        ...payrollsDb.slice(0, payrollIndex),
        updatedPayroll,
        ...payrollsDb.slice(payrollIndex + 1),
      ];

      return HttpResponse.json(
        { data: { success: true, payroll: updatedPayroll } },
        { status: 201 }
      );
    }),

    // 8. GET /payrolls/:id/approvals
    http.get(`${base}/payrolls/:id/approvals`, async ({ params }) => {
      await delay(200);
      const approvals = params.id === 'payroll_may_2026' ? mockApprovals : [];
      return HttpResponse.json({ data: approvals });
    }),

    // 9. GET /payslips?payrollId=...
    http.get(`${base}/payslips`, async ({ request }) => {
      await delay(300);
      const url = new URL(request.url);
      const payrollId = url.searchParams.get('payrollId') ?? '';
      const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
      const limit = Math.max(1, Number(url.searchParams.get('limit') ?? '10'));

      const filteredPayslips = payrollId
        ? payslipsDb.filter((payslip) => payslip.payrollId === payrollId)
        : payslipsDb;

      const total = filteredPayslips.length;
      const startIndex = (page - 1) * limit;
      const pageItems = filteredPayslips.slice(startIndex, startIndex + limit);

      return HttpResponse.json({
        data: {
          items: pageItems,
          total,
          page,
          limit,
        },
      });
    }),

    // 10. POST /payslips — create a single payslip for an employee
    http.post(`${base}/payslips`, async ({ request }) => {
      await delay(400);
      const body = (await request.json()) as {
        payrollId: string;
        employeeId: string;
      };

      const existingPayslip = payslipsDb.find(
        (payslip) =>
          payslip.payrollId === body.payrollId &&
          payslip.payProfileId === body.employeeId
      );

      if (existingPayslip) {
        return HttpResponse.json(
          {
            title: 'Conflict',
            status: 409,
            message: `A payslip already exists for employee '${body.employeeId}' in payroll '${body.payrollId}'`,
          },
          { status: 409 }
        );
      }

      const relatedPayroll = payrollsDb.find(
        (payroll) => payroll.id === body.payrollId
      );
      const resolvedPaymentDate =
        typeof relatedPayroll?.paymentDate === 'string'
          ? relatedPayroll.paymentDate
          : new Date().toISOString();

      const employeeStub = resolveEmployeeStub(body.employeeId);

      const newPayslip: Payslip = {
        id: `payslip_${Date.now()}`,
        payProfileId: body.employeeId,
        payrollId: body.payrollId,
        status: 'pending',
        paymentDate: resolvedPaymentDate,
        baseSalary: 600_000,
        grossPay: 650_000,
        netPay: 560_000,
        bonuses: [],
        deductions: [],
        totalBonuses: 0,
        totalDeductions: 90_000,
        employee: employeeStub,
      };

      payslipsDb = [...payslipsDb, newPayslip];

      return HttpResponse.json({ data: newPayslip }, { status: 201 });
    }),
  ];
}

// Default export uses relative paths — correct for test environments (msw/node setupServer)
export const payrollHandlers = createPayrollHandlers('/api/v1');
