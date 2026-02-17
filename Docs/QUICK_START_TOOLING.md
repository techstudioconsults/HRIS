# Quick Start: New Setup Guide

## For Developers: First Time Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Husky Hooks

```bash
pnpm husky install
```

### 3. Verify Everything Works

```bash
# Test linting
pnpm lint

# Test formatting
pnpm format --check

# Test type checking
pnpm typecheck
```

**That's it!** Your IDE will automatically detect the ESLint and Prettier configs.

## Daily Development Commands

```bash
# Run in watch mode (development)
pnpm dev

# Format code (applies automatically)
pnpm format

# Check if code needs formatting
pnpm format --check

# Lint code
pnpm lint

# Lint and fix auto-fixable issues
pnpm lint -- --fix

# Type check
pnpm typecheck

# Build
pnpm build
```

## Automatic Git Hooks (You Don't Need to Do Anything!)

### Before Commit (Pre-commit)

When you run `git commit`:

- ✅ Automatically runs lint-staged
- ✅ ESLint fixes auto-fixable issues
- ✅ Prettier formats files
- ✅ Changes are re-staged

### Before Push (Pre-push)

When you run `git push`:

- ✅ Automatically runs full lint check
- ✅ Automatically runs type checking
- ✅ Blocks push if issues found

## Configuration Files (Reference)

### Global Configs (Used by All Apps)

```
Root Level
├── .prettierrc.json          ← Prettier formatting rules
├── .prettierignore           ← Files to ignore
├── .eslintrc.js              ← Root ESLint config
└── .lintstagedrc.json        ← Git hook rules
```

### Shared ESLint Package

```
packages/eslint-config/
├── base.js                   ← Base rules (all)
├── next.js                   ← Next.js + React rules
└── react-internal.js         ← React library rules
```

### Per-App Configs

```
apps/user-dashboard/
└── eslint.config.js          ← Inherits from next.js (3 lines)

apps/web/
└── eslint.config.js          ← Inherits from next.js (3 lines)

packages/ui/
└── eslint.config.js          ← Inherits from react-internal.js
```

## IDE Setup

### IntelliJ IDEA / WebStorm

✅ **Automatic!** It detects `.prettierrc.json` and ESLint configs automatically.

To verify:

1. Open Settings
2. Languages & Frameworks → JavaScript → Prettier
3. Should show: Configuration file: `.prettierrc.json`
4. Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
5. Should show: Configuration file detected

### VS Code

1. Install extensions:
   - "Prettier - Code formatter"
   - "ESLint"

2. Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Troubleshooting

### "ESLint couldn't find a config file"

```bash
# Ensure you have eslint.config.js in your app
# Run from the app directory:
cd apps/user-dashboard
npx eslint src
```

### "Prettier formatting differs in IDE vs CLI"

```bash
# Make sure root .prettierrc.json is being used
# Check IDE settings point to root .prettierrc.json
# Restart IDE after config changes
```

### Husky hooks not running

```bash
# Reinstall husky
pnpm husky install

# Check hooks are executable
ls -la .husky/
# Should show x permission

# If not:
chmod +x .husky/*
```

### "Too many ESLint warnings" on push

```bash
# Fix warnings locally first
pnpm lint -- --fix

# Then try push again
git push
```

## Advanced: Custom Rules per App

If you need app-specific ESLint rules (rare):

### Example: apps/user-dashboard/eslint.config.js

```javascript
import { nextJsConfig } from '@workspace/eslint-config/next';

// Add custom rules
const customRules = [
  ...nextJsConfig,
  {
    rules: {
      'your-custom-rule': 'off',
    },
  },
];

export default customRules;
```

## Documentation

For detailed information, see:

- `ESLINT_PRETTIER_CONSOLIDATION.md` - Complete technical summary
- `LINTING_GUIDE.md` - Detailed developer guide
- `IMPLEMENTATION_CHECKLIST.md` - Implementation details
- `ARCHITECTURE_COMPARISON.md` - Before/after comparison

## Key Points to Remember

✅ **Single source of truth:**

- All Prettier config: `.prettierrc.json` (root)
- All ESLint rules: `@workspace/eslint-config` (packages)
- All dependencies: `package.json` (root)

✅ **No duplicates:**

- Only one Prettier config file
- Only one lint-staged config file
- No duplicate ESLint plugins
- No version conflicts

✅ **Automatic:**

- Husky hooks run automatically
- IDE detects configs automatically
- lint-staged runs on commit automatically
- Type checking runs on push automatically

❌ **Don't:**

- Don't create `.prettierrc.cjs` in apps (use root)
- Don't add ESLint plugins to app package.json (add to root)
- Don't duplicate configuration files (maintain in one place)

## Questions?

If something doesn't work:

1. Check the documentation files listed above
2. Verify Husky hooks are installed: `pnpm husky install`
3. Check file permissions: `ls -la .husky/`
4. Verify dependencies installed: `pnpm install`
5. Clear cache: `pnpm store prune` and reinstall

## Success Indicators

✅ You're ready when:

- `pnpm lint` runs successfully
- `pnpm format` works without errors
- `pnpm typecheck` passes
- IDE shows no ESLint errors
- Code is automatically formatted on save (IDE)
- Git hooks run without errors

Happy coding! 🚀
