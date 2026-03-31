import { nextJsConfig } from '@workspace/eslint-config/next';

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@workspace/ui/lib',
              message:
                'Do not import the @workspace/ui/lib barrel in apps/web.' +
                ' Use leaf imports like @workspace/ui/lib/button or @workspace/ui/lib/loading.',
            },
            {
              name: '@workspace/ui/lib/index',
              message:
                'Do not import the @workspace/ui/lib barrel in apps/web. Use leaf imports instead.',
            },
          ],
          patterns: [
            {
              group: ['react-icons', 'react-icons/*'],
              message:
                'apps/web icon policy allows lucide-react or @tabler/icons-react only.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "ImportExpression[source.value='@workspace/ui/lib']",
          message:
            'Do not dynamically import the @workspace/ui/lib' +
            ' barrel in apps/web. Import a leaf module path.',
        },
      ],
    },
  },
];
