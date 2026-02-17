import { resolve } from "node:path";
import { defineConfig, mergeConfig } from "vitest/config";

import baseConfig from "../../vitest.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: "user-dashboard",
      root: "./",
      //   include: ["__tests__/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
      //   exclude: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/*.spec.ts"],
    },
    resolve: {
      alias: {
        // Ensure Vitest/Vite can resolve workspace UI imports that are used in the Next app.
        // Alias to directories so subpath imports work, e.g. `@workspace/ui/lib/button`.
        "@workspace/ui/lib": resolve(__dirname, "../../packages/ui/src/lib"),
        "@workspace/ui/components": resolve(__dirname, "../../packages/ui/src/components"),
        "@workspace/ui/hooks": resolve(__dirname, "../../packages/ui/src/hooks"),
      },
    },
  }),
);
