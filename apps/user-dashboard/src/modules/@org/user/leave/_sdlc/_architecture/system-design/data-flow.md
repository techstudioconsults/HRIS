# User Leave — Data Flow

_How data flows from the API to the employee leave UI and back._

## Read Flow (Fetching Leave Data)

```
LeaveView (Client Component)
  ├── useLeaveService() [TanStack Query]
  │     └── GET /leaves          → LeaveType[]   (for form selector)
  └── useLeaveRequests() [TanStack Query]
        └── GET /leave-request   → PaginatedApiResponse<LeaveRequest>
              └── LeaveBody → LeaveCard[] (one per request)
```

## Write Flow (Submit Leave Request)

```
Employee fills RequestLeaveForm
  └── React Hook Form validates via requestLeaveSchema (Zod)
        └── onSubmit(data: RequestLeaveSubmitData)
              └── UserLeaveService.createLeaveRequest(payload)
                    └── POST /leave-request (FormData)
                          ├── 201 → invalidate useLeaveRequests cache
                          │         → transition modal state to 'submitted'
                          └── 4xx/5xx → show error; keep form open
```

## Write Flow (Update Pending Request)

```
Employee clicks "Edit" in LeaveDetailsModal
  └── RequestLeaveModal opens with initialRequest pre-filled
        └── onSubmit(data)
              └── UserLeaveService.updateLeaveRequest(id, payload)
                    └── PATCH /leave-request/{id} (FormData)
                          ├── 200 → invalidate cache → modal state 'submitted'
                          └── error → show error toast
```

## Cache Invalidation Strategy

All mutations invalidate the `useLeaveRequests` TanStack Query key, ensuring the request history list refreshes automatically after any create, update, or delete operation.
