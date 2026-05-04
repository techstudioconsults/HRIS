# File Upload Consolidation

**Feature**: Replace `FileUpload` (old lib component) with `FileUploader` (canonical component)
**Status**: Complete
**Date**: 2026-05-04

## What Was Done

Consolidated two file upload components into one canonical `FileUploader` exported from
`packages/ui/src/components/core/miscellaneous/file-uploader.tsx`.

### Improved `file-uploader.tsx`

- Added `formatBytes(bytes, decimals)` helper — used in dropzone hint and file list
- Added `onChange?: (files: File[]) => void` prop alongside `onValueChange` for simple form consumer usage
- Fixed `HTMLAttributes<HTMLDivElement>` conflict by using `Omit<..., 'onChange'>`
- Improved rejection error messages — now shows specific reason per file
- Improved dropzone UI: drag-active state uses primary colour, shows max files + per-file size + accepted extensions
- Uncommented and fixed file size display in `FileCard`
- Max size default raised from 2 MB to 5 MB

### Consumer files updated (5 files)

| File                          | Change                                                                                                                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `add-employee.tsx`            | Removed old `FileUpload` import + empty `<FileUploader />`, added properly configured `FileUploader` with `onChange`                                                    |
| `edit-employee.tsx`           | Replaced `FileUpload` import and usage with `FileUploader` + proper `accept` map                                                                                        |
| `resources/create-file.tsx`   | Replaced `FileUpload` with `FileUploader`, removed redundant "N files selected" paragraph, uses `value` + `onValueChange` for controlled state (allows cancel to reset) |
| `resources/create-folder.tsx` | Same as create-file                                                                                                                                                     |

### Avatar uploads untouched

`employee-details/index.tsx` and `user/profile/_views/profile-view.tsx` use native `<input type="file">` with instant upload on select — this is the correct pattern and was left as-is.

### Old component

`packages/ui/src/lib/file-upload/file-upload.tsx` — still present but no consumer references it. Can be deleted when ready.

## What Comes Next

- Delete `packages/ui/src/lib/file-upload/file-upload.tsx` when ready (no consumers remain)
- Consider exporting `FileUploader` from the UI package root barrel for even simpler import paths

---

# Previous: Notification Settings Tab Wiring

**Feature**: Wire email/inApp notification channel toggles to PATCH /employees/:id
**Status**: Complete
**Date**: 2026-05-04

Rewrote `notification-settings-tab.tsx`:

- Removed useForm / FormProvider / Save/Cancel buttons / AlertModal
- Used raw `Switch` components firing `PATCH /employees/:id` immediately on change
- Optimistic update with revert-on-error
- Hydrates from `profile.notifications.email/inApp` via `useGetMyProfile`
- Category checkboxes remain local state only (no API wired yet)
