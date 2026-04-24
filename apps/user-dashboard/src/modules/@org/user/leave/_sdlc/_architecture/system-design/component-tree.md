# User Leave — Component Tree

_Visual representation of the component hierarchy for the employee leave module._

## Full Component Tree

```
LeaveView (_views/leave.tsx)  ← owns LeaveModalState
├── LeaveHeader
│   ├── "Request Leave" button  → opens RequestLeaveModal
│   └── Search input            → filters LeaveBody
├── LeaveBody
│   └── LeaveCard  (× n, one per LeaveRequest)
│       ├── Leave type name
│       ├── Date range (startDate – endDate)
│       ├── Days count
│       ├── Status badge (pending | approved | rejected)
│       └── "View Details" action → opens LeaveDetailsModal
├── RequestLeaveModal  [controlled: open / onOpenChange]
│   └── RequestLeaveForm
│       ├── Leave type selector (LeaveType[])
│       ├── Start date picker
│       ├── End date picker
│       ├── Reason textarea
│       ├── Document upload (optional)
│       └── Submit / Cancel buttons
├── LeaveDetailsModal  [controlled]
│   ├── Full request detail fields
│   ├── Rejection reason (if rejected)
│   └── "Edit" button (if pending) → transitions to 'edit' state
└── LeaveRequestSubmittedModal  [controlled]
    └── Success confirmation message + "Close" button
```

## Shared Types

All component props are typed via interfaces in `types/index.ts`:
`LeaveCardProps`, `RequestLeaveFormProps`, `LeaveDetailsModalProps`, `LeaveRequestSubmittedModalProps`, `UserLeaveBodyProps`, `UserLeaveHeaderProps`.
