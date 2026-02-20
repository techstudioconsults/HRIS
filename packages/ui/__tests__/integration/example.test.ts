import { describe, it, expect } from '@workspace/test-utils';

/**
 * Example integration test
 * Place tests that verify multiple components working together
 */

describe('Integration Example', () => {
  it('should work with fixtures', () => {
    const mockData = {
      id: 1,
      name: 'Test Item',
    };

    expect(mockData).toBeDefined();
    expect(mockData.name).toBe('Test Item');
  });
});
