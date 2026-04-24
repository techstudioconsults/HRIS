# Settings Module — Error Flow Sequence Diagram

## Validation Error (Client-side)

```
HR Admin Browser   AccountSettingsTab (RHF + Zod)
      |                      |
      |-- Clear org name ---> |
      |-- Click "Save" -----> |
      |                      |-- Zod.parse fails: 'Organisation name is required.'
      |                      |-- RHF marks field invalid
      |<-- inline error below name field; no API call made
      |<-- Save button remains disabled
```

## API Error (5xx)

```
HR Admin Browser   PayrollSettingsTab    TanStack Query       Backend API
      |                   |                    |                    |
      |-- Click "Save" -> |                    |                    |
      |                   |-- mutate() -------> |-- PATCH /api/v1/settings/payroll -->
      |<-- Save loading   |                    |<-- 500 Internal Server Error --
      |                   |<-- onError fires   |                    |
      |<-- toast: "Failed to save payroll settings — please try again."
      |<-- form retains all entered values; dirty flag stays set
```

## Logo Upload — File Too Large (Client-side)

```
HR Admin Browser   LogoUploadField
      |                  |
      |-- Select 3MB PNG ->
      |                  |-- client-side check: sizeBytes > 2_097_152
      |<-- error shown below input: "Logo must be smaller than 2 MB."
      |-- No API call made
```

## Role Name Conflict (409)

```
HR Admin Browser   RoleEditorDrawer     TanStack Query        Backend API
      |                  |                    |                    |
      |-- Submit form --> |                    |                    |
      |                  |-- mutate() -------> |-- POST /api/v1/settings/roles -->
      |<-- drawer loading |                    |<-- 409 { errors: [{ field: 'name', code: 'DUPLICATE_ROLE_NAME' }] } --
      |                  |<-- onError         |                    |
      |                  |-- setError('name') via RHF
      |<-- inline error: "A role with this name already exists."
      |<-- drawer stays open; form values retained
```

## Settings Tab Load Error

```
HR Admin Browser   HRSettingsTab      TanStack Query          Backend API
      |                  |                   |                     |
      |-- tab click ----> |                  |                     |
      |                  |-- useHRSettings() -> GET /api/v1/settings/hr -->
      |<-- skeleton      |                  |<-- 503 Service Unavailable --
      |                  |<-- isError: true |                     |
      |<-- error state: "Unable to load HR settings." + Retry button
      |-- Retry ---------> |                |-- refetch() -------> |
```
