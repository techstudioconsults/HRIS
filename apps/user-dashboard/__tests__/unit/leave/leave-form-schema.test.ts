import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Replicate the schema from the component
const createLeaveTypeSchema = z
  .object({
    name: z.string().min(1, 'Leave name is required'),
    days: z
      .number({ required_error: 'Days is required', invalid_type_error: 'Days must be a number' })
      .min(1, 'Days must be greater than 0'),
    cycle: z.string().min(1, 'Leave cycle is required'),
    maxLeaveDaysPerRequest: z
      .number({
        required_error: 'Maximum leave days per request is required',
        invalid_type_error: 'Maximum leave days per request must be a number',
      })
      .min(1, 'Maximum leave days per request must be greater than 0'),
    enableRollover: z.boolean(),
    maxNumberOfRollOver: z.number({ invalid_type_error: 'Maximum roll over must be a number' }).optional(),
    eligibility: z
      .string()
      .min(1, 'Eligibility is required')
      .refine((value) => ['3', '6', '12', '24', '36', '48'].includes(value), {
        message: 'eligibility must be one of [3, 6, 12, 24, 36, 48]',
      }),
  })
  .superRefine((data, context) => {
    if (!data.enableRollover) return;
    if (data.maxNumberOfRollOver === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxNumberOfRollOver'],
        message: 'Maximum roll over is required when roll over is enabled',
      });
      return;
    }
    if (!Number.isFinite(data.maxNumberOfRollOver) || data.maxNumberOfRollOver <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxNumberOfRollOver'],
        message: 'Maximum roll over must be greater than 0',
      });
    }
  });

type CreateLeaveTypeFormValues = z.infer<typeof createLeaveTypeSchema>;

describe('createLeaveTypeSchema Validation', () => {
  describe('name field', () => {
    it('should reject empty name', () => {
      const data = {
        name: '',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Leave name is required');
      }
    });

    it('should accept valid name', () => {
      const data = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(true);
    });
  });

  describe('days field', () => {
    it('should reject non-numeric days', () => {
      const data = {
        name: 'Annual Leave',
        days: '20' as any,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Days must be a number');
      }
    });

    it('should reject zero days', () => {
      const data = {
        name: 'Annual Leave',
        days: 0,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Days must be greater than 0');
      }
    });

    it('should reject negative days', () => {
      const data = {
        name: 'Annual Leave',
        days: -5,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Days must be greater than 0');
      }
    });

    it('should accept positive days', () => {
      const data = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(true);
    });
  });

  describe('cycle field', () => {
    it('should reject empty cycle', () => {
      const data = {
        name: 'Annual Leave',
        days: 20,
        cycle: '',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Leave cycle is required');
      }
    });

    it('should accept valid cycle values', () => {
      const cycles = ['yearly', 'monthly', 'weekly', 'daily'];

      cycles.forEach((cycle) => {
        const data = {
          name: 'Leave',
          days: 20,
          cycle,
          maxLeaveDaysPerRequest: 5,
          eligibility: '12',
          enableRollover: false,
        };

        const result = createLeaveTypeSchema.safeParse(data);

        expect(result.success).toBe(true);
      });
    });
  });

  describe('maxLeaveDaysPerRequest field', () => {
    it('should reject non-numeric values', () => {
      const data = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: '5' as any,
        eligibility: '12',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('must be a number');
      }
    });

    it('should reject zero or negative values', () => {
      const testCases = [0, -1, -5];

      testCases.forEach((val) => {
        const data = {
          name: 'Annual Leave',
          days: 20,
          cycle: 'yearly',
          maxLeaveDaysPerRequest: val,
          eligibility: '12',
          enableRollover: false,
        };

        const result = createLeaveTypeSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('greater than 0');
        }
      });
    });

    it('should accept positive values', () => {
      const data = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(true);
    });
  });

  describe('eligibility field', () => {
    it('should reject empty eligibility', () => {
      const data = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Eligibility is required');
      }
    });

    it('should accept valid eligibility values', () => {
      const validValues = ['3', '6', '12', '24', '36', '48'];

      validValues.forEach((value) => {
        const data = {
          name: 'Annual Leave',
          days: 20,
          cycle: 'yearly',
          maxLeaveDaysPerRequest: 5,
          eligibility: value,
          enableRollover: false,
        };

        const result = createLeaveTypeSchema.safeParse(data);

        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid eligibility values', () => {
      const invalidValues = ['1', '9', '15', '100', 'unknown'];

      invalidValues.forEach((value) => {
        const data = {
          name: 'Annual Leave',
          days: 20,
          cycle: 'yearly',
          maxLeaveDaysPerRequest: 5,
          eligibility: value,
          enableRollover: false,
        };

        const result = createLeaveTypeSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('eligibility must be one of');
        }
      });
    });
  });

  describe('enableRollover & maxNumberOfRollOver interaction', () => {
    it('should not require maxNumberOfRollOver when enableRollover is false', () => {
      const data = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: false,
        maxNumberOfRollOver: undefined,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it('should require maxNumberOfRollOver when enableRollover is true', () => {
      const data = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: true,
        maxNumberOfRollOver: undefined,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Maximum roll over is required');
      }
    });

    it('should reject zero maxNumberOfRollOver when enabled', () => {
      const data = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: true,
        maxNumberOfRollOver: 0,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('greater than 0');
      }
    });

    it('should reject negative maxNumberOfRollOver when enabled', () => {
      const data = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: true,
        maxNumberOfRollOver: -5,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('greater than 0');
      }
    });

    it('should accept valid maxNumberOfRollOver when enabled', () => {
      const data = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: true,
        maxNumberOfRollOver: 5,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.maxNumberOfRollOver).toBe(5);
      }
    });
  });

  describe('Full form validation', () => {
    it('should validate complete valid form', () => {
      const data: CreateLeaveTypeFormValues = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
        enableRollover: true,
        maxNumberOfRollOver: 5,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it('should validate complete form without rollover', () => {
      const data: CreateLeaveTypeFormValues = {
        name: 'Sick Leave',
        days: 10,
        cycle: 'yearly',
        maxLeaveDaysPerRequest: 2,
        eligibility: '6',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it('should collect multiple validation errors', () => {
      const data = {
        name: '',
        days: -1,
        cycle: '',
        maxLeaveDaysPerRequest: -5,
        eligibility: '99',
        enableRollover: false,
      };

      const result = createLeaveTypeSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        // Should have multiple error issues
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });
  });
});
