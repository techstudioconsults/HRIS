# Fix Integration Tests — Auth & Onboarding

**Feature**: Bugfix - Failing Tests
**Status**: Complete
**Date**: 2026-05-06

### Root Causes

6 integration tests failed because the source code was refactored following best practices:

| Test | Root Cause |
|------|-----------|
| Auth I-01, I-05 | Code no longer calls `toast.success` on login/OTP success — only `router.push` |
| Auth I-02, I-06 | Code replaced toast with `setError` (inline form field errors) for failure feedback |
| Auth I-07 | Toast success message changed from `'Request Sent Successfully'` to `'A new OTP has been sent to your email.'` |
| Onboarding I-02 | Schema now requires `industry` and `size` fields — test didn't fill them → form stayed invalid → button disabled → mutation never called |

### Fixes Applied

- **Auth I-01/I-05**: Removed `mockToast.success` expectations, kept `mockPush` navigation check
- **Auth I-02/I-06**: Replaced toast assertions with `mockLoginWithPassword`/`mockLoginWithOTP` spy call + `mockPush` not-called checks
- **Auth I-07**: Updated expected toast message to `'A new OTP has been sent to your email.'`
- **Onboarding I-02**: Added `user.type` calls for industry and size fields

### Result
- 61 tests pass, 0 failures across all packages
- `pnpm turbo run test` passes clean
