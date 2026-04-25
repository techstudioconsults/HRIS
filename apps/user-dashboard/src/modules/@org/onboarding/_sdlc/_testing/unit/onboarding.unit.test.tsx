import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// companyProfileSchema (mirrored from schemas/index.ts)
// ---------------------------------------------------------------------------

const companyProfileSchema = z.object({
  name: z.string().min(1, 'Company name is required.'),
  industry: z.string().min(1, 'Industry is required.'),
  size: z.string().min(1, 'Company size is required.'),
  addressLine1: z.string().min(1, 'Address is required.'),
  city: z.string().min(1, 'City is required.'),
  country: z.string().min(1, 'Country is required.'),
});

// ---------------------------------------------------------------------------
// onboardEmployeeSchema (mirrored from schemas/index.ts)
// ---------------------------------------------------------------------------

const onboardEmployeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .optional(),
  teamId: z.string().min(1, 'Please select a team.'),
  roleId: z.string().min(1, 'Please select a role.'),
});

describe('companyProfileSchema', () => {
  const valid = {
    name: 'Acme Corp',
    industry: 'Technology',
    size: '11-50',
    addressLine1: '1 Innovation Drive',
    city: 'Lagos',
    country: 'Nigeria',
  };

  it('accepts valid company profile data', () => {
    expect(() => companyProfileSchema.parse(valid)).not.toThrow();
  });

  it('rejects empty name', () => {
    const result = companyProfileSchema.safeParse({ ...valid, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        'Company name is required.'
      );
    }
  });

  it('rejects missing industry', () => {
    const result = companyProfileSchema.safeParse({ ...valid, industry: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing city', () => {
    const result = companyProfileSchema.safeParse({ ...valid, city: '' });
    expect(result.success).toBe(false);
  });
});

describe('onboardEmployeeSchema', () => {
  const valid = {
    firstName: 'Bola',
    lastName: 'Adeyemi',
    email: 'bola@acme.com',
    phoneNumber: '+2348012345678',
    teamId: 'team_01',
    roleId: 'role_01',
  };

  it('accepts valid employee data', () => {
    expect(() => onboardEmployeeSchema.parse(valid)).not.toThrow();
  });

  it('rejects invalid email', () => {
    const result = onboardEmployeeSchema.safeParse({
      ...valid,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        'Please enter a valid email address.'
      );
    }
  });

  it('rejects missing teamId', () => {
    const result = onboardEmployeeSchema.safeParse({ ...valid, teamId: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.teamId).toContain(
        'Please select a team.'
      );
    }
  });

  it('rejects password shorter than 8 characters when provided', () => {
    const result = onboardEmployeeSchema.safeParse({
      ...valid,
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('allows password to be omitted', () => {
    const { password: _p, ...withoutPassword } = {
      ...valid,
      password: undefined,
    };
    expect(() => onboardEmployeeSchema.parse(withoutPassword)).not.toThrow();
  });
});
