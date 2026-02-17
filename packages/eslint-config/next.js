import js from "@eslint/js";
import pluginNext from "@next/eslint-plugin-next";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginTestingLibrary from "eslint-plugin-testing-library";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import pluginVitest from "eslint-plugin-vitest";
import globals from "globals";
import tseslint from "typescript-eslint";

import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for Next.js applications with comprehensive rules.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    plugins: {
      unicorn: pluginUnicorn,
    },
    rules: {
      "unicorn/filename-case": ["error", { cases: { kebabCase: true, pascalCase: true, camelCase: true } }],
      "unicorn/no-null": "off",
    },
  },
  {
    plugins: {
      "unused-imports": pluginUnusedImports,
    },
    rules: {
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
    },
  },
  {
    plugins: {
      vitest: pluginVitest,
    },
    rules: {
      "no-console": "error",
    },
  },
  {
    plugins: {
      "testing-library": pluginTestingLibrary,
    },
  },
  {
    settings: {
      vitest: { typecheck: true },
    },
  },
  {
    files: [".eslintrc.*js", ".vite(|st).(js|ts)"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  {
    files: ["*.d.ts"],
    rules: {
      "unicorn/prevent-abbreviations": "off",
    },
  },
  {
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
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "unicorn/consistent-function-scoping": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "vitest/require-hook": "off",
      "vitest/max-expects": "off",
      "vitest/no-hooks": "off",
      "testing-library/no-node-access": ["error", { allowContainerFirstChild: true }],
    },
  },
];
