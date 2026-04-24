import { http, HttpResponse, delay } from 'msw';
import {
  mockPayrollSetup,
  mockPayrollRun,
  mockRosterEntries,
  mockPayslip,
  mockWallet,
  mockWalletTransactions,
} from './mock-data';

const BASE = '/api/v1/payroll';

export const payrollHandlers = [
  // Setup
  http.get(`${BASE}/setup`, async () => {
    await delay(200);
    return HttpResponse.json({ data: mockPayrollSetup });
  }),
  http.post(`${BASE}/setup`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ data: { ...mockPayrollSetup, ...body } });
  }),

  // Payroll run
  http.get(`${BASE}/run`, async () => {
    await delay(300);
    return HttpResponse.json({ data: mockPayrollRun });
  }),
  http.get(`${BASE}/run/:id`, async ({ params }) => {
    await delay(200);
    if (params.id !== mockPayrollRun.id) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404 },
        { status: 404 }
      );
    }
    return HttpResponse.json({ data: mockPayrollRun });
  }),
  http.post(`${BASE}/run`, async () => {
    await delay(500);
    const processing = {
      ...mockPayrollRun,
      id: `run_${Date.now()}`,
      status: 'processing' as const,
      totalGross: 0,
      totalDeductions: 0,
      totalNet: 0,
    };
    return HttpResponse.json({ data: processing }, { status: 201 });
  }),
  http.post(`${BASE}/run/:id/approve`, async ({ params }) => {
    await delay(600);
    if (params.id !== mockPayrollRun.id) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404 },
        { status: 404 }
      );
    }
    if (mockWallet.balance < mockPayrollRun.totalNet) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/insufficient-balance',
          title: 'Insufficient Balance',
          status: 402,
          code: 'INSUFFICIENT_BALANCE',
          required: mockPayrollRun.totalNet,
          available: mockWallet.balance,
        },
        { status: 402 }
      );
    }
    return HttpResponse.json({
      data: {
        ...mockPayrollRun,
        status: 'approved',
        approvedBy: 'admin_01',
        approvedAt: new Date().toISOString(),
      },
    });
  }),

  // Roster
  http.get(`${BASE}/run/:id/roster`, async () => {
    await delay(300);
    return HttpResponse.json({
      data: mockRosterEntries,
      total: mockRosterEntries.length,
      page: 1,
      size: 20,
      totalPages: 1,
    });
  }),
  http.get(`${BASE}/run/:id/payslip/:employeeId`, async ({ params }) => {
    await delay(200);
    if (params.employeeId !== mockPayslip.employeeId) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404 },
        { status: 404 }
      );
    }
    return HttpResponse.json({ data: mockPayslip });
  }),

  // Adjustments
  http.post(`${BASE}/run/:id/adjustments`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as {
      employeeId: string;
      type: string;
      label: string;
      amount: number;
    };
    const newAdj = {
      id: `adj_${Date.now()}`,
      runId: String(request.url).match(/run\/([^/]+)/)?.[1] ?? 'run_01',
      ...body,
      addedBy: 'admin_01',
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json({ data: newAdj }, { status: 201 });
  }),
  http.delete(`${BASE}/run/:id/adjustments/:adjustmentId`, async () => {
    await delay(300);
    return new HttpResponse(null, { status: 204 });
  }),

  // Wallet
  http.get(`${BASE}/wallet`, async () => {
    await delay(200);
    return HttpResponse.json({ data: mockWallet });
  }),
  http.get(`${BASE}/wallet/transactions`, async () => {
    await delay(200);
    return HttpResponse.json({
      data: mockWalletTransactions,
      total: 2,
      page: 1,
      size: 20,
      totalPages: 1,
    });
  }),
  http.post(`${BASE}/wallet/fund`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { amount: number };
    return HttpResponse.json({
      data: {
        reference: `FND-${Date.now()}`,
        bankName: 'First Bank of Nigeria',
        accountName: 'HRIS Wallet Account',
        accountNumber: '9876543210',
        amount: body.amount,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  }),
];
