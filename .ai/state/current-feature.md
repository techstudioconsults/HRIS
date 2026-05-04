# Current Feature Context

**Feature Name**: Employee Avatar Upload — Employee Details View
**Status**: Done
**Phase**: Complete
**Started**: 2026-05-03
**Completed**: 2026-05-03

---

## Summary

Added `EmployeeAvatarUpload` component to the employee details sidebar card.
Clicking/activating the avatar opens a file picker; the selected image is sent via PATCH
`/employees/:id` with `FormData` key `avatar`. Optimistic preview shown immediately;
spinner overlay while uploading; cache invalidation handled by existing `useUpdateEmployee` hook.

## Files Changed

1. `apps/user-dashboard/src/modules/@org/admin/employee/_views/employee-details/index.tsx`
   - Added `EmployeeAvatarUpload` inline component (lines 166–289)
   - Added `useRef`, `useState` to React imports
   - Added `toast` from `sonner`

## Implementation Details

- **Optimistic preview**: `URL.createObjectURL` shown immediately on file select
- **Stale avatar fix**: preview cleared via `useEffect` watching `avatarUrl` (waits for server refetch, avoids flash)
- **Memory cleanup**: `pendingObjectUrlRef` tracks blob URL; revoked on error or unmount
- **Accessibility**: `role="button"`, `tabIndex`, `aria-label`, `aria-disabled`, `onKeyDown` (Enter/Space)
- **File validation**: JPEG/PNG/WebP only, max 5 MB — user-friendly toast on rejection
- **Loading UX**: spinner overlay forced `opacity-100` while uploading (touch device safe)
- **Error handling**: revert preview + `toast.error` from sonner
