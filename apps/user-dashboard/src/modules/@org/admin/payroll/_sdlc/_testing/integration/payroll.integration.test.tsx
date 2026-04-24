import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse, delay } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { payrollHandlers } from '../fixtures/handlers';
import { mockPayrollRun, mockWallet } from '../fixtures/mock-data';

const server = setupServer(...payrollHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const BASE = '/api/v1/payroll';

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

// ─── Stub components (replace with real imports once implemented) ──────────────

function PayrollSetupStub() {
  const [data, setData] = React.useState<{
    payCycle?: string;
    payDay?: number;
  } | null>(null);
  React.useEffect(() => {
    fetch('/api/v1/payroll/setup')
      .then((r) => r.json())
      .then((j) => setData(j.data));
  }, []);
  if (!data) return <p>Loading…</p>;
  return (
    <div>
      <span data-testid="pay-cycle">{data.payCycle}</span>
      <span data-testid="pay-day">{data.payDay}</span>
    </div>
  );
}

function ApproveButtonStub({ runId }: { runId: string }) {
  const [status, setStatus] = React.useState('');
  const [error, setError] = React.useState('');

  async function handleApprove() {
    const res = await fetch(`/api/v1/payroll/run/${runId}/approve`, {
      method: 'POST',
    });
    if (res.status === 402) {
      const body = (await res.json()) as {
        code: string;
        required: number;
        available: number;
      };
      setError(
        `INSUFFICIENT_BALANCE: need ${body.required}, have ${body.available}`
      );
    } else {
      const body = (await res.json()) as { data: { status: string } };
      setStatus(body.data.status);
    }
  }

  return (
    <div>
      <button onClick={handleApprove}>Approve</button>
      {status && <p data-testid="run-status">{status}</p>}
      {error && <p data-testid="approve-error">{error}</p>}
    </div>
  );
}

function AdjustmentFormStub({ runId }: { runId: string }) {
  const [result, setResult] = React.useState('');
  const [fieldError, setFieldError] = React.useState('');

  async function submit(payload: object) {
    const res = await fetch(`/api/v1/payroll/run/${runId}/adjustments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status === 422) {
      const body = (await res.json()) as { code: string };
      setFieldError(body.code);
    } else {
      const body = (await res.json()) as { data: { id: string } };
      setResult(body.data.id);
    }
  }

  return (
    <div>
      <button
        onClick={() =>
          submit({
            employeeId: 'emp_01',
            type: 'BONUS',
            label: 'Q1 Bonus',
            amount: 50_000,
          })
        }
      >
        Add Bonus
      </button>
      <button
        onClick={() =>
          submit({
            employeeId: 'emp_01',
            type: 'DEDUCTION',
            label: 'Over-gross',
            amount: 9_999_999,
          })
        }
      >
        Add Exceeding Deduction
      </button>
      {result && <p data-testid="adj-id">{result}</p>}
      {fieldError && <p data-testid="field-error">{fieldError}</p>}
    </div>
  );
}

function WalletStub() {
  const [data, setData] = React.useState<{ balance?: number } | null>(null);
  const [fundResult, setFundResult] = React.useState<{
    reference?: string;
  } | null>(null);

  React.useEffect(() => {
    fetch('/api/v1/payroll/wallet')
      .then((r) => r.json())
      .then((j) => setData(j.data));
  }, []);

  async function fund() {
    const res = await fetch('/api/v1/payroll/wallet/fund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5_000_000 }),
    });
    const body = (await res.json()) as { data: { reference: string } };
    setFundResult(body.data);
  }

  return (
    <div>
      {data && <p data-testid="wallet-balance">{data.balance}</p>}
      <button onClick={fund}>Fund Wallet</button>
      {fundResult && <p data-testid="fund-reference">{fundResult.reference}</p>}
    </div>
  );
}

import React from 'react';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Payroll setup', () => {
  it('displays pay cycle and pay day on load', async () => {
    render(<PayrollSetupStub />, { wrapper });
    await waitFor(() =>
      expect(screen.getByTestId('pay-cycle')).toHaveTextContent('MONTHLY')
    );
    expect(screen.getByTestId('pay-day')).toHaveTextContent('28');
  });
});

describe('Approve payroll run', () => {
  it('shows approved status on success', async () => {
    const user = userEvent.setup();
    render(<ApproveButtonStub runId={mockPayrollRun.id} />, { wrapper });
    await user.click(screen.getByRole('button', { name: /approve/i }));
    await waitFor(() =>
      expect(screen.getByTestId('run-status')).toHaveTextContent('approved')
    );
  });

  it('shows INSUFFICIENT_BALANCE error when wallet is too low', async () => {
    server.use(
      http.post(`${BASE}/run/${mockPayrollRun.id}/approve`, async () => {
        await delay(50);
        return HttpResponse.json(
          {
            code: 'INSUFFICIENT_BALANCE',
            required: 30_000_000,
            available: mockWallet.balance,
          },
          { status: 402 }
        );
      })
    );
    const user = userEvent.setup();
    render(<ApproveButtonStub runId={mockPayrollRun.id} />, { wrapper });
    await user.click(screen.getByRole('button', { name: /approve/i }));
    await waitFor(() =>
      expect(screen.getByTestId('approve-error')).toHaveTextContent(
        'INSUFFICIENT_BALANCE'
      )
    );
  });
});

describe('Adjustment form', () => {
  it('creates a bonus adjustment successfully', async () => {
    const user = userEvent.setup();
    render(<AdjustmentFormStub runId={mockPayrollRun.id} />, { wrapper });
    await user.click(screen.getByRole('button', { name: /add bonus/i }));
    await waitFor(() =>
      expect(screen.getByTestId('adj-id')).toBeInTheDocument()
    );
  });

  it('shows EXCEEDS_GROSS field error when backend returns 422', async () => {
    server.use(
      http.post(`${BASE}/run/:id/adjustments`, async () => {
        await delay(50);
        return HttpResponse.json(
          { code: 'EXCEEDS_GROSS', title: 'Exceeds gross pay' },
          { status: 422 }
        );
      })
    );
    const user = userEvent.setup();
    render(<AdjustmentFormStub runId={mockPayrollRun.id} />, { wrapper });
    await user.click(
      screen.getByRole('button', { name: /add exceeding deduction/i })
    );
    await waitFor(() =>
      expect(screen.getByTestId('field-error')).toHaveTextContent(
        'EXCEEDS_GROSS'
      )
    );
  });
});

describe('Wallet', () => {
  it('displays wallet balance on load', async () => {
    render(<WalletStub />, { wrapper });
    await waitFor(() =>
      expect(screen.getByTestId('wallet-balance')).toHaveTextContent(
        String(mockWallet.balance)
      )
    );
  });

  it('shows fund reference after funding', async () => {
    const user = userEvent.setup();
    render(<WalletStub />, { wrapper });
    await waitFor(() => screen.getByTestId('wallet-balance'));
    await user.click(screen.getByRole('button', { name: /fund wallet/i }));
    await waitFor(() =>
      expect(screen.getByTestId('fund-reference')).toHaveTextContent(/FND-/)
    );
  });
});
