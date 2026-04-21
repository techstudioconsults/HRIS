import { z } from 'zod';

export const requestLeaveSchema = z.object({
  leaveId: z.string().min(1, 'Please select a leave type'),
  startDate: z.string().min(1, 'Please select a start date'),
  endDate: z.string().min(1, 'Please select an end date'),
  reason: z.string().min(1, 'Please provide a reason for your leave'),
});

export type RequestLeaveFormValues = z.infer<typeof requestLeaveSchema>;
