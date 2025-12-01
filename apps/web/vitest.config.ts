import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../vitest.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'web',
      root: './',
    //   include: [
    //     '__tests__/**/*.test.{ts,tsx}',
    //     'app/**/*.test.{ts,tsx}',
    //     'lib/**/*.test.{ts,tsx}',
    //   ],
    //   exclude: [
    //     '**/node_modules/**',
    //     '**/.next/**',
    //     '**/dist/**',
    //     '**/*.spec.ts',
    //   ],
    },
  })
)
