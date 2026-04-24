# User Leave — System Design Overview

_Architecture summary for the employee leave self-service module._

## Module Boundaries

The `leave` module is a **read/write module**. It fetches leave types and the employee's request history, and it mutates via create/update/delete operations on leave requests.

## Component Architecture

The module follows the feature-sliced pattern:

```
leave/
├── _components/          # Presentational UI components
│   ├── forms/            # RequestLeaveForm (React Hook Form + Zod)
│   ├── LeaveCard.tsx     # Individual request card in the history list
│   ├── LeaveBody.tsx     # List container for request cards
│   ├── LeaveHeader.tsx   # Page header with search and "Request Leave" CTA
│   ├── LeaveDetailsModal.tsx     # View/edit details of a selected request
│   ├── RequestLeaveModal.tsx     # Submission modal wrapping RequestLeaveForm
│   └── LeaveRequestSubmittedModal.tsx  # Confirmation modal
├── _views/leave.tsx      # Page root; owns modal state (LeaveModalState)
├── schemas/              # requestLeaveSchema Zod schema
├── services/             # UserLeaveService (HttpAdapter-based)
├── types/                # All domain types and interfaces
└── index.ts              # Public barrel export
```

## Modal State Machine

The `LeaveModalState` union (`'request' | 'edit' | 'details' | 'submitted' | null`) is managed in `leave.tsx` via `useState`. Transitions:

```
null → 'request'   (click "Request Leave")
null → 'details'   (click a LeaveCard)
'request' → 'submitted'  (successful POST)
'details' → 'edit'       (click "Edit" in details modal)
'submitted' → null       (close confirmation modal)
'edit' → 'submitted'     (successful PATCH)
any → null               (close/cancel)
```
