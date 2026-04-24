# User Leave — State Management

_How UI and server state is managed in the employee leave module._

## Server State (TanStack Query)

| Query Key                           | Endpoint             | Invalidated By                                                   |
| ----------------------------------- | -------------------- | ---------------------------------------------------------------- |
| `queryKeys.leave.types()`           | `GET /leaves`        | Never (static leave type config)                                 |
| `queryKeys.leave.requests(filters)` | `GET /leave-request` | `createLeaveRequest`, `updateLeaveRequest`, `deleteLeaveRequest` |

Query keys must be registered in `src/lib/react-query/query-keys.ts`.

## Local UI State

Managed via `useState` in `LeaveView`:

```ts
const [modalState, setModalState] = useState<LeaveModalState>(null);
const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
  null
);
const [searchQuery, setSearchQuery] = useState('');
```

| State             | Type                   | Purpose                                            |
| ----------------- | ---------------------- | -------------------------------------------------- |
| `modalState`      | `LeaveModalState`      | Controls which modal (if any) is visible           |
| `selectedRequest` | `LeaveRequest \| null` | The request being viewed/edited in a modal         |
| `searchQuery`     | `string`               | Current search filter for the request history list |

## Form State (React Hook Form)

`RequestLeaveForm` uses React Hook Form with `requestLeaveSchema` (Zod) for validation. Form state is fully encapsulated within the form component — no form state leaks to the parent view.

## No Global Store

The leave module does not use Zustand or Jotai. All state is component-local or managed by TanStack Query.
