# Settings Module — State Management

_How state is managed across the six settings tabs._

## State Categories

### Server State (TanStack Query)

Each settings tab has its own query key and fetch/mutate pair. Settings are relatively static (updated infrequently), so staleTime is generous.

| Hook                      | Query Key                       | staleTime |
| ------------------------- | ------------------------------- | --------- |
| `useAccountSettings`      | `['settings', 'account']`       | 10 min    |
| `usePayrollSettings`      | `['settings', 'payroll']`       | 10 min    |
| `useSecuritySettings`     | `['settings', 'security']`      | 10 min    |
| `useHRSettings`           | `['settings', 'hr']`            | 10 min    |
| `useNotificationSettings` | `['settings', 'notifications']` | 10 min    |
| `useRoles`                | `['settings', 'roles']`         | 5 min     |

On successful mutation, each hook uses `queryClient.setQueryData` with the API response (not `invalidateQueries`) to avoid an unnecessary re-fetch — the backend returns the updated record in the response body.

### Form State (React Hook Form)

Each tab has its own isolated `useForm` instance. Key rules:

- On tab mount, `reset(data)` is called once the API response lands — this prevents stale default values.
- `formState.isDirty` gates the Save button (disabled when no changes made).
- On save success: `reset(savedData)` to sync the form's baseline to the new values and clear dirty state.
- On save failure: form values are **not** reset — the admin's edits are preserved so they can retry.

The Roles Management tab uses `useFieldArray` for the dynamic permission checkbox list.

### UI State (Local)

| State                          | Location                           | Description                                               |
| ------------------------------ | ---------------------------------- | --------------------------------------------------------- |
| Active settings tab            | URL param `?tab=account`           | Persisted in URL for deep-link and refresh support        |
| Role editor drawer open/closed | `useState` in `RolesManagementTab` | Controls the create/edit drawer visibility                |
| Logo preview URL               | `useState` in `LogoUploadField`    | Object URL created from selected File; revoked on unmount |
| Upload progress                | `useState` in `LogoUploadField`    | Percentage for progress indicator during logo upload      |

## Anti-patterns to Avoid

- Do not hold settings values in a global Zustand store — TanStack Query cache is the source of truth.
- Do not `reset()` the form on save error — users lose their changes.
- Do not derive the active tab from component state — always read from the URL `?tab` param so browser back works correctly.
