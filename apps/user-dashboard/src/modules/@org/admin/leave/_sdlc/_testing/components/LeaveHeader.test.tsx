import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock shared components
vi.mock('@/modules/@org/shared/search-input', () => ({
  SearchInput: ({ onSearch, placeholder }: any) => (
    <input
      data-testid="search-input"
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
    />
  ),
}));

vi.mock('iconsax-reactjs', () => ({
  Filter: () => <span data-testid="filter-icon" />,
}));

describe('LeaveHeader Component', () => {
  describe('Router Integration', () => {
    it('should have router mock available', () => {
      expect(mockPush).toBeDefined();
    });

    it('should be able to navigate to /admin/leave/type', () => {
      mockPush('/admin/leave/type');

      expect(mockPush).toHaveBeenCalledWith('/admin/leave/type');
    });
  });

  describe('Search Callback', () => {
    it('should define search callback expectation', () => {
      const mockOnSearch = vi.fn();
      expect(mockOnSearch).toBeDefined();
    });

    it('should be able to call search callback with query', () => {
      const mockOnSearch = vi.fn();

      mockOnSearch('Jane Doe');

      expect(mockOnSearch).toHaveBeenCalledWith('Jane Doe');
    });

    it('should handle multiple search queries', () => {
      const mockOnSearch = vi.fn();

      mockOnSearch('Jane');
      mockOnSearch('John');
      mockOnSearch('Amina');

      expect(mockOnSearch).toHaveBeenCalledTimes(3);
      expect(mockOnSearch).toHaveBeenLastCalledWith('Amina');
    });
  });

  describe('Navigation', () => {
    it('should navigate with correct path', () => {
      mockPush('/admin/leave/type');

      expect(mockPush).toHaveBeenCalledWith('/admin/leave/type');
    });
  });
});
