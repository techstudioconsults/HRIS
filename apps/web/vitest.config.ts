import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import baseConfig from '@workspace/test-utils/vitest.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @ts-ignore - Vite version mismatch between baseConfig and defineConfig
export default mergeConfig(
  baseConfig as any,
  defineConfig({
    // @ts-ignore - Vite version mismatch
    plugins: [react()],
    test: {
      setupFiles: [
        path.resolve(__dirname, '../../packages/test-utils/src/setup.ts'),
      ],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/e2e/**',
        '**/.next/**',
        '**/.{idea,git,cache,output,temp}/**',
      ],
      coverage: {
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'node_modules/**',
          'dist/**',
          'coverage/**',
          '**/.next/**',
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}',
          '**/__tests__/**',
          '**/setup.ts',
        ],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }) as any
);
