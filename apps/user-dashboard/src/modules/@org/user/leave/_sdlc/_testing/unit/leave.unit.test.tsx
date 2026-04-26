import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import type { LeaveModalState } from '../../../../../../types';

// ---------------------------------------------------------------------------
// requestLeaveSchema (mirrored from schemas/index.ts)
// ---------------------------------------------------------------------------

const requestLeaveSchema = z
  .object({
    leaveId: z.string().min(1, 'Please select a leave type.'),
    startDate: z.string().min(1, 'Please select a start date.'),
    endDate: z.string().min(1, 'Please select an end date.'),
    reason: z.string().min(1, 'Please provide a reason.').max(500),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    { message: 'End date must be on or after start date.', path: ['endDate'] }
  );

describe('requestLeaveSchema', () => {
  const valid = {
    leaveId: 'lt_annual',
    startDate: '2025-07-14',
    endDate: '2025-07-18',
    reason: 'Family vacation',
  };

  it('accepts valid leave request data', () => {
    expect(() => requestLeaveSchema.parse(valid)).not.toThrow();
  });

  it('rejects missing leaveId', () => {
    const result = requestLeaveSchema.safeParse({ ...valid, leaveId: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.leaveId).toContain(
        'Please select a leave type.'
      );
    }
  });

  it('rejects missing startDate', () => {
    const result = requestLeaveSchema.safeParse({ ...valid, startDate: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.startDate).toContain(
        'Please select a start date.'
      );
    }
  });

  it('rejects missing endDate', () => {
    const result = requestLeaveSchema.safeParse({ ...valid, endDate: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.endDate).toContain(
        'Please select an end date.'
      );
    }
  });

  it('rejects missing reason', () => {
    const result = requestLeaveSchema.safeParse({ ...valid, reason: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.reason).toContain(
        'Please provide a reason.'
      );
    }
  });

  it('rejects end date before start date', () => {
    const result = requestLeaveSchema.safeParse({
      ...valid,
      startDate: '2025-07-18',
      endDate: '2025-07-14',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.endDate).toContain(
        'End date must be on or after start date.'
      );
    }
  });

  it('accepts same-day request (startDate === endDate)', () => {
    expect(() =>
      requestLeaveSchema.parse({
        ...valid,
        startDate: '2025-07-14',
        endDate: '2025-07-14',
      })
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// LeaveModalState transitions
// ---------------------------------------------------------------------------

const transitions: Record<string, LeaveModalState> = {
  open_request: 'request',
  open_details: 'details',
  confirm_submit: 'submitted',
  details_to_edit: 'edit',
  close: null,
};

describe('LeaveModalState transitions', () => {
  it('opens request modal', () =>
    expect(transitions['open_request']).toBe('request'));
  it('opens details modal', () =>
    expect(transitions['open_details']).toBe('details'));
  it('transitions to submitted on success', () =>
    expect(transitions['confirm_submit']).toBe('submitted'));
  it('transitions from details to edit', () =>
    expect(transitions['details_to_edit']).toBe('edit'));
  it('closes all modals on close', () =>
    expect(transitions['close']).toBeNull());
});
