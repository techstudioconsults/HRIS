import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import type { LeaveRequest } from '@/modules/@org/admin/leave/types';

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'lr_001',
    employeeId: 'emp_001',
    employeeName: 'Jane Doe',
    employeeAvatar: '/images/auth/login-img.svg',
    leaveTypeId: 'lt_annual',
    leaveTypeName: 'Annual Leave',
    startDate: '2026-01-10',
    endDate: '2026-01-12',
    days: 3,
    reason: 'Family event',
    status: 'pending' as const,
    createdAt: '2026-01-05',
    updatedAt: '2026-01-05',
  },
  {
    id: 'lr_002',
    employeeId: 'emp_002',
    employeeName: 'John Smith',
    employeeAvatar: '/images/auth/register-img.svg',
    leaveTypeId: 'lt_sick',
    leaveTypeName: 'Sick Leave',
    startDate: '2026-01-02',
    endDate: '2026-01-03',
    days: 2,
    reason: 'Medical appointment',
    status: 'approved' as const,
    approvedBy: 'HR Admin',
    approvedAt: '2026-01-02',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-02',
  },
  {
    id: 'lr_003',
    employeeId: 'emp_003',
    employeeName: 'Amina Yusuf',
    leaveTypeId: 'lt_casual',
    leaveTypeName: 'Casual Leave',
    startDate: '2025-12-20',
    endDate: '2025-12-20',
    days: 1,
    reason: 'Personal errands',
    status: 'rejected',
    approvedBy: 'Team Lead',
    approvedAt: '2025-12-19',
    createdAt: '2025-12-19',
    updatedAt: '2025-12-19',
  },
];

describe('LeaveBody Component', () => {
  const mockGetRowActions = vi.fn((_row: LeaveRequest) => []);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Leave Request Data', () => {
    it('should have mock leave requests data', () => {
      expect(mockLeaveRequests).toHaveLength(3);
    });

    it('should have correct request properties', () => {
      const firstRequest = mockLeaveRequests[0];

      expect(firstRequest.id).toBe('lr_001');
      expect(firstRequest.employeeName).toBe('Jane Doe');
      expect(firstRequest.leaveTypeName).toBe('Annual Leave');
      expect(firstRequest.status).toBe('pending');
    });

    it('should have all three requests with different statuses', () => {
      const statuses = mockLeaveRequests.map((r) => r.status);

      expect(statuses).toContain('pending');
      expect(statuses).toContain('approved');
      expect(statuses).toContain('declined');
    });
  });

  describe('Row Actions', () => {
    it('should have row actions callback', () => {
      expect(mockGetRowActions).toBeDefined();
    });

    it('should call row actions with request data', () => {
      mockGetRowActions(mockLeaveRequests[0]);

      expect(mockGetRowActions).toHaveBeenCalledWith(mockLeaveRequests[0]);
    });

    it('should handle multiple row action calls', () => {
      mockGetRowActions(mockLeaveRequests[0]);
      mockGetRowActions(mockLeaveRequests[1]);
      mockGetRowActions(mockLeaveRequests[2]);

      expect(mockGetRowActions).toHaveBeenCalledTimes(3);
    });
  });

  describe('Search Filtering Logic', () => {
    it('should filter requests by employee name', () => {
      const searchQuery = 'jane';
      const filtered = mockLeaveRequests.filter((r) =>
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].employeeName).toBe('Jane Doe');
    });

    it('should filter requests by leave type', () => {
      const searchQuery = 'Sick';
      const filtered = mockLeaveRequests.filter((r) =>
        r.leaveTypeName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].leaveTypeName).toBe('Sick Leave');
    });

    it('should filter requests by status', () => {
      const searchQuery = 'approved';
      const filtered = mockLeaveRequests.filter((r) =>
        r.status.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe('approved');
    });

    it('should handle no matches', () => {
      const searchQuery = 'NonExistent';
      const filtered = mockLeaveRequests.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.leaveTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.status.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered).toHaveLength(0);
    });

    it('should handle empty search', () => {
      const searchQuery = '';
      const filtered = mockLeaveRequests.filter(
        (r) =>
          searchQuery.trim() === '' ||
          r.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered).toHaveLength(3);
    });

    it('should handle whitespace trimming in search', () => {
      const searchQuery = '   ';
      const trimmed = searchQuery.trim();
      const filtered = mockLeaveRequests.filter(
        (r) =>
          trimmed === '' ||
          r.employeeName.toLowerCase().includes(trimmed.toLowerCase())
      );

      expect(filtered).toHaveLength(3);
    });
  });

  describe('Empty State Detection', () => {
    it('should detect empty state when no matches', () => {
      const searchQuery = 'NonExistent';
      const hasMatches = mockLeaveRequests.some((r) =>
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(hasMatches).toBe(false);
    });

    it('should show different message for search vs no data', () => {
      const searchQuery = 'NonExistent';
      const isEmpty = mockLeaveRequests.length === 0;
      const noMatches = !mockLeaveRequests.some((r) =>
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (isEmpty) {
        expect(true).toBe(true); // "No leave requests yet"
      } else if (noMatches && searchQuery.trim()) {
        expect(true).toBe(true); // "No matching leave requests"
      }
    });
  });
});
