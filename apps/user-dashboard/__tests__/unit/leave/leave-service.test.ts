import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LeaveService } from '@/modules/@org/admin/leave/services/service';
import type { CreateLeaveTypePayload, UpdateLeaveTypePayload, LeaveType } from '@/modules/@org/admin/leave/types';

// Mock HttpAdapter
const mockHttpAdapter = {
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

describe('LeaveService', () => {
  let leaveService: LeaveService;

  beforeEach(() => {
    vi.clearAllMocks();
    leaveService = new LeaveService(mockHttpAdapter as any);
  });

  describe('createLeaveType', () => {
    it('should POST to /leaves and return LeaveType on 201', async () => {
      const payload: CreateLeaveTypePayload = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
        carryOver: true,
        maxLeaveDaysPerRequest: 5,
        eligibility: '12',
      };

      const mockResponse = {
        status: 201,
        data: {
          data: {
            id: 'lt_001',
            name: 'Annual Leave',
            days: 20,
            cycle: 'yearly',
            carryOver: true,
          } as LeaveType,
        },
      };

      mockHttpAdapter.post.mockResolvedValue(mockResponse);

      const result = await leaveService.createLeaveType(payload);

      expect(mockHttpAdapter.post).toHaveBeenCalledWith('/leaves', payload);
      expect(result).toEqual(mockResponse.data.data);
      expect(result?.id).toBe('lt_001');
    });

    it('should return undefined on non-201 status', async () => {
      const payload: CreateLeaveTypePayload = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
      };

      mockHttpAdapter.post.mockResolvedValue({ status: 400 });

      const result = await leaveService.createLeaveType(payload);

      expect(result).toBeUndefined();
    });

    it('should handle network errors gracefully', async () => {
      const payload: CreateLeaveTypePayload = {
        name: 'Annual Leave',
        days: 20,
        cycle: 'yearly',
      };

      mockHttpAdapter.post.mockRejectedValue(new Error('Network error'));

      await expect(leaveService.createLeaveType(payload)).rejects.toThrow('Network error');
    });
  });

  describe('getLeaveTypes', () => {
    it('should GET /leaves and return paginated response format', async () => {
      const mockResponse = {
        status: 200,
        data: {
          items: [{ id: 'lt_001', name: 'Annual Leave', days: 20, cycle: 'yearly', carryOver: false }] as LeaveType[],
          metadata: { total: 1, page: 1, totalPages: 1 },
        },
      };

      mockHttpAdapter.get.mockResolvedValue(mockResponse);

      const result = await leaveService.getLeaveTypes();

      expect(mockHttpAdapter.get).toHaveBeenCalledWith('/leaves', {});
      expect(result).toEqual(mockResponse.data);
      // expect((result?.items).toHaveLength(1);
    });

    it('should handle legacy data response format { data: LeaveType[] }', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: [{ id: 'lt_001', name: 'Annual Leave', days: 20, cycle: 'yearly', carryOver: false }] as LeaveType[],
        },
      };

      mockHttpAdapter.get.mockResolvedValue(mockResponse);

      const result = await leaveService.getLeaveTypes();

      expect(result).toEqual(mockResponse.data);
    });

    it('should pass filters as query parameters', async () => {
      const filters = { page: 1, limit: 10 };

      mockHttpAdapter.get.mockResolvedValue({ status: 200, data: { items: [] } });

      await leaveService.getLeaveTypes(filters);

      expect(mockHttpAdapter.get).toHaveBeenCalledWith('/leaves', filters);
    });

    it('should return undefined on non-200 status', async () => {
      mockHttpAdapter.get.mockResolvedValue({ status: 500 });

      const result = await leaveService.getLeaveTypes();

      expect(result).toBeUndefined();
    });
  });

  describe('getLeaveTypeById', () => {
    it('should GET /leaves/{id} and return LeaveType', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 'lt_001',
            name: 'Annual Leave',
            days: 20,
            cycle: 'yearly',
            carryOver: false,
          } as LeaveType,
        },
      };

      mockHttpAdapter.get.mockResolvedValue(mockResponse);

      const result = await leaveService.getLeaveTypeById('lt_001');

      expect(mockHttpAdapter.get).toHaveBeenCalledWith('/leaves/lt_001');
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should return undefined on non-200 status', async () => {
      mockHttpAdapter.get.mockResolvedValue({ status: 404 });

      const result = await leaveService.getLeaveTypeById('lt_999');

      expect(result).toBeUndefined();
    });
  });

  describe('updateLeaveType', () => {
    it('should PUT to /leaves/{id} with partial payload', async () => {
      const id = 'lt_001';
      const updatePayload: UpdateLeaveTypePayload = {
        name: 'Updated Annual Leave',
        days: 25,
      };

      const mockResponse = {
        status: 200,
        data: {
          data: {
            id,
            name: 'Updated Annual Leave',
            days: 25,
            cycle: 'yearly',
            carryOver: false,
          } as LeaveType,
        },
      };

      mockHttpAdapter.put.mockResolvedValue(mockResponse);

      const result = await leaveService.updateLeaveType(id, updatePayload);

      expect(mockHttpAdapter.put).toHaveBeenCalledWith(`/leaves/${id}`, updatePayload);
      expect(result?.name).toBe('Updated Annual Leave');
      expect(result?.days).toBe(25);
    });

    it('should return undefined on non-200 status', async () => {
      mockHttpAdapter.put.mockResolvedValue({ status: 400 });

      const result = await leaveService.updateLeaveType('lt_001', { days: 30 });

      expect(result).toBeUndefined();
    });
  });

  describe('deleteLeaveType', () => {
    it('should DELETE /leaves/{id} and return success response', async () => {
      const mockResponse = {
        status: 200,
        data: { message: 'Leave type deleted successfully' },
      };

      mockHttpAdapter.delete.mockResolvedValue(mockResponse);

      const result = await leaveService.deleteLeaveType('lt_001');

      expect(mockHttpAdapter.delete).toHaveBeenCalledWith('/leaves/lt_001');
      expect(result?.message).toBe('Leave type deleted successfully');
    });

    it('should return undefined on non-200 status', async () => {
      mockHttpAdapter.delete.mockResolvedValue({ status: 404 });

      const result = await leaveService.deleteLeaveType('lt_999');

      expect(result).toBeUndefined();
    });
  });

  describe('getLeaveRequests', () => {
    it('should GET /leave-requests with optional filters', async () => {
      const mockResponse = {
        status: 200,
        data: {
          items: [
            {
              id: 'lr_001',
              employeeId: 'emp_001',
              employeeName: 'Jane Doe',
              leaveTypeId: 'lt_001',
              leaveTypeName: 'Annual Leave',
              startDate: '2026-02-10',
              endDate: '2026-02-12',
              days: 3,
              status: 'pending',
            },
          ],
          metadata: { total: 1 },
        },
      };

      mockHttpAdapter.get.mockResolvedValue(mockResponse);

      const result = await leaveService.getLeaveRequests();

      expect(mockHttpAdapter.get).toHaveBeenCalledWith('/leave-requests', {});
      // expect(result?.items).toHaveLength(1);
    });

    it('should pass filters to request', async () => {
      const filters = { status: 'pending' };

      mockHttpAdapter.get.mockResolvedValue({ status: 200, data: { items: [] } });

      await leaveService.getLeaveRequests(filters);

      expect(mockHttpAdapter.get).toHaveBeenCalledWith('/leave-requests', filters);
    });

    it('should return undefined on non-200 status', async () => {
      mockHttpAdapter.get.mockResolvedValue({ status: 500 });

      const result = await leaveService.getLeaveRequests();

      expect(result).toBeUndefined();
    });
  });
});
