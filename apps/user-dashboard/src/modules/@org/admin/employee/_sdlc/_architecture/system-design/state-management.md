# Admin Employee Module — State Management

_How application state is managed within the employee module._

## State Categories

### Server State (TanStack Query)

All data from backend APIs is managed by TanStack Query. This covers the employee list (with active filters), individual employee records, document lists, leave history, and payroll summary.

- `staleTime`: 3 minutes for the employee list; 5 minutes for individual profiles.
- List queries include filter params in the key so different filter combinations are cached independently.
- After any mutation, affected query keys are explicitly invalidated.

### Form State (React Hook Form)

The add/edit employee form is the most complex interactive state in this module:

- `React Hook Form` manages field values, validation state, dirty flags, and submission state.
- The Zod schema is the single source of truth for validation rules — no duplicated validation logic.
- Multi-section form: each section is a controlled sub-form registered under the parent `useForm` instance.
- Unsaved changes are tracked via `formState.isDirty`; a confirmation dialog is shown if the admin navigates away with unsaved changes.

### UI State (Local)

| State                        | Location                             | Description                                      |
| ---------------------------- | ------------------------------------ | ------------------------------------------------ |
| Active filter panel          | `useState` in `EmployeeFilterPanel`  | Open/close state of the filter dropdown          |
| Active profile tab           | `useState` in `EmployeeProfileTabs`  | Selected tab index; resets on profile navigation |
| Status change confirm dialog | `useState` in `ChangeStatusAction`   | Controls visibility of the confirmation modal    |
| Document upload progress     | `useState` in `DocumentUploadButton` | Upload percentage for progress indicator         |

### URL State (Search Params)

Employee list search and filter state is persisted in the URL:

- `?q=searchTerm` — current search query
- `?department=eng&status=active` — active filter values
- `?page=2&size=20` — current pagination position

This enables bookmarking, browser back navigation, and sharing filtered views.

## Anti-patterns to Avoid

- Do not store the employee list data in Zustand — TanStack Query is the server state manager.
- Do not synchronise URL params and form state manually — use `useSearchParams` with TanStack Query's key derivation.
- Do not hold the full employee list in memory for client-side filtering — always use server-side search.
