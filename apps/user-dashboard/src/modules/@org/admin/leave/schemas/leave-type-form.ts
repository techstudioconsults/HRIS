import { z } from 'zod';

export const leaveTypeFormSchema = z
  .object({
    name: z.string().min(1, 'Leave name is required'),
    days: z
      .number({
        required_error: 'Days is required',
        invalid_type_error: 'Days must be a number',
      })
      .min(1, 'Days must be greater than 0'),
    cycle: z.string().min(1, 'Leave cycle is required'),
    maxLeaveDaysPerRequest: z
      .number({
        required_error: 'Maximum leave days per request is required',
        invalid_type_error: 'Maximum leave days per request must be a number',
      })
      .min(1, 'Maximum leave days per request must be greater than 0'),
    enableRollover: z.boolean(),
    maxNumberOfRollOver: z
      .number({ invalid_type_error: 'Maximum roll over must be a number' })
      .optional(),
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

    if (
      !Number.isFinite(data.maxNumberOfRollOver) ||
      data.maxNumberOfRollOver <= 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxNumberOfRollOver'],
        message: 'Maximum roll over must be greater than 0',
      });
    }
  });

export type LeaveTypeFormValues = z.infer<typeof leaveTypeFormSchema>;

export const LEAVE_ELIGIBILITY_OPTIONS = [
  { value: '3', label: '3 Months+' },
  { value: '6', label: '6 Months+' },
  { value: '12', label: '12 Months+' },
  { value: '24', label: '24 Months+' },
  { value: '36', label: '36 Months+' },
  { value: '48', label: '48 Months+' },
] as const;

export const LEAVE_CYCLE_OPTIONS = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
] as const;
