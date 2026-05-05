# Current Feature Context

**Feature Name**: Suspend & Terminate Employee
**Status**: Complete
**Phase**: Done
**Started**: 2026-05-05

## Summary

Wire the "Suspend Employee" and "Terminate Employee" dropdown items in the employee-detail view.
Both actions call `PATCH /employees/:id` with `status: inactive` via the existing `useUpdateEmployee` hook.
Each action is gated behind an `AlertDialog` confirmation (local `useState` per ADR-001 — destructive dialogs excluded from URL persistence).

## Files Modified

| File | Change |
| ---- | ------ |
| `modules/@org/admin/employee/_views/employee-details/index.tsx` | Added AlertDialog imports; enabled Suspend/Terminate dropdown items with `onSelect` handlers; added `isSuspendDialogOpen` / `isTerminateDialogOpen` state + `handleSuspendConfirm` / `handleTerminateConfirm` mutation handlers in `EmployeeDetails`; added two `AlertDialog` modals |
