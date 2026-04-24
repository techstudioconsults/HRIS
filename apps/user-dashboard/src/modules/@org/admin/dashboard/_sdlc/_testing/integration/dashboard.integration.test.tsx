import { describe, it, vi, beforeAll } from 'vitest';
import '@testing-library/jest-dom';
// TODO: import { render, screen, waitFor } from '@testing-library/react';
// TODO: import { setupServer } from 'msw/node';
// TODO: import { dashboardHandlers } from '../fixtures/handlers';
// TODO: import { createWrapper } from '@/test-utils/query-wrapper';

// TODO: const server = setupServer(...dashboardHandlers);
// TODO: beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// TODO: afterEach(() => server.resetHandlers());
// TODO: afterAll(() => server.close());

describe('Admin Dashboard — Integration Tests', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe('Full dashboard render with mocked APIs', () => {
    it.todo('should render all widgets once all API responses resolve');
    it.todo(
      'should show individual widget skeletons while requests are in flight'
    );
    it.todo(
      'should render the onboarding banner when session indicates incomplete setup'
    );
    it.todo('should not render the onboarding banner when setup is complete');
  });

  describe('Error containment', () => {
    it.todo(
      'should render other widgets normally when the headcount endpoint returns 500'
    );
    it.todo(
      'should render other widgets normally when the payroll endpoint returns 500'
    );
    it.todo(
      'should show the widget-level error state with a retry button on API failure'
    );
  });

  describe('Cache behaviour', () => {
    it.todo('should not re-fetch data within the staleTime window on re-mount');
    it.todo(
      'should refetch data after the staleTime window elapses on window focus'
    );
  });

  describe('Navigation', () => {
    it.todo(
      'should navigate to /admin/leave on clicking the pending leave requests link'
    );
    it.todo(
      'should navigate to /admin/payroll on clicking the payroll approval link'
    );
  });

  describe('Accessibility (integration level)', () => {
    it.todo(
      'should have no axe accessibility violations on the fully rendered dashboard'
    );
  });
});
