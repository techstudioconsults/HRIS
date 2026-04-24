# Admin Employee Module — Error Flow Sequence Diagram

_How errors are caught, contained, and surfaced to the admin in the employee module._

## Form Submission Error (Validation)

```
Admin Browser      EmployeeForm (React Hook Form + Zod)
     |                      |
     |-- Submit (email blank) ->
     |                      |-- Zod.parse() fails
     |                      |-- React Hook Form marks fields invalid
     |<-- inline field errors appear immediately (no API call made)
     |   "Email is required", "Start date must be in the past"
```

## Form Submission Error (API Error)

```
Admin Browser      EmployeeForm             TanStack Query        Backend API
     |                  |                        |                    |
     |-- Submit (valid) -> |                     |                    |
     |                  |-- mutate() -----------> |-- POST /api/v1/employees -->
     |<-- loading -------|                        |<-- 409 { errors: [{ code: 'DUPLICATE_EMAIL' }] } --
     |                  |                        |-- onError callback fires
     |                  |-- map error to field: email → "An employee with this email already exists"
     |<-- email field shows server error; form remains open for correction
```

## List Load Error

```
Admin Browser      EmployeeDataTable       TanStack Query         Backend API
     |                    |                      |                     |
     |-- page load ------> |                     |                     |
     |                    |-- useEmployeeList --> |-- GET /api/v1/employees -->
     |                    |                      |<-- 500 error --------|
     |                    |<-- isError: true -----|                     |
     |<-- table shows error state: "Unable to load employees. [Retry]"  |
     |                    |                      |                     |
     |-- Retry -----------> |                    |-- refetch() -------> |
```

## Status Change Rollback

```
Admin Browser     ChangeStatusAction     TanStack Query       Backend API
     |                  |                     |                    |
     |-- Confirm ------> |                    |                    |
     |                  |-- optimistic update |                    |
     |<-- badge shows TERMINATED              |                    |
     |                  |-- mutate() --------> |-- POST /api/v1/... -->
     |                  |                     |<-- 422 error -------|
     |                  |-- onError: rollback data                  |
     |<-- badge reverts to ACTIVE; error toast: "Status change failed. Please try again."
```

## Error Handling Rules

1. Form validation errors are shown inline per field — never as a top-level alert.
2. API errors on form submission are mapped to specific field errors where possible (e.g., duplicate email → email field error).
3. List and profile load errors show a non-blocking error state with a retry button.
4. Optimistic update failures must always roll back to the last known good state.
5. Unhandled errors bubble to the page-level `ErrorBoundary` which shows a recovery prompt.
