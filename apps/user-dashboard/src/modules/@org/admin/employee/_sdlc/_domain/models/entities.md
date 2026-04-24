# Admin Employee Module — Domain Entities

_TypeScript-typed data shapes for the employee bounded context._

## Enumerations

```typescript
type ContractType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';

type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'ON_PROBATION';

type DocumentType =
  | 'CONTRACT'
  | 'NATIONAL_ID'
  | 'PASSPORT'
  | 'CERTIFICATE'
  | 'OFFER_LETTER'
  | 'OTHER';
```

---

## Employee

```typescript
interface Employee {
  id: string; // e.g. "emp_01HXYZ..."
  employeeNumber: string; // e.g. "ORG-0042" — human-readable identifier
  firstName: string;
  lastName: string;
  email: string; // unique within the organisation
  phone: string;
  dateOfBirth: string; // ISO 8601 date (YYYY-MM-DD)
  nationalId?: string; // NIN — sensitive PII; masked in list views
  bankVerificationNumber?: string; // BVN — sensitive PII; masked in list views

  // Role & structure
  departmentId: string;
  department: DepartmentRef; // denormalised for display — read from settings context
  roleId: string;
  role: RoleRef; // denormalised for display — read from settings context
  reportsToId?: string; // manager's employee ID

  // Contract
  contractType: ContractType;
  startDate: string; // ISO 8601 date
  endDate?: string; // ISO 8601 date — populated for CONTRACT type
  probationEndDate?: string; // ISO 8601 date — populated for ON_PROBATION status

  // Status
  employmentStatus: EmploymentStatus;

  // Meta
  avatarUrl?: string;
  createdAt: string; // ISO 8601 datetime
  updatedAt: string;
  createdBy: string; // admin user ID who created the record
}
```

---

## DepartmentRef / RoleRef

```typescript
interface DepartmentRef {
  id: string;
  name: string;
}

interface RoleRef {
  id: string;
  title: string;
}
```

---

## EmployeeListItem

Subset used for the table view — avoids shipping sensitive PII in list responses.

```typescript
interface EmployeeListItem {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  department: DepartmentRef;
  role: RoleRef;
  employmentStatus: EmploymentStatus;
  contractType: ContractType;
  startDate: string;
  avatarUrl?: string;
}
```

---

## PaginatedEmployeeList

```typescript
interface PaginatedEmployeeList {
  data: EmployeeListItem[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
```

---

## EmployeeDocument

```typescript
interface EmployeeDocument {
  id: string;
  employeeId: string;
  type: DocumentType;
  name: string; // original file name
  url: string; // signed download URL (short-lived)
  sizeBytes: number;
  mimeType: string;
  expiryDate?: string; // ISO 8601 date — for documents that expire
  uploadedAt: string; // ISO 8601 datetime
  uploadedBy: string; // admin user ID
}
```

---

## AuditEntry

```typescript
interface AuditEntry {
  id: string;
  employeeId: string;
  action:
    | 'CREATED'
    | 'UPDATED'
    | 'STATUS_CHANGED'
    | 'DOCUMENT_ADDED'
    | 'DOCUMENT_DELETED';
  actor: string; // admin user ID who performed the action
  actorName: string; // denormalised display name
  before?: Partial<Employee>; // snapshot of fields before the change
  after?: Partial<Employee>; // snapshot of fields after the change
  reason?: string; // populated for STATUS_CHANGED actions
  occurredAt: string; // ISO 8601 datetime
}
```

---

## Zod Validation Schemas (form-layer)

```typescript
import { z } from 'zod';

const EmployeeFormSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Must be a valid email address'),
    phone: z.string().regex(/^\+?[0-9\s\-]{7,15}$/, 'Invalid phone number'),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine(
        (val) => new Date(val) < new Date(),
        'Date of birth must be in the past'
      ),
    nationalId: z.string().optional(),
    departmentId: z.string().min(1, 'Department is required'),
    roleId: z.string().min(1, 'Role is required'),
    reportsToId: z.string().optional(),
    contractType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date is required'),
    endDate: z.string().optional(),
    probationEndDate: z.string().optional(),
  })
  .refine((data) => data.contractType !== 'CONTRACT' || !!data.endDate, {
    message: 'End date is required for contract employees',
    path: ['endDate'],
  });

const StatusChangeSchema = z.object({
  newStatus: z.enum(['ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_PROBATION']),
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(500).optional(),
});
```
