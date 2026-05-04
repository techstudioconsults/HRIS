# Routes Migration — Inline Strings to Typed Constants

**Feature**: Migrate all inline route strings to `routes.*()` factory calls
**Status**: Complete
**Date**: 2026-05-04

## What Was Done

Replaced all inline hardcoded route strings across 37 files with typed `routes.*()` factory calls from `@/lib/routes/routes`. Zero new TypeScript errors introduced.

### Files Modified

**Auth (6 files)**

- `src/modules/@org/auth/_views/input-otp-card/index.tsx`
- `src/modules/@org/auth/_views/forgot-password/index.tsx`
- `src/modules/@org/auth/_views/reset-password/index.tsx`
- `src/modules/@org/auth/_views/register/index.tsx`
- `src/modules/@org/auth/_components/checkmail-card.tsx`
- `src/app/(public)/(auth)/login/continue/page.tsx`

**Employees (8 files)**

- `src/modules/@org/admin/employee/_components/forms/add-employee.tsx`
- `src/modules/@org/admin/employee/_components/forms/edit-employee.tsx`
- `src/modules/@org/admin/employee/hooks/use-employee-shortcuts.ts`
- `src/modules/@org/admin/employee/_views/employee/components/employee-table-section.tsx`
- `src/modules/@org/admin/employee/_views/table-data.tsx`
- `src/modules/@org/admin/employee/_views/employee-details/index.tsx`
- `src/modules/@org/admin/employee/_views/employee/index.tsx`
- `src/modules/@org/admin/employee/_views/employee/components/employee-header-section.tsx`
- `src/modules/@org/admin/dashboard/_components/dashboard-header.tsx`

**Teams (8 files)**

- `src/modules/@org/admin/teams/_hooks/use-team-shortcuts.ts`
- `src/modules/@org/admin/teams/hooks/use-team-shortcuts.ts`
- `src/modules/@org/admin/teams/_views/sub-team-details/index.tsx`
- `src/modules/@org/admin/teams/_views/team/components/team-table-section.tsx`
- `src/modules/@org/admin/teams/_views/team-details/index.tsx`
- `src/modules/@org/admin/teams/_views/team-details/components/sub-teams-tab.tsx`
- `src/modules/@org/admin/teams/_components/team-table.tsx`

**Leave (3 files)**

- `src/modules/@org/admin/leave/_components/forms/leave-setup-form.tsx`
- `src/modules/@org/admin/leave/_components/LeaveHeader.tsx`
- `src/modules/@org/admin/leave/_components/leave-setup-modal.tsx`

**Payroll (5 files)**

- `src/modules/@org/admin/payroll/_components/drawers/generate-run-payroll-drawer.tsx`
- `src/modules/@org/admin/payroll/_components/drawers/schedule-payroll-drawer.tsx`
- `src/modules/@org/admin/payroll/_components/forms/payroll-setup-form.tsx`
- `src/modules/@org/admin/payroll/_components/payroll-setup-modal.tsx`
- `src/modules/@org/admin/payroll/_components/tab-content/employee-information.tsx`
- `src/modules/@org/admin/payroll/_views/payroll.tsx`

**Onboarding (7 files)**

- `src/modules/@org/onboarding/_components/forms/company-profile.tsx`
- `src/modules/@org/onboarding/_components/forms/team-setup.tsx`
- `src/modules/@org/onboarding/_components/forms/employee/employee-setup.tsx`
- `src/modules/@org/onboarding/_views/welcome/index.tsx`
- `src/modules/@org/onboarding/_views/step-one/index.tsx`
- `src/modules/@org/onboarding/_views/step-two/index.tsx`
- `src/modules/@org/onboarding/_views/step-three/index.tsx`

**User / KBar (3 files)**

- `src/modules/@org/user/home/_views/recent-activities.tsx`
- `src/modules/@org/admin/dashboard/dashboard-home.tsx`
- `src/modules/@org/user/home/_views/home-page.tsx`
- `src/lib/kbar/kbar-provider.tsx`

---

# Previous: User Profile Page + `/api/profile` Route Handler

**Feature**: Profile page for logged-in employees
**Status**: Implementation Complete — Pending Review
**Date**: 2026-05-04

## What Was Done

Built the full frontend profile feature in 6 new files + 3 modified files.

### New Files

1. `src/modules/@org/user/profile/services/service.ts`
   — `UserProfileService` with `getMyProfile(id)` → `GET /employees/:id`
   — `updateMyProfile(id, data)` → `PATCH /employees/:id` (FormData, multipart)

2. `src/modules/@org/user/profile/services/use-service.ts`
   — `useUserProfileService()` returning `useGetMyProfile(employeeId)` + `useUpdateMyProfile()`
   — Keyed on `queryKeys.profile.current()` → `['user', 'profile', 'current']`
   — `enabled: !!employeeId` guard prevents fetching before session loads

3. `src/modules/@org/user/profile/_views/profile-view.tsx`
   — `UserProfileView` client component
   — Reads `session.user.id` via `useSession()` for the employee ID
   — Renders avatar, fullName, email, role, personal info (phone, gender, DOB, status), employment details (team, role, type, work mode, start date)
   — Loading: `ProfileSkeleton` (grid of Skeleton cells)
   — Error: inline error message

4. `src/modules/@org/user/profile/index.ts`
   — Barrel: exports `UserProfileView`, `useUserProfileService`

5. `src/app/(private)/(org)/user/profile/page.tsx`
   — Thin page shell at `/user/profile`

6. `src/app/api/profile/route.ts`
   — `GET /api/profile` Route Handler (the "repo backend" endpoint)
   — Reads `__hris_meta` cookie server-side, verifies HMAC, returns `{ id, fullName, email, role, permissions }`
   — Returns standard `{ status, data, timestamp }` envelope
   — No upstream call needed — session metadata is self-contained

### Modified Files

7. `src/lib/react-query/query-keys.ts`
   — Added `profile: { current: () => ['user', 'profile', 'current'] as const }`

8. `src/lib/tools/dependencies.ts`
   — Added `USER_PROFILE_SERVICE: Symbol('UserProfileService')`
   — Instantiated `userProfileService = new UserProfileService(httpAdapter)`
   — Registered in DI container

9. `src/modules/@org/user/index.ts`
   — Added `export * from './profile'`

## What Comes Next

Reviewer agent should check:

- Session guard: does the page correctly handle unauthenticated access (middleware already guards `/user/*`)?
- Error state UX — is inline error message enough or should there be a retry button?
- `useUpdateMyProfile` is wired but the view is read-only — acceptable for v1, flag for follow-up
- TypeScript: zero new errors introduced (all pre-existing)
