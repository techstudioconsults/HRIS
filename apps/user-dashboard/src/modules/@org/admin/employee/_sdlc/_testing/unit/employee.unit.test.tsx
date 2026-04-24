import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Schema unit tests
// ---------------------------------------------------------------------------

const ContractType = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']);
const EmploymentStatus = z.enum([
  'ACTIVE',
  'INACTIVE',
  'TERMINATED',
  'ON_PROBATION',
]);

const EmployeeFormSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Must be a valid email address'),
    phone: z.string().regex(/^\+?[0-9\s\-]{7,15}$/, 'Invalid phone number'),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine(
        (val) => new Date(val) < new Date(),
        'Date of birth must be in the past'
      ),
    departmentId: z.string().min(1, 'Department is required'),
    roleId: z.string().min(1, 'Role is required'),
    contractType: ContractType,
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date is required'),
    endDate: z.string().optional(),
  })
  .refine((data) => data.contractType !== 'CONTRACT' || !!data.endDate, {
    message: 'End date is required for contract employees',
    path: ['endDate'],
  });

describe('EmployeeFormSchema', () => {
  const validBase = {
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara@company.com',
    phone: '+234 801 234 5678',
    dateOfBirth: '1990-01-01',
    departmentId: 'dept_eng',
    roleId: 'role_swe',
    contractType: 'FULL_TIME' as const,
    startDate: '2022-03-01',
  };

  it('accepts valid employee data', () => {
    expect(() => EmployeeFormSchema.parse(validBase)).not.toThrow();
  });

  it('rejects missing first name', () => {
    const result = EmployeeFormSchema.safeParse({
      ...validBase,
      firstName: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.firstName).toContain(
        'First name is required'
      );
    }
  });

  it('rejects invalid email', () => {
    const result = EmployeeFormSchema.safeParse({
      ...validBase,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it('rejects CONTRACT type without endDate', () => {
    const result = EmployeeFormSchema.safeParse({
      ...validBase,
      contractType: 'CONTRACT',
      endDate: undefined,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.endDate).toContain(
        'End date is required for contract employees'
      );
    }
  });

  it('accepts CONTRACT type with endDate', () => {
    expect(() =>
      EmployeeFormSchema.parse({
        ...validBase,
        contractType: 'CONTRACT',
        endDate: '2024-12-31',
      })
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Status state machine unit tests
// ---------------------------------------------------------------------------

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  ON_PROBATION: ['ACTIVE', 'TERMINATED'],
  ACTIVE: ['INACTIVE', 'TERMINATED'],
  INACTIVE: ['ACTIVE', 'TERMINATED'],
  TERMINATED: [],
};

function isValidTransition(from: string, to: string): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

describe('Employment status state machine', () => {
  it('allows ON_PROBATION → ACTIVE', () =>
    expect(isValidTransition('ON_PROBATION', 'ACTIVE')).toBe(true));
  it('allows ACTIVE → TERMINATED', () =>
    expect(isValidTransition('ACTIVE', 'TERMINATED')).toBe(true));
  it('allows ACTIVE → INACTIVE', () =>
    expect(isValidTransition('ACTIVE', 'INACTIVE')).toBe(true));
  it('allows INACTIVE → ACTIVE', () =>
    expect(isValidTransition('INACTIVE', 'ACTIVE')).toBe(true));
  it('blocks TERMINATED → ACTIVE (terminal)', () =>
    expect(isValidTransition('TERMINATED', 'ACTIVE')).toBe(false));
  it('blocks TERMINATED → INACTIVE (terminal)', () =>
    expect(isValidTransition('TERMINATED', 'INACTIVE')).toBe(false));
  it('blocks self-transition ACTIVE → ACTIVE', () =>
    expect(isValidTransition('ACTIVE', 'ACTIVE')).toBe(false));
});
