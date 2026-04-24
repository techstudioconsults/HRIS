import { describe, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('Leave — Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TODO: component rendering', () => {
    it.todo('should render LeaveAdminPage without errors');
    it.todo('should show skeleton loader while leave requests are fetching');
    it.todo('should show empty state when there are no pending requests');
    it.todo(
      'should show setup wizard for a new organisation with no leave types'
    );
    it.todo('should render leave type cards for each configured leave type');
  });

  describe('TODO: LeaveRequestTable', () => {
    it.todo('should render a row for each leave request in the response');
    it.todo(
      'should display the correct status badge colour for pending/approved/declined'
    );
    it.todo('should format the leave date range as DD MMM YYYY – DD MMM YYYY');
    it.todo('should show the duration in days on each row');
  });

  describe('TODO: leave day calculation logic', () => {
    it.todo(
      'should correctly calculate working days between two dates excluding weekends'
    );
    it.todo(
      'should return 0 duration when start date equals end date on a weekend'
    );
    it.todo(
      'should subtract public holidays from duration when policy has publicHolidaysCountAsLeave=false'
    );
  });

  describe('TODO: LeaveRequestFilters — Zustand store', () => {
    it.todo(
      'should initialise with default filter values (status=all, page=1)'
    );
    it.todo('should update status filter when setFilter is called');
    it.todo('should reset page to 1 when any filter changes');
    it.todo('should reset all filters when reset() is called');
  });

  describe('TODO: Zod schema validation', () => {
    it.todo('should reject a LeaveType with allowanceDays less than 1');
    it.todo(
      'should reject a LeaveType where carryOverCap exceeds allowanceDays'
    );
    it.todo('should require declineReason to be at least 10 characters');
    it.todo('should reject a LeaveRequest where startDate is after endDate');
    it.todo(
      'should accept a valid CreateLeaveTypeDto with all required fields'
    );
  });

  describe('TODO: approval and decline mutations', () => {
    it.todo(
      'should optimistically update the request status to approved on mutation start'
    );
    it.todo('should roll back optimistic update if the approve mutation fails');
    it.todo(
      'should invalidate the leave requests query on successful approval'
    );
    it.todo(
      'should invalidate the employee leave balance query on successful approval'
    );
  });

  describe('TODO: setup wizard store', () => {
    it.todo(
      'should advance from leave-types step to policy step when addDraftLeaveType is called'
    );
    it.todo('should accumulate multiple draft leave types before advancing');
    it.todo('should reset all wizard state when reset() is called');
  });
});
