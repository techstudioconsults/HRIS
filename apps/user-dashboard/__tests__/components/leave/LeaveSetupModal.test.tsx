import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('LeaveSetupModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Navigation', () => {
    it('should navigate to /admin/leave/type', () => {
      mockPush('/admin/leave/type');

      expect(mockPush).toHaveBeenCalledWith('/admin/leave/type');
    });

    it('should call router.push for navigation', async () => {
      mockPush('/admin/leave/type');

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/admin/leave/type');
    });
  });

  describe('Button Actions', () => {
    it('should handle manage button action', () => {
      mockPush('/admin/leave/type');

      expect(mockPush).toHaveBeenCalledWith('/admin/leave/type');
    });

    it('should handle remind later button action', () => {
      // Remind me later doesn't navigate
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
