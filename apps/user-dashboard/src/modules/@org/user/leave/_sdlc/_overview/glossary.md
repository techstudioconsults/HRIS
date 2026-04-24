# User Leave — Glossary

_Domain and module-specific terms used across the leave SDLC documents._

## Terms

| Term                          | Definition                                                                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LeaveType**                 | A category of leave available to employees (e.g., Annual Leave, Sick Leave, Casual Leave). Has configured `days`, `cycle`, and `carryOver` settings.  |
| **LeaveRequest**              | A single leave application submitted by an employee for a specific date range and leave type. Has a `status` of `pending`, `approved`, or `rejected`. |
| **LeaveBalance**              | The employee's available leave entitlement for a specific `LeaveType`: `total`, `used`, `remaining`, and `pending` day counts.                        |
| **LeaveStatistics**           | Aggregate counts of the employee's requests across all statuses and types.                                                                            |
| **CreateLeaveRequestPayload** | The data sent to `POST /leave-request`: `leaveId`, `startDate`, `endDate`, `reason`, and optional `document`.                                         |
| **requestLeaveSchema**        | The Zod validation schema for the request-leave form. Derives `RequestLeaveFormValues` type.                                                          |
| **LeaveModalState**           | Union of modal states controlling which leave modal is open: `'request' \| 'edit' \| 'details' \| 'submitted' \| null`.                               |
| **pending**                   | A leave request that has been submitted but not yet actioned by HR/manager.                                                                           |
| **approved**                  | A leave request that has been approved.                                                                                                               |
| **rejected**                  | A leave request that has been declined, with an optional `rejectionReason`.                                                                           |
| **carryOver**                 | Whether unused leave days in a cycle can be rolled into the next period.                                                                              |
| **cycle**                     | The time period over which leave entitlement is measured (e.g., annual, monthly).                                                                     |
