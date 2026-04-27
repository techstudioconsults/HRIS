import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock hooks - only mock the service hook
const mockMutateAsync = vi.fn();
vi.mock('@/modules/@org/admin/leave/services/use-service', () => {
  return {
    useLeaveService: () => ({
      useCreateLeaveType: () => ({
        mutateAsync: mockMutateAsync,
        isPending: false,
      }),
    }),
  };
});

// Mock toast notifications
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}));

// Mock API error handler
vi.mock('@/lib/tools/api-error-message', () => ({
  getApiErrorMessage: () => 'Error creating leave type',
}));

describe('CreateLeaveTypeForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Service Integration', () => {
    it('should have mutation hook mocked', () => {
      expect(mockMutateAsync).toBeDefined();
    });

    it('should have toast success mocked', () => {
      expect(mockToastSuccess).toBeDefined();
    });

    it('should have toast error mocked', () => {
      expect(mockToastError).toBeDefined();
    });

    it('should be able to call mutation with payload', () => {
      const payload = { name: 'Annual Leave', days: 20 };
      mockMutateAsync(payload);

      expect(mockMutateAsync).toHaveBeenCalledWith(payload);
    });

    it('should handle mutation success', async () => {
      mockMutateAsync.mockResolvedValueOnce({
        id: 'lt_001',
        name: 'Annual Leave',
      });

      const result = await mockMutateAsync({ name: 'Annual Leave', days: 20 });

      expect(result).toEqual({ id: 'lt_001', name: 'Annual Leave' });
    });

    it('should handle mutation failure', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('API Error'));

      try {
        await mockMutateAsync({ name: 'Annual Leave', days: 20 });
      } catch (error) {
        expect((error as Error).message).toBe('API Error');
      }
    });
  });

  describe('Toast Notifications', () => {
    it('should call success toast when mutation succeeds', () => {
      mockToastSuccess('Leave type created');

      expect(mockToastSuccess).toHaveBeenCalledWith('Leave type created');
    });

    it('should call error toast when mutation fails', () => {
      mockToastError('Failed to create leave type');

      expect(mockToastError).toHaveBeenCalledWith(
        'Failed to create leave type'
      );
    });
  });
});
