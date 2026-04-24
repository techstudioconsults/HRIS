# User Home — Domain Events

_Domain events that the home dashboard observes and displays._

## Events Consumed (Read-Only)

The home module does not publish events. It consumes events from other bounded contexts to populate the recent-activity feed.

| Event                   | Source Module  | ActivityType | Example Message                                               |
| ----------------------- | -------------- | ------------ | ------------------------------------------------------------- |
| `LeaveRequestApproved`  | Leave module   | `approved`   | "Your annual leave for Oct 18-21 was approved."               |
| `LeaveRequestRejected`  | Leave module   | `rejected`   | "Your Casual Leave (Oct 2-3) was rejected."                   |
| `LeaveRequestSubmitted` | Leave module   | `submitted`  | "You requested Annual Leave (Oct 10-13) — awaiting approval." |
| `PayslipAvailable`      | Payslip module | `available`  | "Your September 2025 payslip is now ready to view."           |

## Event Shape (Activity)

All consumed events are normalised into the `Activity` interface before being rendered:

```ts
{
  id: string; // unique event identifier
  type: ActivityType; // maps from the source event type
  title: string; // human-readable event title
  message: string; // human-readable detail
  timestamp: string; // ISO 8601 — when the event occurred
}
```

## Future: Real-Time Events (Phase 2)

WebSocket or Server-Sent Events from `/api/v1/employees/{id}/activities/stream` will push new activity events to the dashboard without requiring a page reload.
