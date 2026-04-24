import { http, HttpResponse, delay } from 'msw';
import { fixturePayslipListItems, fixturePayslipDetail } from './mock-data';

const BASE = '/api/v1';

export const payslipTestHandlers = [
  http.get(`${BASE}/payslips`, async () => {
    await delay(50);
    return HttpResponse.json({
      status: 'success',
      data: fixturePayslipListItems,
      pagination: { total: 2, page: 1, size: 20, totalPages: 1 },
    });
  }),

  http.get(`${BASE}/payslips/:id`, async ({ params }) => {
    await delay(50);
    if (params.id !== fixturePayslipDetail.id) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/payslip-not-found',
          title: 'Payslip Not Found',
          status: 404,
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({ status: 'success', data: fixturePayslipDetail });
  }),

  http.get(`${BASE}/payslips/:id/download`, async ({ params }) => {
    await delay(50);
    if (params.id !== fixturePayslipDetail.id) {
      return HttpResponse.json({ status: 404 }, { status: 404 });
    }
    const blob = new Blob(['%PDF-1.4 test'], { type: 'application/pdf' });
    return new HttpResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="payslip-2025-06.pdf"',
      },
    });
  }),
];

export const payslipEmptyHandler = http.get(`${BASE}/payslips`, async () => {
  await delay(50);
  return HttpResponse.json({
    status: 'success',
    data: [],
    pagination: { total: 0, page: 1, size: 20, totalPages: 0 },
  });
});

export const payslipDetailErrorHandler = http.get(
  `${BASE}/payslips/:id`,
  async () => {
    await delay(50);
    return HttpResponse.json(
      {
        type: 'https://hris.example.com/errors/payslip-not-found',
        title: 'Payslip Not Found',
        status: 404,
      },
      { status: 404 }
    );
  }
);
