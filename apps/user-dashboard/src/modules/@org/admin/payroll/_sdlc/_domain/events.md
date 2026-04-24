# Admin Payroll — Domain Events

## PayrollRunInitiated

| Field            | Type                     |
| ---------------- | ------------------------ |
| `runId`          | `string`                 |
| `organisationId` | `string`                 |
| `periodStart`    | `string (ISO 8601 date)` |
| `periodEnd`      | `string (ISO 8601 date)` |
| `initiatedBy`    | `string`                 |
| `occurredAt`     | `string (ISO 8601)`      |

**Subscribers**: Notification service (notify HR team); backend calculation engine (start processing)

---

## PayrollRunCompleted

| Field             | Type                |
| ----------------- | ------------------- |
| `runId`           | `string`            |
| `totalGross`      | `number`            |
| `totalDeductions` | `number`            |
| `totalNet`        | `number`            |
| `employeeCount`   | `number`            |
| `occurredAt`      | `string (ISO 8601)` |

**Frontend**: SSE stream emits this; `usePayrollSSE` closes connection and triggers TanStack Query invalidation.

---

## PayrollRunApproved

| Field        | Type                |
| ------------ | ------------------- |
| `runId`      | `string`            |
| `approvedBy` | `string`            |
| `occurredAt` | `string (ISO 8601)` |

**Subscribers**: Wallet service (debit wallet); Notification service (notify employees payslip ready)

---

## AdjustmentAdded

| Field          | Type                     |
| -------------- | ------------------------ |
| `adjustmentId` | `string`                 |
| `runId`        | `string`                 |
| `employeeId`   | `string`                 |
| `type`         | `'BONUS' \| 'DEDUCTION'` |
| `amount`       | `number`                 |
| `label`        | `string`                 |
| `addedBy`      | `string`                 |
| `occurredAt`   | `string (ISO 8601)`      |

---

## WalletFunded

| Field            | Type                |
| ---------------- | ------------------- |
| `transactionId`  | `string`            |
| `organisationId` | `string`            |
| `amount`         | `number`            |
| `newBalance`     | `number`            |
| `occurredAt`     | `string (ISO 8601)` |

**Frontend**: TanStack Query invalidates `['payroll', 'wallet']` to refresh balance display.

---

## SSE Event Shape (PayrollProgressEvent)

```typescript
interface PayrollProgressEvent {
  type: 'progress' | 'completed' | 'error';
  runId: string;
  processed: number;
  total: number;
  message?: string; // populated on 'error' type
}
```
