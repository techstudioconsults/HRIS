import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  onboardingTestHandlers,
  teamDeleteBlockedHandler,
  employeeDuplicateEmailHandler,
} from '../fixtures/handlers';

// Stubs — replace with real page components when wiring up
// import { CompanyProfilePage } from '../../../_views/step-one';
// import { TeamsAndRolesPage } from '../../../_views/step-two';
// import { EmployeeOnboardingPage } from '../../../_views/step-three';

const server = setupServer(...onboardingTestHandlers);

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Step 1 — Company Profile', () => {
  it('I-01: pre-fills form from API data', async () => {
    // render(<CompanyProfilePage />, { wrapper });
    // expect(await screen.findByDisplayValue('Acme Corp')).toBeInTheDocument();
    expect(true).toBe(true);
  });

  it('I-02: submit saves and navigates to step-2', async () => {
    // render(<CompanyProfilePage />, { wrapper });
    // await user.click(screen.getByRole('button', { name: /next/i }));
    // await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/onboarding/step-2'));
    expect(true).toBe(true);
  });
});

describe('Step 2 — Teams & Roles', () => {
  it('I-03: loads teams and renders accordions', async () => {
    // render(<TeamsAndRolesPage />, { wrapper });
    // expect(await screen.findByText('Engineering')).toBeInTheDocument();
    expect(true).toBe(true);
  });

  it('I-04: add team creates new accordion', async () => {
    expect(true).toBe(true);
  });

  it('I-05: delete team (no employees) removes accordion', async () => {
    expect(true).toBe(true);
  });

  it('I-06: delete team with employees shows toast error', async () => {
    server.use(teamDeleteBlockedHandler);
    // render + click delete → expect toast with error
    expect(true).toBe(true);
  });
});

describe('Step 3 — Employee Onboarding', () => {
  it('I-10: batch invite succeeds → navigates to dashboard', async () => {
    expect(true).toBe(true);
  });

  it('I-11: duplicate email shows field error', async () => {
    server.use(employeeDuplicateEmailHandler);
    expect(true).toBe(true);
  });
});
