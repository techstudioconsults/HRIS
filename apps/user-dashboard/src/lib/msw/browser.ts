import { setupWorker } from 'msw/browser';
import { createPayrollHandlers } from '@/modules/@org/admin/payroll/_sdlc/_api/mocks/handlers';

// Use the full API base URL so MSW intercepts absolute axios requests.
// Falls back to /api/v1 if the env var is somehow absent.
const apiBase = process.env.NEXT_PUBLIC_BASE_URL ?? '/api/v1';

export const worker = setupWorker(...createPayrollHandlers(apiBase));
