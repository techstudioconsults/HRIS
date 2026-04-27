/**
 * Common test fixtures and test data factories
 * Used across unit and component tests
 */

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  createdAt: new Date('2024-01-01'),
};

export const mockAdmin = {
  id: 'admin-1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  createdAt: new Date('2024-01-01'),
};

/**
 * Factory function to create mock users with custom properties
 */
export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides,
});

/**
 * Factory function to create mock admin users
 */
export const createMockAdmin = (overrides = {}) => ({
  ...mockAdmin,
  ...overrides,
});

export const mockApiResponse = {
  success: true,
  data: null,
  message: 'Operation successful',
};

export const mockApiError = {
  success: false,
  error: 'An error occurred',
  message: 'Operation failed',
};
