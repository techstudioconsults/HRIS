# Settings Module — Fetch Flow Sequence Diagram

## Tab Load (Cache Miss)

```
HR Admin Browser      SettingsView         TanStack Query         Backend API
      |                    |                     |                     |
      |-- GET /admin/settings?tab=payroll ->      |                     |
      |<-- RSC shell -------|                     |                     |
      |                    |                      |                     |
      |-- Hydrate PayrollSettingsTab               |                     |
      |-- usePayrollSettings() fires               |                     |
      |                    |-- ['settings','payroll'] cache miss? Yes    |
      |                    |-----------------------------> GET /api/v1/settings/payroll -->
      |<-- skeleton form --|                      |                     |
      |                    |                      |<-- 200 { data: { payCycle: 'monthly', ... } } --
      |                    |<-- data -------------|                     |
      |                    |-- RHF reset(data)    |                     |
      |<-- form pre-populated with payroll settings|                    |
```

## Tab Load (Cache Hit)

```
HR Admin Browser      SettingsView         TanStack Query
      |                    |                     |
      |-- click Account tab |                    |
      |<-- tab activates   |                     |
      |-- useAccountSettings() fires             |
      |                    |-- ['settings','account'] cache hit? Yes
      |<-- form rendered immediately (no loading state)
```

## Roles Tab Load

```
HR Admin Browser      RolesManagementTab   TanStack Query         Backend API
      |                    |                     |                     |
      |-- click Roles tab  |                     |                     |
      |-- useRoles() fires |                     |                     |
      |                    |-----------------------------> GET /api/v1/settings/roles -->
      |<-- skeleton list --|                     |<-- 200 { data: { system: [...], custom: [...] } } --
      |<-- roles list renders (system read-only, custom editable)
```
