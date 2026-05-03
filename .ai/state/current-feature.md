# Current Feature Context

**Feature Name**: Payroll Summary Table — Bulk Actions (Delete + Export)
**Status**: Done
**Phase**: Implemented
**Started**: 2026-05-03
**Completed**: 2026-05-03

---

## Summary

Added bulk-select actions to the Employee Payroll Summary `AdvancedDataTable`.

Two actions implemented:

1. **Bulk Remove** — sequential `deletePayslip` calls with confirmation `AlertModal`.
2. **Bulk Export CSV** — client-side CSV generation (no backend call).

## Files Changed

- `packages/ui/src/lib/table/table.tsx` — added `onSelectionChange?: (selectedRows: T[]) => void` + `useEffect` after `useReactTable`
- `apps/user-dashboard/src/modules/@org/admin/payroll/_views/use-bulk-payroll-actions.ts` — new hook (bulk delete + export)
- `apps/user-dashboard/src/modules/@org/admin/payroll/_views/payroll.tsx` — wired hook, toolbar via `customFooterRenderer`, bulk delete `AlertModal`

## Next Tables (when user requests)

- Employee table
- Teams / sub-teams table
- Leave requests table
