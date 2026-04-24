# Admin Employee Module — Domain Events

_Events emitted by the employee bounded context._

## Event Catalogue

### EmployeeCreated

Emitted when a new employee record is successfully persisted.

| Field          | Type                | Description                               |
| -------------- | ------------------- | ----------------------------------------- |
| `employeeId`   | `string`            | New employee's ID                         |
| `email`        | `string`            | Email address                             |
| `departmentId` | `string`            | Assigned department                       |
| `roleId`       | `string`            | Assigned role                             |
| `contractType` | `ContractType`      | FULL_TIME / PART_TIME / CONTRACT / INTERN |
| `startDate`    | `string (ISO 8601)` | Employment start date                     |
| `createdBy`    | `string`            | Actor (admin user ID)                     |
| `occurredAt`   | `string (ISO 8601)` | Event timestamp                           |

**Subscribers**: Dashboard headcount widget (invalidate), Payroll context (initialise pay profile)

---

### EmployeeUpdated

Emitted when any field on an employee record is changed.

| Field           | Type                | Description                  |
| --------------- | ------------------- | ---------------------------- |
| `employeeId`    | `string`            | Updated employee's ID        |
| `changedFields` | `string[]`          | Names of fields that changed |
| `updatedBy`     | `string`            | Actor                        |
| `occurredAt`    | `string (ISO 8601)` | Event timestamp              |

---

### EmploymentStatusChanged

Emitted when an employment status transition is applied.

| Field            | Type                  | Description                           |
| ---------------- | --------------------- | ------------------------------------- |
| `employeeId`     | `string`              | Affected employee                     |
| `previousStatus` | `EmploymentStatus`    | Status before the change              |
| `newStatus`      | `EmploymentStatus`    | Status after the change               |
| `effectiveDate`  | `string (ISO 8601)`   | When the change takes effect          |
| `reason`         | `string \| undefined` | Optional reason provided by the admin |
| `changedBy`      | `string`              | Actor                                 |
| `occurredAt`     | `string (ISO 8601)`   | Event timestamp                       |

**Subscribers**: Dashboard headcount widget (invalidate), Leave context (freeze leave accrual on TERMINATED), Payroll context (halt payroll on TERMINATED)

---

### EmployeeDocumentUploaded

Emitted when a document is successfully attached to an employee record.

| Field          | Type                  | Description                                    |
| -------------- | --------------------- | ---------------------------------------------- |
| `documentId`   | `string`              | New document ID                                |
| `employeeId`   | `string`              | Owner employee                                 |
| `documentType` | `string`              | e.g., `CONTRACT`, `NATIONAL_ID`, `CERTIFICATE` |
| `expiryDate`   | `string \| undefined` | Document expiry, if applicable                 |
| `uploadedBy`   | `string`              | Actor                                          |
| `occurredAt`   | `string (ISO 8601)`   | Event timestamp                                |

---

### EmployeeDocumentDeleted

Emitted when a document is removed from an employee record.

| Field        | Type                | Description         |
| ------------ | ------------------- | ------------------- |
| `documentId` | `string`            | Deleted document ID |
| `employeeId` | `string`            | Owner employee      |
| `deletedBy`  | `string`            | Actor               |
| `occurredAt` | `string (ISO 8601)` | Event timestamp     |

---

## Employment Status State Machine

```
              ┌──────────────┐
  (new hire)  │              │
─────────────►│ ON_PROBATION │──────────────────────────┐
              │              │                          │
              └──────┬───────┘                          │
                     │ pass probation                   │ terminate
                     ▼                                  │
              ┌──────────────┐                          │
              │    ACTIVE    │◄────────────┐            │
              └──────┬───────┘             │            │
                     │                     │ reactivate  │
                     │ deactivate          │            │
                     ▼                     │            ▼
              ┌──────────────┐      ┌─────────────────────┐
              │   INACTIVE   │      │     TERMINATED      │
              └──────────────┘      │  (terminal state)   │
                                    └─────────────────────┘
```

Allowed transitions:
| From | To | Trigger |
|------|----|---------|
| `ON_PROBATION` | `ACTIVE` | Pass probation period |
| `ON_PROBATION` | `TERMINATED` | Fail probation / early exit |
| `ACTIVE` | `INACTIVE` | Deactivate (leave of absence, suspension) |
| `ACTIVE` | `TERMINATED` | Resignation, dismissal, redundancy |
| `INACTIVE` | `ACTIVE` | Reactivate |
| `INACTIVE` | `TERMINATED` | Terminate while inactive |

`TERMINATED` is a terminal state — no transitions out.
