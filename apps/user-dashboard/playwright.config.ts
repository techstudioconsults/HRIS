import { defineConfig } from "@playwright/test";

import baseConfig from "../../playwright.config.base";

export default defineConfig({
  ...baseConfig,
  testDir: "./__tests__",
  testMatch: ["**/*.spec.ts"],
  use: {
    ...baseConfig.use,
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
  },
});
