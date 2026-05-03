# Current Feature Context

**Feature Name**: Payroll UX Fixes — Schedule Drawer Idle-Only + Generate CTA Visibility + Dual Generate Options
**Status**: Done
**Phase**: Frontend Implementer
**Started**: 2026-05-03
**Completed**: 2026-05-03

---

## Summary

Three payroll UX fixes covering schedule restrictions, CTA visibility, and generate options.

### 1. Schedule Payroll Drawer — Idle-Only Filtering

**File**: `schedule-payroll-drawer.tsx`

- Payroll list is now filtered to Only idle-status payrolls (`normalizeStatus(p.status) === 'idle'`), since these are the only ones eligible for rescheduling.
- Removed the unused `const status = selectedPayroll?.status !== 'idle'` variable.

### 2. Generate Payroll CTA Visibility

**File**: `_views/payroll.tsx:181`

- Changed `showGeneratePayroll` from `!isCompleted` (which showed the button for almost everything) to a targeted check: visible when the selected payroll is `complete` or `partial_completed`, or when no payroll is selected yet.
- No longer visible for `idle` or `awaiting` statuses (payrolls already generated / in progress).

### 3. Generate Payroll Drawer — Dual Generate Options

**File**: `generate-payroll-drawer.tsx`

- Replaced the single "Generate Payroll" button with two buttons:
  - **"Generate Instant"** (`variant="primary"`) — sends `paymentDate: new Date().toISOString()` immediately.
  - **"Schedule Payroll"** (`variant="primaryOutline"`) — opens a `CalendarModal` for date selection, then submits the selected date.
- Both buttons share the `isCreating` loading state.
- Added `CalendarModal` import, `isCalendarOpen` state, `scheduledDate` state.
- `handleGenerate` now accepts an optional `paymentDate?: string` parameter; `handleInstantGenerate` and `handleScheduledGenerate` delegate to it.

## Files Changed

1. `apps/user-dashboard/src/modules/@org/admin/payroll/_components/drawers/schedule-payroll-drawer.tsx`
2. `apps/user-dashboard/src/modules/@org/admin/payroll/_views/payroll.tsx`
3. `apps/user-dashboard/src/modules/@org/admin/payroll/_components/drawers/generate-payroll-drawer.tsx`
