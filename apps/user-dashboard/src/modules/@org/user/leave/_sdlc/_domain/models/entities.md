# User Leave — Domain Entities

_Domain model definitions for the employee leave self-service module._

## LeaveType

A category of leave available to employees.

```ts
interface LeaveType {
  id: string;
  name: string; // e.g. "Annual Leave", "Sick Leave"
  days: number | string; // total entitlement per cycle
  cycle: string; // e.g. "annual", "monthly"
  carryOver: boolean;
  maxLeaveDaysPerRequest?: number;
  eligibility?: string;
  maxNumberOfRollOver?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## LeaveRequest

A single leave application submitted by the employee.

```ts
interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  leaveTypeId: string;
  type: string; // leave type name (display)
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  days: number; // working days covered
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string; // populated when status is 'rejected'
  supportingDocumentName?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Invariants**: `status` determines which actions are available — `edit` and `delete` only allowed when `status === 'pending'`.

## LeaveBalance

The employee's leave entitlement summary per leave type.

```ts
interface LeaveBalance {
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  total: number;
  used: number;
  remaining: number;
  pending: number;
}
```

## RequestLeaveFormValues (Value Object)

Derived from `requestLeaveSchema` Zod schema — immutable form input shape.

```ts
type RequestLeaveFormValues = {
  leaveId: string;
  startDate: string;
  endDate: string;
  reason: string;
};
```
