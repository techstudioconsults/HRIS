# Hide Default Teams & Roles from Tables

**Feature**: Filter "default" teams/sub-teams/roles from all table views
**Status**: Done
**Date**: 2026-05-03

## What Was Done

Applied a client-side `name.toLowerCase().trim() !== 'default'` filter at every
table render point. Items are hidden from display only — never deleted from the API.

## Files Changed

1. `teams/_views/team/components/team-table-section.tsx`
   - Added `visibleTeams` filter before `hasTeams` check and `AdvancedDataTable` data prop

2. `teams/_views/team-details/components/team-details-content.tsx`
   - Filtered `allSubTeams` before applying search filter

3. `teams/_views/sub-team-details/components/sub-team-details-content.tsx`
   - Renamed `rolesData` → `rolesRaw`, derived filtered `rolesData` from it

4. `teams/_views/team/index.tsx`
   - Added `.filter()` on `rolesData` before mapping to `availableRoles` prop on `AddNewEmployees`

---

# Payroll MSW Mock Data and Handlers

**Feature**: Payroll MSW Mock — Generate/Reschedule/Payslip + Multi-Payroll Combobox
**Status**: Done
**Date**: 2026-05-03

---

## What Was Done

Rewrote the two stale MSW mock files for the payroll module so they match
the real endpoint paths used by `service.ts`.

### mock-data.ts

- All types declared inline (no import from `../../types`) to avoid circular dependency.
- `MOCK_POLICY_ID = 'policy_01'` exported as a named constant.
- `mockPayrollPolicy` — status: complete, payday: 25, monthly, 1 bonus (Performance fixed 50_000), 1 deduction (Pension percentage 8), 2 approvers (Ngozi Adeyemi HR Director + Chidi Eze Finance Manager).
- `mockCompanyWallet` — First Bank, balance: 50_000_000.
- `mockPayrolls` — 4 entries (Feb completed, Mar completed, Apr partially_completed, May idle), all share policyId and walletBalance.
- `mockPayslipsByPayroll` — `Record<string, Payslip[]>` with 2 payslips per payroll (8 total). Built via a shared `buildPayslip` helper. Feb/Mar: both paid. Apr: one paid + one failed. May: both pending.
- `mockApprovals` — 2 pending approval entries for `payroll_may_2026`.

### handlers.ts

- `const BASE = '/api/v1'` pattern.
- Mutable in-memory state: `let payrollsDb` and `let payslipsDb` (immutable-style updates via spread).
- `await delay(200–500)` on every handler.
- 10 handlers covering all endpoints in `service.ts`:
  1. GET /payroll-policy/company
  2. GET /wallets/company
  3. GET /payrolls
  4. GET /payrolls/:id (404 if missing)
  5. POST /payrolls (creates new idle payroll, returns 201)
  6. PATCH /payrolls/:id (updates paymentDate, 404 if missing)
  7. POST /payrolls/:id/run (transitions to awaiting, returns 201)
  8. GET /payrolls/:id/approvals (returns mockApprovals for may, [] otherwise)
  9. GET /payslips?payrollId=... (filtered + paginated)
  10. POST /payslips (409 on duplicate employee+payroll, creates pending payslip, returns 201)

### \_testing/fixtures/mock-data.ts (incidental fix)

Updated the thin re-export barrel to export the new named exports
(old names like `mockPayrollSetup` / `mockPayrollRun` no longer exist).

## Files Changed

- `apps/user-dashboard/src/modules/@org/admin/payroll/_sdlc/_api/mocks/mock-data.ts`
- `apps/user-dashboard/src/modules/@org/admin/payroll/_sdlc/_api/mocks/handlers.ts`
- `apps/user-dashboard/src/modules/@org/admin/payroll/_sdlc/_testing/fixtures/mock-data.ts`
