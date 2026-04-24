import { http, HttpResponse, delay } from 'msw';
import { mockPayslipListItems, mockPayslips } from './mock-data';

const BASE = '/api/v1';

export const userPayslipHandlers = [
  // List payslips (paginated)
  http.get(`${BASE}/payslips`, async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const size = Number(url.searchParams.get('size') ?? '20');

    const total = mockPayslipListItems.length;
    const start = (page - 1) * size;
    const paged = mockPayslipListItems.slice(start, start + size);

    return HttpResponse.json({
      status: 'success',
      data: paged,
      pagination: { total, page, size, totalPages: Math.ceil(total / size) },
    });
  }),

  // Get payslip detail
  http.get(`${BASE}/payslips/:id`, async ({ params }) => {
    await delay(200);
    const payslip = mockPayslips[params.id as string];

    if (!payslip) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/payslip-not-found',
          title: 'Payslip Not Found',
          status: 404,
          detail: `No payslip found with id "${params.id}".`,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({ status: 'success', data: payslip });
  }),

  // Download payslip PDF (returns a minimal PDF-like blob for mocking)
  http.get(`${BASE}/payslips/:id/download`, async ({ params }) => {
    await delay(800);
    const payslip = mockPayslips[params.id as string];

    if (!payslip) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/payslip-not-found',
          title: 'Payslip Not Found',
          status: 404,
        },
        { status: 404 }
      );
    }

    // Minimal valid PDF stub for testing download behaviour
    const pdfStub = new Blob(
      [`%PDF-1.4 Mock payslip for ${payslip.periodLabel}`],
      { type: 'application/pdf' }
    );

    return new HttpResponse(pdfStub, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="payslip-${payslip.period}.pdf"`,
      },
    });
  }),
];
