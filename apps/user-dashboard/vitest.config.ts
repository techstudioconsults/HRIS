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
  }),
);
