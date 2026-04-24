import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Schemas (mirrored from _domain/models/entities.md)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Account Settings
// ---------------------------------------------------------------------------

describe('AccountSettingsSchema', () => {
  const valid = { name: 'Techstudio Ltd', contactEmail: 'admin@company.com' };

  it('accepts valid account settings', () => {
    expect(() => AccountSettingsSchema.parse(valid)).not.toThrow();
  });

  it('rejects empty organisation name', () => {
    const result = AccountSettingsSchema.safeParse({ ...valid, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        'Organisation name is required'
      );
    }
  });

  it('rejects name exceeding 200 characters', () => {
    const result = AccountSettingsSchema.safeParse({
      ...valid,
      name: 'A'.repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid contact email', () => {
    const result = AccountSettingsSchema.safeParse({
      ...valid,
      contactEmail: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.contactEmail).toBeDefined();
    }
  });

  it('accepts missing optional fields', () => {
    expect(() => AccountSettingsSchema.parse(valid)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Payroll Settings
// ---------------------------------------------------------------------------

describe('PayrollSettingsSchema', () => {
  const valid = {
    payCycle: 'MONTHLY' as const,
    currency: 'NGN',
    deductions: [
      {
        type: 'TAX',
        label: 'PAYE',
        valueType: 'PERCENTAGE' as const,
        value: 7.5,
        enabled: true,
      },
    ],
  };

  it('accepts valid payroll settings', () => {
    expect(() => PayrollSettingsSchema.parse(valid)).not.toThrow();
  });

  it('rejects currency code that is not 3 characters', () => {
    const result = PayrollSettingsSchema.safeParse({
      ...valid,
      currency: 'NGNN',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative deduction value', () => {
    const result = PayrollSettingsSchema.safeParse({
      ...valid,
      deductions: [{ ...valid.deductions[0], value: -1 }],
    });
    expect(result.success).toBe(false);
  });

  it('accepts zero deduction value', () => {
    expect(() =>
      PayrollSettingsSchema.parse({
        ...valid,
        deductions: [{ ...valid.deductions[0], value: 0 }],
      })
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Security Settings
// ---------------------------------------------------------------------------

describe('SecuritySettingsSchema', () => {
  const valid = {
    enforce2FA: false,
    sessionTimeoutMinutes: 60,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
    },
  };

  it('accepts valid security settings', () => {
    expect(() => SecuritySettingsSchema.parse(valid)).not.toThrow();
  });

  it('rejects session timeout below 15 minutes', () => {
    const result = SecuritySettingsSchema.safeParse({
      ...valid,
      sessionTimeoutMinutes: 14,
    });
    expect(result.success).toBe(false);
  });

  it('rejects session timeout above 480 minutes', () => {
    const result = SecuritySettingsSchema.safeParse({
      ...valid,
      sessionTimeoutMinutes: 481,
    });
    expect(result.success).toBe(false);
  });

  it('rejects password minLength below 8', () => {
    const result = SecuritySettingsSchema.safeParse({
      ...valid,
      passwordPolicy: { ...valid.passwordPolicy, minLength: 7 },
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Role Form
// ---------------------------------------------------------------------------

describe('RoleFormSchema', () => {
  it('accepts valid role data', () => {
    expect(() =>
      RoleFormSchema.parse({
        name: 'Recruitment Lead',
        permissions: ['admin:employees:read'],
      })
    ).not.toThrow();
  });

  it('rejects empty role name', () => {
    const result = RoleFormSchema.safeParse({
      name: '',
      permissions: ['admin:employees:read'],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        'Role name is required'
      );
    }
  });

  it('rejects empty permissions array', () => {
    const result = RoleFormSchema.safeParse({
      name: 'My Role',
      permissions: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.permissions).toContain(
        'At least one permission is required'
      );
    }
  });
});
