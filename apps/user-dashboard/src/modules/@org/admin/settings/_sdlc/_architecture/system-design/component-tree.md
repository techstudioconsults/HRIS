# Settings Module — Component Tree

_React component hierarchy for the organisation settings hub._

## Component Hierarchy

```
SettingsView                           (page shell, tab param, breadcrumb)
├── SettingsTabNav                     (tab links: Account | Payroll | Security | HR | Notifications | Roles)
└── SettingsTabContent
    ├── AccountSettingsTab             (?tab=account)
    │   ├── OrgNameField
    │   ├── LogoUploadField            (preview + file input)
    │   ├── ContactEmailField
    │   ├── PhoneField
    │   └── SaveButton
    ├── PayrollSettingsTab             (?tab=payroll)
    │   ├── PayCycleSelect             (weekly / bi-weekly / monthly)
    │   ├── CurrencySelect             (ISO 4217 currency list)
    │   ├── DeductionsConfigList       (tax, pension, health — each with % or fixed amount)
    │   └── SaveButton
    ├── SecuritySettingsTab            (?tab=security)
    │   ├── TwoFactorToggle            (enforce 2FA org-wide)
    │   ├── SessionTimeoutInput        (minutes)
    │   ├── PasswordPolicyForm         (min length, complexity, expiry)
    │   └── SaveButton
    ├── HRSettingsTab                  (?tab=hr)
    │   ├── WorkingHoursInput          (hours per week)
    │   ├── ProbationPeriodInput       (months)
    │   ├── LeaveCarryoverForm         (max days, expiry date rule)
    │   └── SaveButton
    ├── NotificationSettingsTab        (?tab=notifications)
    │   └── NotificationEventList      (per-event: email toggle + in-app toggle)
    │       └── NotificationEventRow[] (e.g., "New Leave Request", "Payroll Run Completed")
    └── RolesManagementTab             (?tab=roles)
        ├── SystemRolesList            (read-only: Super Admin, HR Manager, HR Officer, Employee)
        ├── CustomRolesList            (editable: list of custom roles)
        │   └── CustomRoleRow[]        (name, permission count, edit + delete actions)
        ├── CreateRoleButton
        └── RoleEditorDrawer           (create/edit — name field + permission checkboxes)
            └── PermissionCheckboxGroup (grouped by domain: resources, leave, payroll, …)
```
