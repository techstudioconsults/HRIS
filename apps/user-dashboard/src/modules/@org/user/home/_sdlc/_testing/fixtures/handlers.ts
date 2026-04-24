import { http, HttpResponse } from 'msw';

export const homeFixtureHandlers = [
  http.get('/api/v1/employees/:id/activities', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        items: [
          {
            id: 'activity-1',
            type: 'approved',
            title: 'Leave Request Approved',
            message: 'Your annual leave for Oct 18-21 was approved.',
            timestamp: '2025-10-18T08:00:00.000Z',
          },
          {
            id: 'activity-2',
            type: 'available',
            title: 'Payslip Available',
            message: 'Your September 2025 payslip is now ready to view.',
            timestamp: '2025-09-30T10:00:00.000Z',
          },
        ],
        total: 2,
        page: 1,
        size: 20,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/employees/:id/profile', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        id: 'emp-fixture-001',
        firstName: 'Jane',
        userSetupComplete: true,
      },
      timestamp: new Date().toISOString(),
    });
  }),
];
