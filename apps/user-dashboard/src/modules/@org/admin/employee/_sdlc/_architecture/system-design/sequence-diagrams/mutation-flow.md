# Admin Employee Module — Mutation Flow Sequence Diagram

_Sequence of events for the three primary mutations: create, edit, and status change._

## Create Employee

```
Admin Browser     EmployeeForm (React Hook Form)   TanStack Query       Backend API
     |                    |                              |                    |
     |-- Fill form ------> |                             |                    |
     |-- Submit ---------- |                             |                    |
     |                    |-- Zod.parse(formData) -----> |                    |
     |                    |   (client validation passes) |                    |
     |                    |-- useMutation.mutate() -----> |-- POST /api/v1/employees -->
     |<-- loading spinner--|                              |                    |
     |                    |                              |<-- 201 { data: { id: 'emp_new' } } --
     |                    |                              |-- invalidate ['employees','list',...] --
     |                    |                              |-- invalidate ['dashboard','headcount'] --
     |<-- navigate to /admin/employee/emp_new ------------|
```

## Edit Employee

```
Admin Browser     EmployeeForm            TanStack Query      Backend API
     |                 |                       |                   |
     |-- Submit ------> |                      |                   |
     |                 |-- Zod.parse() ------> |                   |
     |                 |-- mutate() -----------> |-- PATCH /api/v1/employees/:id -->
     |<-- loading ------|                        |<-- 200 OK -------|
     |                 |                        |-- invalidate ['employees','detail', id] --
     |                 |                        |-- invalidate ['employees','list',...] --
     |<-- success toast + stay on profile ------|
```

## Optimistic Status Change

```
Admin Browser    ChangeStatusAction    TanStack Query        Backend API
     |                  |                    |                    |
     |-- Click Terminate ->                  |                    |
     |<-- confirm dialog|                    |                    |
     |-- Confirm -------> |                  |                    |
     |                  |-- setQueryData (optimistic TERMINATED) ->|
     |<-- status badge updates instantly ----|                    |
     |                  |-- mutate() -------> |-- POST /api/v1/employees/:id/status -->
     |                  |                    |<-- 200 OK ---------|
     |                  |                    |-- confirm; no rollback needed ----------|
     |                  |   (on error)       |                    |
     |                  |-- onError: rollback setQueryData --------|
     |<-- error toast; badge reverts ---------|
```
