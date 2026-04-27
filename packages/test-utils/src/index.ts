/**
 * Test utilities main export
 * Re-exports commonly used testing libraries and custom utilities
 *
 * Note: Jest DOM matchers are only loaded in Vitest environment via setup.ts
 * This file does NOT import jest-dom to avoid issues with Playwright and other tools
 */

export * from '@testing-library/react';
export {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
export {
  describe,
  it,
  test,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  vi,
} from 'vitest';
