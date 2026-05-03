import { z } from 'zod';

import type {
  MappedImportRow,
  ValidatedImportRow,
  ValidationResult,
} from '../types';

// ---------------------------------------------------------------------------
// Row-level validation schema — mirrors + extends the shared employeeSchema
// ---------------------------------------------------------------------------

const rowSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (v) => /^\+?[1-9]\d{9,14}$/.test(v.replace(/[\s\-()]/g, '')),
      'Invalid phone number — must be E.164 format or at least 10 digits'
    ),
  teamId: z
    .string()
    .min(1, 'Department not found — verify the name matches an existing team'),
  roleId: z
    .string()
    .min(
      1,
      'Role not found — verify the role exists within the specified team'
    ),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: "Gender must be 'male' or 'female'" }),
  }),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  employmentType: z.enum(['full time', 'part time', 'contract'], {
    errorMap: () => ({
      message:
        "Employment type must be 'full time', 'part time', or 'contract'",
    }),
  }),
  workMode: z.enum(['remote', 'onsite', 'hybrid'], {
    errorMap: () => ({
      message: "Work mode must be 'remote', 'onsite', or 'hybrid'",
    }),
  }),
  baseSalary: z.number().min(1, 'Base salary must be greater than 0'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountName: z.string().min(1, 'Account name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  bankCode: z.string().min(1, 'Bank code is required'),
});

function extractRowErrors(row: MappedImportRow): string[] {
  const result = rowSchema.safeParse(row);
  if (result.success) return [];
  return result.error.issues.map((issue) => issue.message);
}

/**
 * Validates every MappedImportRow, additionally flagging:
 *  - Duplicate email addresses within the spreadsheet
 *
 * Returns three lists: allRows (with errors attached), validRows, invalidRows.
 */
export function validateRows(rows: MappedImportRow[]): ValidationResult {
  // Pre-scan for duplicate emails in the file
  const emailTally = new Map<string, number>();
  for (const row of rows) {
    const key = row.email.toLowerCase();
    emailTally.set(key, (emailTally.get(key) ?? 0) + 1);
  }

  const allRows: ValidatedImportRow[] = rows.map((row) => {
    const errors = extractRowErrors(row);
    if ((emailTally.get(row.email.toLowerCase()) ?? 0) > 1) {
      errors.push('Duplicate email found in this spreadsheet');
    }

    return { ...row, isValid: errors.length === 0, errors };
  });

  return {
    allRows,
    validRows: allRows.filter((r) => r.isValid),
    invalidRows: allRows.filter((r) => !r.isValid),
  };
}
