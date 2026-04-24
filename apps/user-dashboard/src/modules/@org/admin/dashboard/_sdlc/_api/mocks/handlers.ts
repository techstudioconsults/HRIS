import { http, HttpResponse } from 'msw';

export const dashboardHandlers = [
  http.get('/api/v1/dashboard/headcount', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        total: 142,
        active: 138,
        onLeave: 4,
        terminatedThisMonth: 2,
        asOf: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/dashboard/attendance', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
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
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/dashboard/pending-actions', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        leaveRequestCount: 5,
        payrollApprovalCount: 1,
        documentExpiryCount: 3,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/dashboard/activity', () => {
    return HttpResponse.json({
      status: 'success',
      data: [],
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/dashboard/leave-summary', () => {
    return HttpResponse.json({
      status: 'success',
      data: [],
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/dashboard/payroll-summary', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        nextRunDate: '2026-04-30',
        nextRunEstimatedPayout: 285000,
        lastProcessedDate: '2026-03-31',
        lastProcessedPayout: 281500,
        currency: 'NGN',
      },
      timestamp: new Date().toISOString(),
    });
  }),

  // TODO: add more handlers as endpoints are confirmed
];
