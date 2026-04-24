# Admin Employee Module — Data Flow

_How data moves through the employee module for reads and writes._

## Read Flows

### Employee List

```
URL query params (?q=&department=&status=&page=&size=)
  → useEmployeeList hook
    → TanStack Query ['employees', 'list', filters]
      → GET /api/v1/employees?q=&department=&page=&size=
        → paginated response
          → TanStack Table render
```

### Employee Profile

```
Route param: /admin/employee/[id]
  → useEmployee(id) hook → GET /api/v1/employees/:id
  → useEmployeeLeaveHistory(id) hook → GET /api/v1/leave?employeeId=:id
  → useEmployeePayrollSummary(id) hook → GET /api/v1/payroll/summary?employeeId=:id
  (all three fire in parallel; each tab renders independently)
```

## Write Flows

### Add Employee

```
EmployeeForm submit (React Hook Form)
  → Zod schema validation (client-side)
    → POST /api/v1/employees
      → 201 Created { data: { id, ... } }
        → invalidateQueries(['employees', 'list', ...])
          → invalidateQueries(['dashboard', 'headcount'])
            → navigate to /admin/employee/:newId
```

### Edit Employee

```
EmployeeForm submit
  → Zod schema validation
    → PATCH /api/v1/employees/:id
      → 200 OK
        → invalidateQueries(['employees', 'detail', id])
          → invalidateQueries(['employees', 'list', ...])
```

### Status Change

```
ChangeStatusAction (optimistic update)
  → queryClient.setQueryData(['employees','detail',id], optimisticUpdate)
    → POST /api/v1/employees/:id/status
      → 200 OK → confirm optimistic update
      → error → rollback via onError handler
        → invalidateQueries to restore server state
```

## Cache Keys Registry

All keys registered in `src/lib/react-query/query-keys.ts` under the `employees` namespace:

```typescript
employees.list(filters)    → ['employees', 'list', filters]
employees.detail(id)       → ['employees', 'detail', id]
employees.documents(id)    → ['employees', 'documents', id]
employees.leaveHistory(id) → ['employees', 'leaveHistory', id]
employees.payrollSummary(id) → ['employees', 'payrollSummary', id]
```
