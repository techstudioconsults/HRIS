# Leave Management — Domain Entities

_Core domain entities for the leave bounded context as consumed by the frontend._

## LeaveType

Represents a named category of absence with its allowance rules.

```ts
interface LeaveType {
  readonly id: string; // UUID
  readonly name: string; // e.g. "Annual Leave", "Sick Leave"
  readonly code: string; // e.g. "ANNUAL", "SICK"
  readonly allowanceDays: number; // total days per cycle
  readonly cycle: 'monthly' | 'quarterly' | 'annually';
  readonly carryOverCap: number | null; // null = no carry-over allowed
  readonly eligibilityMonths: number; // minimum tenure before employee may apply
  readonly applicableTo: EmploymentType[]; // FULL_TIME | PART_TIME | CONTRACT
  readonly requiresDocumentation: boolean; // e.g. sick leave may require a medical note
  readonly isPaid: boolean;
  readonly isArchived: boolean;
  readonly createdAt: string; // ISO 8601
  readonly updatedAt: string;
}
```

## LeaveRequest

Represents an employee's formal request for absence.

```ts
interface LeaveRequest {
  readonly id: string;
  readonly employeeId: string;
  readonly employeeName: string;
  readonly employeeDepartment: string;
  readonly leaveType: Pick<LeaveType, 'id' | 'name' | 'code'>;
  readonly startDate: string; // ISO 8601 date (YYYY-MM-DD)
  readonly endDate: string;
  readonly durationDays: number; // backend-calculated, excludes weekends/public holidays
  readonly status: LeaveRequestStatus;
  readonly reason: string | null; // employee's stated reason (optional)
  readonly declineReason: string | null; // mandatory if status = 'declined'
  readonly approvedBy: string | null; // actor ID
  readonly actionedAt: string | null; // ISO 8601
  readonly submittedAt: string;
}

type LeaveRequestStatus = 'pending' | 'approved' | 'declined' | 'cancelled';
```

## LeaveBalance

Snapshot of an employee's remaining leave entitlement per type.

```ts
interface LeaveBalance {
  readonly employeeId: string;
  readonly leaveTypeId: string;
  readonly leaveTypeName: string;
  readonly cycleStart: string; // ISO 8601 date
  readonly cycleEnd: string;
  readonly totalAllowance: number;
  readonly used: number;
  readonly pending: number; // days in pending requests
  readonly remaining: number; // totalAllowance - used - pending
  readonly carriedOver: number;
}
```

## LeavePolicy

Organisation-wide rules that apply across all leave types.

```ts
interface LeavePolicy {
  readonly organisationId: string;
  readonly minimumNoticeCalendarDays: number; // advance notice required
  readonly maximumConsecutiveDays: number; // soft cap; 0 = no cap
  readonly allowHalfDays: boolean;
  readonly weekendCountsAsLeave: boolean;
  readonly publicHolidaysCountAsLeave: boolean;
  readonly updatedAt: string;
  readonly updatedBy: string;
}
```

## Business Rules (Frontend-Enforced via Zod)

- `allowanceDays` must be >= 1.
- `carryOverCap` must be <= `allowanceDays` when set.
- `eligibilityMonths` must be >= 0.
- `startDate` must be before or equal to `endDate` on the leave request form.
- `declineReason` is required (min 10 characters) when an admin declines a request.
- Leave type with `isArchived: true` must not appear in the employee request type selector.
