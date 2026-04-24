# Settings Module — Domain Entities

## Enumerations

```typescript
type PayCycle = 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY';

type SettingsDomain =
  | 'account'
  | 'payroll'
  | 'security'
  | 'hr'
  | 'notifications';

type NotificationChannel = 'EMAIL' | 'IN_APP';

type PermissionScope =
  | 'admin:employees:read'
  | 'admin:employees:write'
  | 'admin:leave:read'
  | 'admin:leave:write'
  | 'admin:payroll:read'
  | 'admin:payroll:write'
  | 'admin:resources:read'
  | 'admin:resources:write'
  | 'admin:settings:read'
  | 'admin:settings:write'
  | 'admin:teams:read'
  | 'admin:teams:write';
```

---

## AccountSettings

```typescript
interface AccountSettings {
  organisationId: string;
  name: string; // max 200 chars; required
  logoUrl?: string; // CDN URL; null if no logo uploaded
  contactEmail: string;
  phone?: string;
  address?: string;
  registrationNumber?: string;
  updatedBy: string;
  updatedAt: string; // ISO 8601 datetime
}
```

---

## PayrollSettings

```typescript
interface DeductionRule {
  type: 'TAX' | 'PENSION' | 'HEALTH_INSURANCE' | 'CUSTOM';
  label: string;
  valueType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number; // percentage (0–100) or fixed NGN amount
  enabled: boolean;
}

interface PayrollSettings {
  organisationId: string;
  payCycle: PayCycle;
  currency: string; // ISO 4217 e.g. 'NGN'
  deductions: DeductionRule[];
  updatedBy: string;
  updatedAt: string;
}
```

---

## SecuritySettings

```typescript
interface PasswordPolicy {
  minLength: number; // min 8
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays?: number; // 0 = never expires
}

interface SecuritySettings {
  organisationId: string;
  enforce2FA: boolean;
  sessionTimeoutMinutes: number; // 15–480
  passwordPolicy: PasswordPolicy;
  updatedBy: string;
  updatedAt: string;
}
```

---

## HRSettings

```typescript
interface LeaveCarryoverRule {
  enabled: boolean;
  maxDays: number;
  expiryMonths: number; // months after which carried-over days expire
}

interface HRSettings {
  organisationId: string;
  workingHoursPerWeek: number; // typically 40
  probationPeriodMonths: number; // typically 3–6
  leaveCarryover: LeaveCarryoverRule;
  updatedBy: string;
  updatedAt: string;
}
```

---

## NotificationSettings

```typescript
interface NotificationEventConfig {
  eventType: string; // e.g. 'LEAVE_REQUEST_SUBMITTED', 'PAYROLL_RUN_COMPLETED'
  label: string; // human-readable
  emailEnabled: boolean;
  inAppEnabled: boolean;
}

interface NotificationSettings {
  organisationId: string;
  events: NotificationEventConfig[];
  updatedBy: string;
  updatedAt: string;
}
```

---

## Role

```typescript
interface Role {
  id: string;
  organisationId: string;
  name: string;
  isSystem: boolean; // true = cannot be mutated or deleted
  permissions: PermissionScope[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // null for system roles
}

interface RolesResponse {
  system: Role[];
  custom: Role[];
}
```

---

## Zod Schemas

```typescript
import { z } from 'zod';

const AccountSettingsSchema = z.object({
  name: z.string().min(1, 'Organisation name is required').max(200),
  contactEmail: z.string().email('Must be a valid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  registrationNumber: z.string().optional(),
});

const PayrollSettingsSchema = z.object({
  payCycle: z.enum(['WEEKLY', 'BI_WEEKLY', 'MONTHLY']),
  currency: z.string().length(3, 'Must be a valid ISO 4217 currency code'),
  deductions: z.array(
    z.object({
      type: z.string(),
      label: z.string().min(1),
      valueType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
      value: z.number().nonnegative(),
      enabled: z.boolean(),
    })
  ),
});

const SecuritySettingsSchema = z.object({
  enforce2FA: z.boolean(),
  sessionTimeoutMinutes: z.number().int().min(15).max(480),
  passwordPolicy: z.object({
    minLength: z.number().int().min(8).max(64),
    requireUppercase: z.boolean(),
    requireNumbers: z.boolean(),
    requireSpecialChars: z.boolean(),
    expiryDays: z.number().int().min(0).optional(),
  }),
});

const HRSettingsSchema = z.object({
  workingHoursPerWeek: z.number().int().min(1).max(168),
  probationPeriodMonths: z.number().int().min(1).max(24),
  leaveCarryover: z.object({
    enabled: z.boolean(),
    maxDays: z.number().int().min(0),
    expiryMonths: z.number().int().min(1),
  }),
});

const RoleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(100),
  permissions: z
    .array(z.string())
    .min(1, 'At least one permission is required'),
});
```
