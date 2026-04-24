# Settings Module — Mutation Flow Sequence Diagram

## Update Settings Tab (e.g. Account Settings)

```
HR Admin Browser   AccountSettingsTab (RHF)   TanStack Query      Backend API
      |                    |                        |                   |
      |-- Edit org name -> |                        |                   |
      |-- Click "Save" --> |                        |                   |
      |                    |-- Zod.parse(formData) passes               |
      |                    |-- useMutation.mutate() -> |-- PATCH /api/v1/settings/account -->
      |<-- Save btn loading|                        |                   |
      |                    |                        |<-- 200 { data: AccountSettings } --
      |                    |                        |-- setQueryData(['settings','account'], data)
      |                    |-- RHF reset(savedData) |                   |
      |<-- success toast: "Account settings saved." |                   |
      |<-- Save btn re-enabled; dirty flag cleared  |                   |
```

## Logo Upload

```
HR Admin Browser   LogoUploadField   TanStack Query          Backend API
      |                  |                  |                     |
      |-- Select file -> |                  |                     |
      |<-- preview shown |                  |                     |
      |-- Click "Save" -> |                 |                     |
      |                  |-- FormData({ logo: File, ...rest })    |
      |                  |-- mutate() -----> |-- PATCH /api/v1/settings/account (multipart) -->
      |<-- progress bar  |                  |<-- 200 { data: { logoUrl: '...', ... } } --
      |                  |                  |-- setQueryData cache
      |<-- new logo shown in header/preview |                     |
```

## Create Custom Role

```
HR Admin Browser   RoleEditorDrawer (RHF)    TanStack Query       Backend API
      |                    |                       |                    |
      |-- Fill name + permissions                  |                    |
      |-- Click "Create Role"                      |                    |
      |                    |-- Zod.parse passes    |                    |
      |                    |-- useCreateRole.mutate() -> POST /api/v1/settings/roles -->
      |<-- drawer loading  |                       |<-- 201 { data: Role } --
      |                    |                       |-- invalidateQueries(['settings','roles'])
      |                    |-- drawer closes        |                    |
      |<-- success toast: "Role created."           |                    |
      |<-- new role appears in custom roles list    |                    |
```

## Delete Custom Role

```
HR Admin Browser   CustomRoleRow              TanStack Query       Backend API
      |                  |                          |                    |
      |-- Click Delete -> |                         |                    |
      |<-- confirm dialog |                         |                    |
      |-- Confirm ------> |                         |                    |
      |                  |-- useDeleteRole.mutate() -> DELETE /api/v1/settings/roles/:id -->
      |<-- row loading   |                          |<-- 204 No Content -|
      |                  |                          |-- invalidateQueries(['settings','roles'])
      |<-- role removed from list                   |                    |
```
