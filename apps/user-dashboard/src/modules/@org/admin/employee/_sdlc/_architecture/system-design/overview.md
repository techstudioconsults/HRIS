# Admin Employee Module — System Design Overview

_High-level architecture of the employee management frontend module._

## Module Boundaries

The employee module owns the employee record CRUD surface. It depends on the `settings` module for department/role lookup data, and it reads from the `leave` and `payroll` modules to populate the employee profile's cross-domain summary sections. All data mutations (create, update, status change, document upload) originate from this module.

## Technology Choices

| Concern            | Choice                                        | Rationale                                                              |
| ------------------ | --------------------------------------------- | ---------------------------------------------------------------------- |
| Data fetching      | TanStack Query                                | Cache management, pagination, optimistic updates for status changes    |
| Form management    | React Hook Form + Zod                         | Multi-section form validation; schema-first type safety                |
| List rendering     | TanStack Table                                | Sortable, filterable, paginated table without re-inventing primitives  |
| Keyboard shortcuts | kbar                                          | Project-approved command palette; integrates with existing admin shell |
| File upload        | Native `<input type="file">` + multipart POST | Avoid over-engineering; use backend-side virus scan                    |
| Styling            | Tailwind CSS + shadcn/ui                      | Consistent with monorepo design system                                 |

## Key Design Decisions

1. **Multi-section form with step validation** — The add/edit employee form is divided into sections (Personal, Role, Department, Contract). Each section validates independently; the admin can save partial progress.
2. **Server-side search and filter** — The employee list passes `q`, `department`, `status`, and `role` as query params to the API. No client-side filtering of the full dataset.
3. **Optimistic status updates** — When an admin changes an employee's status, the UI updates immediately and rolls back if the API call fails.
4. **Cross-module profile tabs** — The employee profile page fetches leave and payroll summaries from their respective APIs in parallel, rendered in separate tabs.

## Request Flow Summary

Admin → Employee List (TanStack Table + useQuery) → paginated API → rendered rows.
Admin → Add Employee Form (React Hook Form + Zod) → POST `/api/v1/employees` → invalidate list query → redirect to new profile.

See `sequence-diagrams/` for detailed flows.
