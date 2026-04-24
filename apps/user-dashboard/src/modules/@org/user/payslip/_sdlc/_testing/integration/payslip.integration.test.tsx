import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  payslipTestHandlers,
  payslipEmptyHandler,
  payslipDetailErrorHandler,
} from '../fixtures/handlers';

// Stub page that wires up query + minimal component tree for integration testing
import { PayslipPage } from '../../../payslip-page.stub';

const server = setupServer(...payslipTestHandlers);

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('PayslipPage — integration', () => {
  it('renders payslip list on load', async () => {
    render(<PayslipPage />, { wrapper });
    expect(await screen.findByText('June 2025')).toBeInTheDocument();
    expect(screen.getByText('May 2025')).toBeInTheDocument();
  });

  it('summary card shows net pay of most recent payslip', async () => {
    render(<PayslipPage />, { wrapper });
    expect(await screen.findByLabelText('Latest net pay')).toHaveTextContent(
      '₦450,000'
    );
  });

  it('clicking View opens details modal with breakdown', async () => {
    const user = userEvent.setup();
    render(<PayslipPage />, { wrapper });
    await screen.findByText('June 2025');

    await user.click(screen.getAllByRole('button', { name: 'View' })[0]);

    expect(await screen.findByText('Basic Salary')).toBeInTheDocument();
    expect(screen.getByText('PAYE Tax')).toBeInTheDocument();
    expect(screen.getByText('Pension (Employee)')).toBeInTheDocument();
  });

  it('pressing Escape closes the modal', async () => {
    const user = userEvent.setup();
    render(<PayslipPage />, { wrapper });
    await screen.findByText('June 2025');
    await user.click(screen.getAllByRole('button', { name: 'View' })[0]);
    await screen.findByText('Basic Salary');

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Basic Salary')).not.toBeInTheDocument();
    });
  });

  it('renders empty state when list returns empty array', async () => {
    server.use(payslipEmptyHandler);
    render(<PayslipPage />, { wrapper });
    expect(
      await screen.findByText('No payslips available yet.')
    ).toBeInTheDocument();
  });

  it('shows toast when detail fetch returns 404', async () => {
    server.use(payslipDetailErrorHandler);
    const user = userEvent.setup();
    render(<PayslipPage />, { wrapper });
    await screen.findByText('June 2025');

    await user.click(screen.getAllByRole('button', { name: 'View' })[0]);

    expect(await screen.findByText('Payslip not found.')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
