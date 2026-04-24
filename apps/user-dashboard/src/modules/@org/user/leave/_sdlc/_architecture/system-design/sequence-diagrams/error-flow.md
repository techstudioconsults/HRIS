# User Leave — Error Flow Sequence

_How errors are handled in the employee leave module._

## Form Validation Error (Client-Side)

```
Employee    RequestLeaveForm (Zod)
   |               |
   | submit with missing leaveId
   |──────────────>|
   |               | Zod: "Please select a leave type"
   |               | Zod: "Please select a start date"
   | inline errors displayed (form stays open)
   |<──────────────|
```

## API Error on Submission

```
Employee    RequestLeaveForm    UserLeaveService    Backend API
   |               |                  |                  |
   | submit valid  |                  |                  |
   |──────────────>|                  |                  |
   |               | createLeaveRequest(payload)         |
   |               |──────────────────────────────────>  |
   |               |                  | POST /leave-request
   |               |                  |──────────────────>
   |               |                  | 422 { errors: [...] }
   |               |                  |<──────────────────
   | error toast shown; form stays open                  |
   |<──────────────|                  |                  |
```

## Fetch Error (Request History)

```
Browser    TanStack Query    Backend API
   |               |               |
   |  GET /leave-request           |
   |───────────────────────────────>
   |               |  500           |
   |<───────────────────────────────
   | error state rendered in LeaveBody
   | "Unable to load leave requests. Please try again."
   |<──────────────|
```
