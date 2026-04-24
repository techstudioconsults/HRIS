# Leave Management — Domain Events

_Events that the leave domain emits or reacts to. Frontend reacts to these via cache invalidation, toast notifications, or UI state transitions._

## Events Emitted by Backend (consumed via API response / SSE if applicable)

| Event                   | Trigger                              | Frontend Reaction                                                              |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------------------------ |
| `LeaveRequestSubmitted` | Employee submits a new leave request | Pending count badge increments; pending filter row count updates               |
| `LeaveRequestApproved`  | Admin approves a request             | Row status badge → "Approved"; success toast shown; employee balance refreshed |
| `LeaveRequestDeclined`  | Admin declines a request             | Row status badge → "Declined"; success toast shown                             |
| `LeaveRequestCancelled` | Employee cancels their own request   | Row removed from pending list (or status updated if showing all)               |
| `LeaveTypeCreated`      | Admin creates a new leave type       | Leave types list invalidated; new card appears                                 |
| `LeaveTypeUpdated`      | Admin edits a leave type             | Leave types list invalidated; updated card shown                               |
| `LeaveTypeArchived`     | Admin archives a leave type          | Type removed from active list; existing requests unaffected                    |
| `LeavePolicyUpdated`    | Admin saves leave policy changes     | Policy form resets to new values; confirmation toast                           |
| `LeaveSetupCompleted`   | Admin completes first-run wizard     | Wizard dismissed; dashboard view shown                                         |

## Events the Frontend Handles (Zustand transitions)

| Event                             | Store                 | Transition                                                        |
| --------------------------------- | --------------------- | ----------------------------------------------------------------- |
| Admin opens request detail drawer | `useLeaveDrawerStore` | `{ isOpen: false }` → `{ isOpen: true, selectedRequestId }`       |
| Admin closes drawer               | `useLeaveDrawerStore` | `{ isOpen: true }` → `{ isOpen: false, selectedRequestId: null }` |
| Admin advances wizard step        | `useLeaveWizardStore` | `currentStep` increments through `leave-types → policy → review`  |
| Admin resets wizard               | `useLeaveWizardStore` | All draft state cleared, step returns to `leave-types`            |
| Admin changes filter              | `useLeaveFilterStore` | Filter values updated, page resets to 1                           |

## Event Sequencing Notes

- `LeaveRequestApproved` and `LeaveRequestDeclined` must invalidate `['leave', 'balance', employeeId]` in addition to the request list — the employee's remaining balance changes.
- If real-time push (WebSocket/SSE) is not yet implemented, the frontend polls the request list every 60 seconds to surface new `LeaveRequestSubmitted` events from employees.
