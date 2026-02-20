import { describe, it, expect } from '@workspace/test-utils';

/**
 * Example unit test for user-dashboard
 */

describe('Dashboard Utils', () => {
  it('should format currency', () => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    expect(formatter.format(1000)).toBe('$1,000.00');
  });

  it('should parse date', () => {
    const date = new Date('2024-01-01');
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(0);
  });
});
