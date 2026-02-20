# Test Setup Verification Checklist

Use this checklist to verify your test setup is working correctly.

## ✅ Installation & Setup

- [ ] Run `pnpm install` successfully
- [ ] No dependency conflicts
- [ ] `node -v` shows version 20+
- [ ] `pnpm -v` shows version 10.4.1+

## ✅ Files Created

### Test Utilities Package

- [ ] `packages/test-utils/package.json` exists
- [ ] `packages/test-utils/vitest.config.ts` exists
- [ ] `packages/test-utils/src/setup.ts` exists
- [ ] `packages/test-utils/src/fixtures.ts` exists
- [ ] `packages/test-utils/src/mocks.ts` exists
- [ ] `packages/test-utils/src/index.ts` exists
- [ ] `packages/test-utils/README.md` exists

### Configuration Files

- [ ] Root `turbo.json` has test tasks
- [ ] Root `package.json` has test scripts
- [ ] `playwright.config.ts` in root
- [ ] `vitest.config.ts` in `apps/user-dashboard/`
- [ ] `vitest.config.ts` in `apps/web/`
- [ ] `vitest.config.ts` in `packages/ui/`

### Example Tests

- [ ] `packages/ui/__tests__/unit/example.test.ts` exists
- [ ] `packages/ui/__tests__/components/example.test.tsx` exists
- [ ] `packages/ui/__tests__/integration/example.test.ts` exists
- [ ] `apps/user-dashboard/__tests__/unit/example.test.ts` exists
- [ ] `apps/user-dashboard/__tests__/components/example.test.tsx` exists
- [ ] `apps/user-dashboard/e2e/home.e2e.spec.ts` exists
- [ ] `apps/web/__tests__/unit/example.test.ts` exists
- [ ] `apps/web/e2e/landing.e2e.spec.ts` exists

### Documentation

- [ ] `TESTING.md` exists
- [ ] `TESTING_QUICKSTART.md` exists
- [ ] `TEST_EXAMPLES.md` exists
- [ ] `TEST_SETUP_SUMMARY.md` exists

### CI/CD

- [ ] `.github/workflows/test.yml` exists
- [ ] `.vscode/settings.json` updated with test extensions

## ✅ Running Tests

### Unit & Component Tests (Vitest)

```bash
# Test these commands:
pnpm test                    # Run once
pnpm test:watch             # Watch mode
pnpm test:ui                # Interactive dashboard
pnpm test:coverage          # Coverage report
```

Expected results:

- [ ] All tests pass (green ✅)
- [ ] Test output shows multiple test files
- [ ] No errors or warnings
- [ ] Coverage report generates

### Per-Package Tests

```bash
# Test per-package commands:
turbo test --filter=@workspace/ui
turbo test --filter=user-dashboard
turbo test --filter=web
```

Expected results:

- [ ] Each package tests pass
- [ ] Output shows Turbo caching

### E2E Tests (Playwright)

```bash
# Test E2E (requires dev server):
pnpm dev &  # Start dev server
pnpm test:e2e
```

Expected results:

- [ ] E2E tests complete (headless browser)
- [ ] HTML report generated in `playwright-report/`

### E2E UI Mode (Interactive)

```bash
# Test interactive mode:
pnpm test:e2e:ui
```

Expected results:

- [ ] Browser window opens
- [ ] Can click through test steps
- [ ] Inspector shows elements

## ✅ Dependencies

### Root Dependencies Added

- [ ] `@playwright/test` - ^1.48.1
- [ ] `@testing-library/jest-dom` - ^6.6.3
- [ ] `@testing-library/react` - ^16.1.0
- [ ] `@vitest/ui` - ^2.1.8
- [ ] `jsdom` - ^25.0.1
- [ ] `vitest` - ^2.1.8
- [ ] `@vitest/coverage-v8` - ^2.1.8

### Verify Installation

```bash
pnpm list vitest @playwright/test @testing-library/react
```

Expected: All packages listed with correct versions

## ✅ Turbo Integration

```bash
# Verify Turbo tasks:
turbo run test --help
```

Expected output:

- [ ] Shows test, test:watch, test:ui, test:coverage, test:e2e tasks
- [ ] No errors

## ✅ VS Code Integration (Optional)

If using VS Code:

- [ ] Vitest extension installed (vitest.explorer)
- [ ] Playwright extension installed (ms-playwright.playwright)
- [ ] Can see test icons in file explorer
- [ ] Can run tests from editor

## ✅ Git Hooks (If Using Husky)

```bash
# Verify pre-commit hook:
git config core.hooksPath
```

Expected: `.husky` directory exists

## ✅ CI/CD Workflow

### GitHub Actions

- [ ] `.github/workflows/test.yml` exists
- [ ] Contains unit-tests job
- [ ] Contains e2e-tests job
- [ ] Has proper Node version (20.x)

### Verify Locally

```bash
# Check workflow syntax:
gh workflow view test.yml
```

## 🐛 Troubleshooting

If any check fails:

### Tests won't run

```bash
# Clear and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Import errors

- [ ] Verify `@workspace/test-utils` is imported correctly
- [ ] Check `vitest.config.ts` has correct path aliases
- [ ] Ensure `tsconfig.json` extends correctly

### E2E tests fail

- [ ] Verify dev server is running: `pnpm dev`
- [ ] Check `playwright.config.ts` baseURL is correct
- [ ] Install Playwright browsers: `pnpm exec playwright install`

### Coverage too low

- [ ] Coverage threshold might be too high
- [ ] Check `packages/test-utils/vitest.config.ts` thresholds
- [ ] Verify test files are in correct locations

## 📊 Success Metrics

Your test setup is working when:

✅ Unit tests run with `pnpm test`  
✅ Watch mode works with `pnpm test:watch`  
✅ UI dashboard opens with `pnpm test:ui`  
✅ Coverage report generates with `pnpm test:coverage`  
✅ E2E tests run with `pnpm test:e2e`  
✅ All example tests pass  
✅ No import errors  
✅ Turbo caching works for tests

## 📝 Next Steps

Once verification is complete:

1. **Delete example tests** (in `__tests__` and `e2e` folders)
2. **Write real tests** for your components
3. **Review** `TEST_EXAMPLES.md` for patterns
4. **Set up** pre-commit hooks (optional)
5. **Configure** coverage thresholds if needed
6. **Integrate** with your CI/CD pipeline

## 🚀 You're Ready!

If all checks pass, your test infrastructure is **production-ready**.

Start writing tests! 🎉

---

**Questions?** Check:

- `TESTING_QUICKSTART.md` - 5-minute guide
- `TESTING.md` - Complete reference
- `TEST_EXAMPLES.md` - 30+ copy-paste examples
