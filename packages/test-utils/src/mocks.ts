/**
 * Common mocks and mock utilities
 * Useful for mocking API calls, localStorage, etc.
 */

import { vi } from 'vitest';

/**
 * Mock localStorage
 */
export const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] ?? null;
    },
  };
})();

/**
 * Mock sessionStorage
 */
export const mockSessionStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] ?? null;
    },
  };
})();

/**
 * Create a mock fetch response
 */
export const createMockFetch = (data: any, options: { status?: number; ok?: boolean } = {}) => {
  return vi.fn(() =>
    Promise.resolve({
      ok: options.ok ?? options.status === 200,
      status: options.status ?? 200,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
      blob: () => Promise.resolve(new Blob([JSON.stringify(data)])),
      clone: function () {
        return this;
      },
    } as Response)
  );
};

/**
 * Create a mock fetch rejection
 */
export const createMockFetchError = (message = 'Fetch failed') => {
  return vi.fn(() => Promise.reject(new Error(message)));
};

/**
 * Mock window.fetch globally
 */
export const mockFetch = (data: any) => {
  global.fetch = createMockFetch(data) as any;
};

/**
 * Reset mocks
 */
export const resetMocks = () => {
  vi.clearAllMocks();
};

