import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../vitest.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'ui',
      root: './',
      //   include: [
      //     'src/**/__tests__/**/*.test.{ts,tsx}',
      //     'src/**/*.test.{ts,tsx}',
      //     '__tests__/**/*.test.{ts,tsx}',
      //   ],
      //   exclude: ['**/*.spec.ts'],
    },
  })
)
