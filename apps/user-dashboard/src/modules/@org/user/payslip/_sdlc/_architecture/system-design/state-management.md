---
section: architecture
topic: state-management
---

# User Payslip — State Management

## TanStack Query — Cache Keys

| Key                        | Query               | Stale Time    |
| -------------------------- | ------------------- | ------------- |
| `['user', 'payslips']`     | `GET /payslips`     | default (60s) |
| `['user', 'payslips', id]` | `GET /payslips/:id` | default       |

No cache invalidation needed — this module has no write operations.

## Local React State

```ts
const [selectedPayslip, setSelectedPayslip] = useState<UserPayslip | null>(
  null
);
const isModalOpen = selectedPayslip !== null;
```

Opening the modal: `setSelectedPayslip(payslip)`.
Closing the modal: `setSelectedPayslip(null)`.

No Zustand store — the selected payslip state is confined to the page component.

## No Persistence

Nothing is written to `localStorage` or `sessionStorage`. Payslip data is cleared from the TanStack Query cache on `signOut`.
