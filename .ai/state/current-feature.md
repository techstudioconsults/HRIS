# Current Feature Context

**Feature Name**: Dashboard Overview Period (Year Selector)
**Status**: In Progress
**Phase**: Implementation
**Started**: 2026-05-04

## Summary

Wire the ComboBox in DashboardHeader as a year selector (2020–current year).
The selected year flows to all endpoint calls that accept a `year` parameter
(payroll summary, attendance overview). Persisted via nuqs URL query param `?year=`.

## Files Created

| File                                        | Purpose                                 |
| ------------------------------------------- | --------------------------------------- |
| `lib/nuqs/use-dashboard-overview-period.ts` | Shared nuqs hook for `year` query param |

## Files Modified

| File                                               | Change                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------- |
| `admin/dashboard/_components/dashboard-header.tsx` | Enable ComboBox with year options, wire year to data hooks and CSV export |
| `admin/dashboard/_components/card-section.tsx`     | Use `year` from nuqs instead of `currentYear`                             |
| `@org/_components/payrool-linechart.tsx`           | Use `year` from nuqs instead of `currentYear`                             |
| `@org/_components/attendance-barchart.tsx`         | Use `year` from nuqs, update subtitle to show selected year               |
