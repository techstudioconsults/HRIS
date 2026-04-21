import { z } from 'zod';

export const fundWalletSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

export const bonusDeductionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  valueType: z.enum(['percentage', 'fixed']),
  value: z.number().min(0, 'Value must be positive'),
  status: z.boolean(),
  type: z.enum(['bonus', 'deduction']),
});
