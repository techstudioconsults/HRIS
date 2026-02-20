import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import baseConfig from '@workspace/test-utils/vitest.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [react()],
    test: {
      setupFiles: [path.resolve(__dirname, '../test-utils/src/setup.ts')],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  })
);
