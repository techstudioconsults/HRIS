import { describe, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
// TODO: import { render, screen } from '@testing-library/react';
// TODO: import { createWrapper } from '@/test-utils/query-wrapper';
// TODO: import type { HeadcountSummary } from '@/modules/@org/admin/dashboard/types';

describe('Admin Dashboard — Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('HeadcountWidget', () => {
    it.todo('should render total, active, on-leave, and terminated counts');
    it.todo('should show skeleton loader while headcount data is fetching');
    it.todo('should show error state with retry button when API returns 5xx');
    it.todo('should show zero-state prompt when total headcount is 0');
    it.todo('should format numbers with locale-aware thousand separators');
  });

  describe('AttendanceRateWidget', () => {
    it.todo('should render attendance percentage rounded to one decimal place');
    it.todo('should render sparkline with trend data when available');
    it.todo('should not crash when trend array is empty');
    it.todo('should show loading skeleton while data is fetching');
  });

  describe('PendingActionsWidget', () => {
    it.todo('should display leave request count badge');
    it.todo('should display payroll approval count badge');
    it.todo('should show zero counts without error when all queues are empty');
    it.todo('should render links to the correct module routes');
  });

  describe('RecentActivityFeed', () => {
    it.todo('should render a list of activity items');
    it.todo('should show empty state message when activity feed is empty');
    it.todo('should render the correct icon for each eventType');
    it.todo('should format activity timestamps in the organisation timezone');
  });

  describe('OnboardingBanner', () => {
    it.todo('should be visible when organisation setup is incomplete');
    it.todo('should not render when all setup steps are complete');
    it.todo('should list each incomplete setup step as an actionable item');
  });

  describe('PayrollSummaryWidget', () => {
    it.todo(
      'should display the next payroll run date in a human-readable format'
    );
    it.todo('should display estimated payout with correct currency formatting');
    it.todo('should display last processed payout amount');
  });

  describe('Dashboard service functions', () => {
    it.todo(
      'should correctly transform headcount API response to HeadcountSummary'
    );
    it.todo(
      'should correctly map API error response to a user-friendly error message'
    );
  });
});
