# Leave Management — Data Flow

_Describes how data moves from the backend API through the module's layers to the UI._

## Read Flow (Fetching Leave Requests)

```
URL change / mount
  → useLeaveRequests(filters) [TanStack Query]
    → leaveService.getLeaveRequests(params) [services/leave.service.ts]
      → HttpAdapter.get('/api/v1/leave/requests', { params })
        → Backend REST API
          ← { status: 'success', data: LeaveRequest[], total, page, size, totalPages, timestamp }
        ← validated via LeaveRequestListSchema (Zod)
      ← LeaveRequest[]
    ← cached in TanStack Query under ['leave', 'requests', filters]
  → LeaveRequestTable renders rows
```

## Mutation Flow (Approving a Request)

```
Admin clicks "Approve" in LeaveRequestDetailDrawer
  → useApproveLeaveRequest(requestId) [TanStack Query mutation]
    → leaveService.approveLeaveRequest(requestId)
      → HttpAdapter.patch(`/api/v1/leave/requests/${requestId}/approve`)
        → Backend REST API
          ← { status: 'success', data: LeaveRequest (updated), timestamp }
        ← validated via LeaveRequestSchema (Zod)
      ← updated LeaveRequest
    → onSuccess: queryClient.invalidateQueries(['leave', 'requests'])
    → optimistic update: status badge flips to 'approved' immediately
  → Drawer closes, table row reflects new status
```

## Filter State Flow

```
Admin changes filter in LeaveRequestFilters
  → useLeaveFilterStore.setFilter(key, value) [Zustand]
    → URL search params updated via router.replace (no full reload)
    → useLeaveRequests(newFilters) triggers fresh query
      → TanStack Query checks cache; cache miss → re-fetches
  → Table re-renders with new results
```

## Leave Type Write Flow

```
Admin submits LeaveTypeForm
  → React Hook Form validates against LeaveTypeSchema (Zod)
    → if invalid: inline field errors shown, no API call
    → if valid:
      → useCreateLeaveType mutation
        → leaveService.createLeaveType(dto)
          → HttpAdapter.post('/api/v1/leave/types', dto)
            ← { status: 'success', data: LeaveType, timestamp }
          ← validated via LeaveTypeSchema
        → onSuccess: queryClient.invalidateQueries(['leave', 'types'])
      → Drawer closes, new leave type card appears in list
```
