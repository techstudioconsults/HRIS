# Admin Payroll — Domain Entities

```typescript
type PayrollRunStatus =
  | 'draft'
  | 'processing'
  | 'completed'
  | 'approved'
  | 'paid';
type AdjustmentType = 'BONUS' | 'DEDUCTION';
type DeductionCategory =
  | 'PAYE'
  | 'PENSION'
  | 'NHF'
  | 'LOAN'
  | 'ADVANCE'
  | 'CUSTOM';

interface PayrollRun {
  id: string;
  organisationId: string;
  periodStart: string; // ISO 8601 date
  periodEnd: string;
  payDay: string;
  status: PayrollRunStatus;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  employeeCount: number;
  initiatedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface RosterEntry {
  employeeId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  department: string;
  role: string;
  grossPay: number;
  deductions: DeductionLineItem[];
  bonuses: BonusLineItem[];
  netPay: number;
  status: 'pending' | 'processed' | 'error';
}

interface DeductionLineItem {
  category: DeductionCategory;
  label: string;
  amount: number;
}

interface BonusLineItem {
  label: string;
  amount: number;
}

interface Adjustment {
  id: string;
  runId: string;
  employeeId: string;
  type: AdjustmentType;
  label: string;
  amount: number;
  addedBy: string;
  createdAt: string;
}

interface Payslip {
  id: string;
  runId: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  deductions: DeductionLineItem[];
  bonuses: BonusLineItem[];
  netPay: number;
  generatedAt: string;
}

interface WalletBalance {
  organisationId: string;
  balance: number; // in kobo (integer) — display divides by 100
  currency: string; // 'NGN'
  lastFundedAt?: string;
}

interface WalletTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  referenceId?: string; // payroll run ID for debits
  createdAt: string;
}
```

## Zod Schemas

```typescript
import { z } from 'zod';

const PayrollSetupSchema = z.object({
  payCycle: z.enum(['WEEKLY', 'BI_WEEKLY', 'MONTHLY']),
  payDay: z.number().int().min(1).max(31),
  bankName: z.string().min(1, 'Bank name is required'),
  accountName: z.string().min(1, 'Account name is required'),
  accountNumber: z
    .string()
    .regex(/^\d{10}$/, 'Account number must be 10 digits'),
});

const AdjustmentSchema = z.object({
  employeeId: z.string().min(1),
  type: z.enum(['BONUS', 'DEDUCTION']),
  label: z.string().min(1, 'Label is required').max(100),
  amount: z.number().positive('Amount must be greater than zero'),
});

const FundWalletSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be greater than zero')
    .max(100_000_000),
});
```
