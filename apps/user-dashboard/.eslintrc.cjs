/**
 * To use this configuration, you need to install the following dependencies:
 *
 * eslint@^8.57.0 @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-unicorn eslint-plugin-unused-imports@^3.2.0 prettier eslint-config-prettier eslint-plugin-prettier @ianvs/prettier-plugin-sort-imports prettier-plugin-tailwindcss
 *
 *
 * To Replicate the vitest configuration, you need to install the following dependencies:
 *
 * eslint-plugin-vitest@^0.4.1 eslint-testing-library
 *
 * Also replicate the .prettierrc.cjs file in the root of your project.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "plugin:vitest/all",
    "eslint:recommended",
    "next/core-web-vitals",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:unicorn/recommended",
    "plugin:testing-library/react",
    "prettier", // Must be last - disables conflicting ESLint rules
  ],
  ignorePatterns: ["dist", "node_modules"],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "react",
    "unicorn",
    "unused-imports",
    "vitest",
    "testing-library",
    // "align-assignments",
  ],
  rules: {
    // "align-assignments/align-assignments": ["warn", { requiresOnly: false }], // Warns when assignments are not aligned
    "no-console": "error",
    "react/prop-types": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "unicorn/filename-case": ["error", { cases: { kebabCase: true, pascalCase: true, camelCase: true } }],
    "unicorn/no-null": "off",
  },
  settings: {
    react: { version: "detect" },
    vitest: { typecheck: true },
  },
  overrides: [
    {
      files: [".eslintrc.*js", ".vite(|st).(js|ts)"],
      env: { node: true },
    },
    {
      files: ["*.d.ts"],
      rules: {
        "unicorn/prevent-abbreviations": "off",
      },
    },
    {
      // Playwright E2E test files - disable Vitest rules
      files: ["**/*.spec.ts", "**/*.spec.tsx", "**/e2e/**/*.ts"],
      rules: {
        "vitest/consistent-test-filename": "off",
        "vitest/require-hook": "off",
        "vitest/max-expects": "off",
        "vitest/no-hooks": "off",
        "vitest/expect-expect": "off",
      },
    },
    {
      // Test files - allow inner function declarations
      files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
      rules: {
        "unicorn/consistent-function-scoping": "off",
      },
    },
    {
      files: ["!*.test.(js|jsx|ts|tsx)"],
      rules: {
        "vitest/require-hook": "off",
        "vitest/max-expects": "off",
        "vitest/no-hooks": "off",
        "testing-library/no-node-access": ["error", { allowContainerFirstChild: true }],
      },
    },
  ],
};
