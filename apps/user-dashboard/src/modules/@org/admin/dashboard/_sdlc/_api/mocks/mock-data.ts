// TODO: import actual types once the types/index.ts stabilises
// import type { HeadcountSummary, AttendanceSummary, PendingActions, ActivityEvent, PayrollRunSummary } from '@/modules/@org/admin/dashboard/types';

export const mockDashboardData = {
  headcount: {
    total: 142,
    active: 138,
    onLeave: 4,
    terminatedThisMonth: 2,
    asOf: '2026-04-23T08:00:00Z',
  },

  attendance: {
    ratePercent: 94.2,
    payPeriodStart: '2026-04-01',
    payPeriodEnd: '2026-04-30',
    trend: [
      { period: '2026-03', ratePercent: 92.1 },
      { period: '2026-02', ratePercent: 95.0 },
      { period: '2026-01', ratePercent: 91.5 },
      { period: '2025-12', ratePercent: 88.3 },
      { period: '2025-11', ratePercent: 93.7 },
    ],
  },

  pendingActions: {
    leaveRequestCount: 5,
    payrollApprovalCount: 1,
    documentExpiryCount: 3,
  },

  activityFeed: [
    {
      id: 'evt_001',
      eventType: 'HIRE',
      actorName: 'Jane Admin',
      subjectName: 'John Doe',
      occurredAt: '2026-04-22T14:30:00Z',
      moduleLink: '/admin/employee/emp_456',
    },
    {
      id: 'evt_002',
      eventType: 'LEAVE_APPROVED',
      actorName: 'Jane Admin',
      subjectName: 'Sarah Connor',
      occurredAt: '2026-04-22T11:00:00Z',
      moduleLink: '/admin/leave/req_789',
    },
    {
      id: 'evt_003',
      eventType: 'PAYROLL_PROCESSED',
      actorName: 'Jane Admin',
      subjectName: 'All Employees',
      occurredAt: '2026-03-31T18:00:00Z',
      moduleLink: '/admin/payroll/run_321',
    },
  ],

  payrollSummary: {
    nextRunDate: '2026-04-30',
    nextRunEstimatedPayout: 285000,
    lastProcessedDate: '2026-03-31',
    lastProcessedPayout: 281500,
    currency: 'NGN',
  },
} as const;
