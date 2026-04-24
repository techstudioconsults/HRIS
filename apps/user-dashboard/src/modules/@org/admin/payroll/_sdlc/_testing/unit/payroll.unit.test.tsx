import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import { act } from 'react';
import { create } from 'zustand';

// ─── Schemas under test ───────────────────────────────────────────────────────

const PayrollSetupSchema = z.object({
  payCycle: z.enum(['MONTHLY', 'BIWEEKLY', 'WEEKLY']),
  payDay: z.number().int().min(1).max(31),
  bankName: z.string().min(1),
  accountName: z.string().min(1),
  accountNumber: z.string().length(10),
});

const AdjustmentSchema = z.object({
  employeeId: z.string().min(1),
  type: z.enum(['BONUS', 'DEDUCTION']),
  label: z.string().min(1, 'Label is required'),
  amount: z.number().positive('Amount must be greater than zero'),
});

const FundWalletSchema = z.object({
  amount: z.number().positive('Amount must be greater than zero'),
});

// ─── Zustand store under test ─────────────────────────────────────────────────

type RunProgress = {
  runId: string | null;
  progress: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
  errorMessage: string | null;
};

type PayrollRunStore = RunProgress & {
  setProgress: (runId: string, progress: number) => void;
  setCompleted: (runId: string) => void;
  setError: (runId: string, message: string) => void;
  reset: () => void;
};

const createPayrollRunStore = () =>
  create<PayrollRunStore>((set) => ({
    runId: null,
    progress: 0,
    status: 'idle',
    errorMessage: null,
    setProgress: (runId, progress) =>
      set({ runId, progress, status: 'processing' }),
    setCompleted: (runId) => set({ runId, progress: 100, status: 'completed' }),
    setError: (runId, errorMessage) =>
      set({ runId, status: 'error', errorMessage }),
    reset: () =>
      set({ runId: null, progress: 0, status: 'idle', errorMessage: null }),
  }));

// ─── formatNaira util under test ──────────────────────────────────────────────

const formatNaira = (kobo: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
    kobo / 100
  );

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PayrollSetupSchema', () => {
  const valid = {
    payCycle: 'MONTHLY' as const,
    payDay: 28,
    bankName: 'First Bank',
    accountName: 'HRIS Ltd',
    accountNumber: '0123456789',
  };

  it('passes for valid input', () => {
    expect(() => PayrollSetupSchema.parse(valid)).not.toThrow();
  });

  it('fails when payCycle is missing', () => {
    const result = PayrollSetupSchema.safeParse({
      ...valid,
      payCycle: undefined,
    });
    expect(result.success).toBe(false);
  });

  it('fails when payDay is 0', () => {
    const result = PayrollSetupSchema.safeParse({ ...valid, payDay: 0 });
    expect(result.success).toBe(false);
  });

  it('fails when payDay is 32', () => {
    const result = PayrollSetupSchema.safeParse({ ...valid, payDay: 32 });
    expect(result.success).toBe(false);
  });

  it('fails when accountNumber is not 10 digits', () => {
    const result = PayrollSetupSchema.safeParse({
      ...valid,
      accountNumber: '12345',
    });
    expect(result.success).toBe(false);
  });
});

describe('AdjustmentSchema', () => {
  const validBonus = {
    employeeId: 'emp_01',
    type: 'BONUS' as const,
    label: 'Q1 Bonus',
    amount: 50_000,
  };
  const validDeduction = {
    employeeId: 'emp_01',
    type: 'DEDUCTION' as const,
    label: 'Loan repayment',
    amount: 10_000,
  };

  it('passes for a valid bonus', () => {
    expect(() => AdjustmentSchema.parse(validBonus)).not.toThrow();
  });

  it('passes for a valid deduction', () => {
    expect(() => AdjustmentSchema.parse(validDeduction)).not.toThrow();
  });

  it('fails when amount is zero', () => {
    const result = AdjustmentSchema.safeParse({ ...validBonus, amount: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.amount).toContain(
      'Amount must be greater than zero'
    );
  });

  it('fails when amount is negative', () => {
    const result = AdjustmentSchema.safeParse({ ...validBonus, amount: -500 });
    expect(result.success).toBe(false);
  });

  it('fails when label is empty', () => {
    const result = AdjustmentSchema.safeParse({ ...validBonus, label: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.label).toContain(
      'Label is required'
    );
  });
});

describe('FundWalletSchema', () => {
  it('passes for valid positive amount', () => {
    expect(() => FundWalletSchema.parse({ amount: 5_000_000 })).not.toThrow();
  });

  it('fails when amount is zero', () => {
    const result = FundWalletSchema.safeParse({ amount: 0 });
    expect(result.success).toBe(false);
  });

  it('fails when amount is negative', () => {
    const result = FundWalletSchema.safeParse({ amount: -1 });
    expect(result.success).toBe(false);
  });
});

describe('payrollRunStore', () => {
  let store: ReturnType<typeof createPayrollRunStore>;

  beforeEach(() => {
    store = createPayrollRunStore();
  });

  it('has correct initial state', () => {
    const state = store.getState();
    expect(state.status).toBe('idle');
    expect(state.progress).toBe(0);
    expect(state.runId).toBeNull();
  });

  it('setProgress updates runId, progress and status', () => {
    act(() => store.getState().setProgress('run_01', 45));
    const state = store.getState();
    expect(state.runId).toBe('run_01');
    expect(state.progress).toBe(45);
    expect(state.status).toBe('processing');
  });

  it('setCompleted sets progress to 100 and status to completed', () => {
    act(() => store.getState().setCompleted('run_01'));
    const state = store.getState();
    expect(state.progress).toBe(100);
    expect(state.status).toBe('completed');
  });

  it('setError sets status to error with message', () => {
    act(() => store.getState().setError('run_01', 'Calculation failed'));
    const state = store.getState();
    expect(state.status).toBe('error');
    expect(state.errorMessage).toBe('Calculation failed');
  });

  it('reset returns to initial state', () => {
    act(() => {
      store.getState().setProgress('run_01', 70);
      store.getState().reset();
    });
    const state = store.getState();
    expect(state.status).toBe('idle');
    expect(state.progress).toBe(0);
  });
});

describe('formatNaira', () => {
  it('formats 100_000 kobo as ₦1,000.00', () => {
    expect(formatNaira(100_000)).toContain('1,000');
  });

  it('formats 0 kobo as ₦0.00', () => {
    expect(formatNaira(0)).toContain('0');
  });

  it('formats large amounts with correct grouping', () => {
    expect(formatNaira(2_500_000_000)).toContain('25,000,000');
  });
});
