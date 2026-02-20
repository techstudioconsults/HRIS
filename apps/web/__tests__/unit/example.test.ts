import { describe, it, expect } from '@workspace/test-utils';

/**
 * Example unit test for web app
 */

describe('Web App Utils', () => {
  it('should validate email', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    expect(emailRegex.test('user@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
  });

  it('should generate UUID', () => {
    const uuid = crypto.randomUUID();
    expect(uuid).toHaveLength(36);
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});
