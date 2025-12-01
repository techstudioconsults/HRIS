import { defineConfig } from 'vitest/config'
import baseConfig from '../../vitest.config'

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    name: 'controller-dashboard',
    root: './',
    // include: ['__tests__/**/*.test.{ts,tsx}', 'app/**/*.test.{ts,tsx}'],
    // exclude: [
    //   '**/node_modules/**',
    //   '**/.next/**',
    //   '**/dist/**',
    //   '**/*.spec.ts',
    // ],
  },
})
