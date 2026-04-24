# User Leave — Mutation Flow Sequence

_Sequence diagrams for leave request create, update, and delete._

## Create Leave Request

```
Employee    RequestLeaveForm    UserLeaveService    Backend API    TanStack Query
   |               |                  |                  |              |
   | submit form   |                  |                  |              |
   |──────────────>|                  |                  |              |
   |               | Zod validates    |                  |              |
   |               |──────────────────>                  |              |
   |               | createLeaveRequest(payload)         |              |
   |               |──────────────────────────────────>  |              |
   |               |                  | POST /leave-request (FormData)  |
   |               |                  |──────────────────>              |
   |               |                  | 201 { data: LeaveRequest }      |
   |               |                  |<──────────────────              |
   |               |                  |         invalidate requests key |
   |               |                  |─────────────────────────────────>
   | modal state → 'submitted'        |                  |              |
   |<──────────────|                  |                  |              |
```

## Update Pending Request

```
Employee    RequestLeaveModal    UserLeaveService    Backend API
   |               |                  |                  |
   | submit edit   |                  |                  |
   |──────────────>|                  |                  |
   |               | updateLeaveRequest(id, payload)     |
   |               |──────────────────────────────────>  |
   |               |                  | PATCH /leave-request/{id}
   |               |                  |──────────────────>
   |               |                  | 200 { data: LeaveRequest }
   |               |                  |<──────────────────
   | modal state → 'submitted'        |                  |
   |<──────────────|                  |                  |
```
