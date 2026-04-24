# Settings Module — Data Flow

_How settings data moves between the API, TanStack Query cache, and form state._

## Read Flow (Tab Load)

```
HR admin clicks "Payroll" tab
  → URL: /admin/settings?tab=payroll
    → PayrollSettingsTab mounts
      → usePayrollSettings() fires
        → [cache miss] HttpAdapter.get('/api/v1/settings/payroll')
          → API: 200 { status, data: PayrollSettings, timestamp }
        → TanStack Query cache set: ['settings', 'payroll']
        → RHF reset(data) → form pre-populated with current values
```

## Write Flow (Tab Save)

```
HR admin modifies pay cycle to "monthly" and clicks "Save Changes"
  → RHF handleSubmit(onSubmit) — Zod validation passes
    → useUpdatePayrollSettings.mutate(formValues)
      → HttpAdapter.patch('/api/v1/settings/payroll', formValues)
        → API: 200 { status, data: PayrollSettings, timestamp }
      → onSuccess:
          queryClient.setQueryData(['settings', 'payroll'], data)   // update cache with response
          toast.success("Payroll settings saved")
      → onError:
          toast.error("Failed to save payroll settings — please try again")
          // form values retained; no reset
```

## Roles Write Flow (Create Custom Role)

```
HR admin submits RoleEditorDrawer (name="Recruitment Lead", permissions=[...])
  → useCreateRole.mutate(payload)
    → HttpAdapter.post('/api/v1/settings/roles', payload)
      → API: 201 { status, data: Role }
    → onSuccess:
        queryClient.invalidateQueries(['settings', 'roles'])
        drawer closes
        toast.success("Role created")
```

## Cache Keys

| Hook                      | Query Key                       |
| ------------------------- | ------------------------------- |
| `useAccountSettings`      | `['settings', 'account']`       |
| `usePayrollSettings`      | `['settings', 'payroll']`       |
| `useSecuritySettings`     | `['settings', 'security']`      |
| `useHRSettings`           | `['settings', 'hr']`            |
| `useNotificationSettings` | `['settings', 'notifications']` |
| `useRoles`                | `['settings', 'roles']`         |
