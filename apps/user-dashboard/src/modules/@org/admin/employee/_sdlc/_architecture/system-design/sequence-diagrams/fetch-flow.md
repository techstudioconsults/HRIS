# Admin Employee Module — Fetch Flow Sequence Diagram

_Sequence of events when the admin loads the employee list._

## Employee List Fetch

```
Admin Browser        Next.js Route Handler    TanStack Query          Backend API
     |                       |                     |                       |
     |-- GET /admin/employee ->                     |                       |
     |                       |-- RSC render ------> |                       |
     |<-- HTML shell + JS ----|                     |                       |
     |                       |                      |                      |
     |-- Hydrate EmployeeDataTable (Client Component)                       |
     |-- useEmployeeList({ q:'', page:1, size:20 }) |                       |
     |                       |                      |-- GET /api/v1/employees?page=1&size=20 -->
     |                       |                      |<-- 200 { data: [...], total: 47, page: 1 } --
     |<-- table rows rendered with data ------------|                       |
```

## Employee Profile Fetch (parallel)

```
Admin Browser       EmployeeProfilePage      TanStack Query          Backend APIs
     |                     |                      |                        |
     |-- GET /admin/employee/emp_001 ->            |                        |
     |<-- RSC shell -------|                       |                        |
     |                     |                       |                        |
     |-- Hydrate profile tabs (Client Component)   |                        |
     |-- useEmployee('emp_001') -----------------> |-- GET /api/v1/employees/emp_001 -->
     |-- useEmployeeLeaveHistory('emp_001') ------> |-- GET /api/v1/leave?employeeId=emp_001 -->
     |-- useEmployeePayrollSummary('emp_001') -----> |-- GET /api/v1/payroll/summary?employeeId=emp_001 -->
     |                     |                        |                        |
     |                     |                        |<-- all three respond --|
     |<-- profile header + tabs populated ----------|                        |
```

## Notes

- The three profile fetches fire in parallel — not a waterfall.
- Each tab renders its own skeleton while its data is loading.
- The profile header (name, role, department) is populated from the primary employee fetch only — it does not wait for leave or payroll data.
