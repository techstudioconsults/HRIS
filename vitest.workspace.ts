import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // Root level tests
  {
    test: {
      name: 'root',
      include: ['tests/**/*.test.{ts,tsx}'],
      exclude: ['**/node_modules/**', '**/apps/**', '**/packages/**'],
    },
  },
  {
    test: {
      globals: true,
      environment: 'jsdom',
      name: 'web',
      root: './apps/web',
      include: ['**/*.test.{ts,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/.next/**',
        '**/dist/**',
        '**/*.spec.ts',
      ],
    },
  },
  {
    test: {
      globals: true,
      environment: 'jsdom',
      name: 'user-dashboard',
      root: './apps/user-dashboard',
      include: ['**/*.test.{ts,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/.next/**',
        '**/dist/**',
        '**/*.spec.ts',
      ],
    },
  },
  {
    test: {
      globals: true,
      environment: 'node',
      name: 'ui',
      root: './packages/ui',
      include: ['**/*.test.{ts,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**'],
    },
  },
])
