# Linting & Formatting Quick Reference

## Daily Commands

```bash
# Lint all code (runs across all packages)
pnpm lint

# Format all code
pnpm format

# Type check all packages
pnpm typecheck

# Run ESLint on specific app
pnpm lint -F user-dashboard
pnpm lint -F web

# Fix linting issues automatically
pnpm lint -- --fix

# Format without checking (applies formatting)
pnpm format --write
```

## Configuration Files

### Global (Root Level)

- `.prettierrc.json` - Prettier formatting rules (shared across all apps)
- `.prettierignore` - Files to ignore during formatting
- `.lintstagedrc.json` - Git pre-commit hook rules
- `.eslintrc.js` - Root ESLint config (ignores apps & packages)

### Shared Package

- `packages/eslint-config/` - Shared ESLint configurations
  - `base.js` - Base rules (used by all)
  - `next.js` - Next.js + React rules (used by apps/user-dashboard & apps/web)
  - `react-internal.js` - React library rules (used by packages/ui)

### App-Level

- `apps/user-dashboard/eslint.config.js` - Inherits from `@workspace/eslint-config/next`
- `apps/web/eslint.config.js` - Inherits from `@workspace/eslint-config/next`

## How It Works

### Pre-commit Hook (Automatic)

When you run `git commit`:

1. Husky triggers `.husky/pre-commit`
2. lint-staged runs on staged files only
3. ESLint fixes auto-fixable issues
4. Prettier formats files
5. Files are re-staged if changes were made

### Pre-push Hook (Automatic)

When you run `git push`:

1. Husky triggers `.husky/pre-push`
2. Full `pnpm lint` runs (all packages)
3. Full `pnpm typecheck` runs
4. Commit is blocked if checks fail

### Manual Linting

Run `pnpm lint` in your IDE terminal or before committing to catch issues early.

## IDE Integration

### IntelliJ IDEA / WebStorm

Automatically detects `.prettierrc.json` and ESLint configs. No extra setup needed.

To verify:

1. Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Should show "Configuration file: .eslintrc.js" or similar
3. Settings → Languages & Frameworks → JavaScript → Prettier
4. Should show "Prettier package" and "Configuration file: .prettierrc.json"

### VS Code

1. Install "Prettier - Code formatter" extension
2. Install "ESLint" extension
3. Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Fixing Common Issues

### "ESLint couldn't find a config file"

- Make sure `eslint.config.js` exists in the app directory
- Apps inherit from `@workspace/eslint-config` packages

### "Prettier config not found"

- Prettier looks for `.prettierrc.json` in project root
- All apps inherit this automatically

### Too many ESLint warnings

- Check rule severity in `packages/eslint-config/next.js`
- Change `"warning"` to `"off"` to disable rule, or `"error"` to enforce

### Formatting conflicts between ESLint and Prettier

- Already handled! ESLint uses `eslint-config-prettier` to disable conflicting rules
- Don't add formatting rules to ESLint config

## Adding New Rules

### Global ESLint Rules

Edit `packages/eslint-config/next.js` (for apps) or `base.js` (for all)

### Global Prettier Rules

Edit `.prettierrc.json` at root

### App-Specific Rules (Rarely needed)

Add to `apps/[app-name]/eslint.config.js` with proper config structure

## Troubleshooting

### Husky hooks not running

```bash
# Reinstall Husky
pnpm husky install

# Ensure .husky scripts have execute permission
chmod +x .husky/*
```

### Lint-staged not working

```bash
# Verify lint-staged is installed
pnpm ls lint-staged

# Check .lintstagedrc.json exists at root
cat .lintstagedrc.json
```

### ESLint v9 migration issues

- We use flat config format (`eslint.config.js`, not `.eslintrc`)
- FlatConfig is the modern ESLint v9+ format

## Performance Tips

- Lint-staged only checks staged files → fast pre-commit
- Husky pre-push runs full lint (catches everything)
- Use `pnpm lint -F [package]` to lint single package quickly
- IntelliJ real-time linting is usually fast enough for development

## Rules Philosophy

- ✅ **Catch real bugs** (unicorn, unused-imports, testing-library)
- ✅ **Maintain consistency** (formatting, naming conventions)
- ✅ **Type safety** (TypeScript strict checks)
- ❌ **No pedantic rules** that slow down development
- ⚠️ **Warnings** for best practices, **errors** only for bugs

See `packages/eslint-config/next.js` for the complete rule list.
