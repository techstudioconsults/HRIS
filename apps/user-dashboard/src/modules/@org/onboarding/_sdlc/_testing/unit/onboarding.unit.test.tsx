import { describe, it, expect } from 'vitest';

import { companyProfileSchema, onboardEmployeeSchema } from '@/schemas';
import { isOnboardingSetupComplete } from '../../../services/service';
import {
  roleSchema,
  teamSchema,
  employeeSchema,
} from '../../../_components/forms/schema';

// ---------------------------------------------------------------------------
// U-01 — companyProfileSchema
// ---------------------------------------------------------------------------

describe('companyProfileSchema', () => {
  const company = {
    name: 'Acme Corp',
    industry: 'Technology',
    size: '11-50',
    addressLine1: '1 Innovation Drive',
    country: 'Nigeria',
    state: 'Lagos State',
    city: 'Lagos',
    postcode: '100001',
  };

  it('U-01: accepts a fully valid company profile payload', () => {
    expect(() => companyProfileSchema.parse(company)).not.toThrow();
  });

  it('U-01: rejects missing name', () => {
    const result = companyProfileSchema.safeParse({ ...company, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it('U-01: rejects missing industry', () => {
    const result = companyProfileSchema.safeParse({ ...company, industry: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.industry).toBeDefined();
    }
  });

  it('U-01: rejects missing size', () => {
    const result = companyProfileSchema.safeParse({ ...company, size: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.size).toBeDefined();
    }
  });

  it('U-01: rejects missing city', () => {
    const result = companyProfileSchema.safeParse({ ...company, city: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.city).toBeDefined();
    }
  });

  it('U-01: rejects missing country', () => {
    const result = companyProfileSchema.safeParse({ ...company, country: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.country).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// U-02 — onboardEmployeeSchema: required fields
// ---------------------------------------------------------------------------

describe('onboardEmployeeSchema — required fields', () => {
  const employee = {
    firstName: 'Bola',
    lastName: 'Adeyemi',
    email: 'bola@acme.com',
    phoneNumber: '+2348012345678',
    password: 'TempPass123!',
    teamId: 'team_01',
    roleId: 'role_01',
  };

  it('U-02: accepts a fully valid employee payload', () => {
    expect(() => onboardEmployeeSchema.parse(employee)).not.toThrow();
  });

  it('U-02: rejects missing firstName', () => {
    const result = onboardEmployeeSchema.safeParse({
      ...employee,
      firstName: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.firstName).toBeDefined();
    }
  });

  it('U-02: rejects missing lastName', () => {
    const result = onboardEmployeeSchema.safeParse({
      ...employee,
      lastName: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.lastName).toBeDefined();
    }
  });

  it('U-02: rejects missing email', () => {
    const result = onboardEmployeeSchema.safeParse({ ...employee, email: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it('U-02: rejects missing phoneNumber', () => {
    // phoneNumber requires min 10 digits; empty string fails
    const result = onboardEmployeeSchema.safeParse({
      ...employee,
      phoneNumber: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.phoneNumber).toBeDefined();
    }
  });

  it('U-02: rejects missing teamId', () => {
    const result = onboardEmployeeSchema.safeParse({ ...employee, teamId: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.teamId).toBeDefined();
    }
  });

  it('U-02: rejects missing roleId', () => {
    const result = onboardEmployeeSchema.safeParse({ ...employee, roleId: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.roleId).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// U-03 — onboardEmployeeSchema: invalid email
// ---------------------------------------------------------------------------

describe('onboardEmployeeSchema — email validation', () => {
  const employee = {
    firstName: 'Bola',
    lastName: 'Adeyemi',
    email: 'bola@acme.com',
    phoneNumber: '+2348012345678',
    password: 'TempPass123!',
    teamId: 'team_01',
    roleId: 'role_01',
  };

  it('U-03: rejects a malformed email address', () => {
    const result = onboardEmployeeSchema.safeParse({
      ...employee,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        'Invalid email address'
      );
    }
  });

  it('U-03: rejects an email missing the domain', () => {
    const result = onboardEmployeeSchema.safeParse({
      ...employee,
      email: 'bola@',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// U-04 & U-05 — isOnboardingSetupComplete
// ---------------------------------------------------------------------------

describe('isOnboardingSetupComplete', () => {
  it('U-04: returns false when takenTour is false', () => {
    expect(isOnboardingSetupComplete({ takenTour: false })).toBe(false);
  });

  it('U-04: returns false when takenTour is undefined', () => {
    expect(isOnboardingSetupComplete({ takenTour: undefined })).toBe(false);
  });

  it('U-04: returns false when setupStatus is null', () => {
    expect(isOnboardingSetupComplete(null)).toBe(false);
  });

  it('U-04: returns false when setupStatus is undefined', () => {
    expect(isOnboardingSetupComplete(undefined)).toBe(false);
  });

  it('U-05: returns true when takenTour is true', () => {
    expect(isOnboardingSetupComplete({ takenTour: true })).toBe(true);
  });

  it('U-05: returns true regardless of other flags when takenTour is true', () => {
    expect(
      isOnboardingSetupComplete({
        takenTour: true,
        resetPassword: false,
        reviewProfileDetails: false,
      })
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// U-06 — roleSchema: name is required (min 1 char)
// ---------------------------------------------------------------------------

describe('roleSchema', () => {
  it('U-06: accepts a valid role with a name', () => {
    expect(() =>
      roleSchema.parse({ name: 'Senior Engineer', permissions: [] })
    ).not.toThrow();
  });

  it('U-06: rejects an empty name', () => {
    const result = roleSchema.safeParse({ name: '', permissions: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        'Role name is required'
      );
    }
  });

  it('U-06: defaults permissions to an empty array when omitted', () => {
    const result = roleSchema.parse({ name: 'Analyst' });
    expect(result.permissions).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// U-07 — teamSchema: name is required (min 1 char)
// ---------------------------------------------------------------------------

describe('teamSchema', () => {
  it('U-07: accepts a valid team with a name', () => {
    expect(() =>
      teamSchema.parse({ name: 'Engineering', roles: [] })
    ).not.toThrow();
  });

  it('U-07: rejects an empty name', () => {
    const result = teamSchema.safeParse({ name: '', roles: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        'Team name is required'
      );
    }
  });

  it('U-07: defaults roles to an empty array when omitted', () => {
    const result = teamSchema.parse({ name: 'Design' });
    expect(result.roles).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// U-08 — employeeSchema (from _components/forms/schema.ts): firstName min 2
// ---------------------------------------------------------------------------

describe('employeeSchema — firstName minimum length', () => {
  // Populate all required fields to isolate the firstName validation.
  const employee = {
    firstName: 'Bola',
    lastName: 'Adeyemi',
    email: 'bola@acme.com',
    phoneNumber: '+2348012345678',
    department: 'Engineering',
    role: 'Senior Engineer',
  };

  it('U-08: accepts a firstName of at least 2 characters', () => {
    expect(() => employeeSchema.parse(employee)).not.toThrow();
  });

  it('U-08: rejects a firstName shorter than 2 characters', () => {
    const result = employeeSchema.safeParse({ ...employee, firstName: 'B' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.firstName).toContain(
        'First name must be at least 2 characters'
      );
    }
  });

  it('U-08: rejects an empty firstName', () => {
    const result = employeeSchema.safeParse({ ...employee, firstName: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.firstName).toBeDefined();
    }
  });
});
