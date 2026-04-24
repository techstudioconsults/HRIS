# Admin Employee Module — API Reference

_All backend endpoints consumed by the employee management module._

## Base URL

`/api/v1`

---

## Employee CRUD

### List Employees

`GET /employees`

Query parameters:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `q` | `string` | No | Search by name, employee number, or email |
| `department` | `string` | No | Filter by department ID |
| `role` | `string` | No | Filter by role ID |
| `status` | `EmploymentStatus` | No | Filter by employment status |
| `contractType` | `ContractType` | No | Filter by contract type |
| `page` | `number` | No | 1-based page number (default: 1) |
| `size` | `number` | No | Page size (default: 20, max: 100) |

Response `200 OK`:

```json
{
  "data": [
    {
      "id": "emp_01",
      "employeeNumber": "ORG-0001",
      "firstName": "Amara",
      "lastName": "Okafor",
      "email": "amara.okafor@company.com",
      "department": { "id": "dept_eng", "name": "Engineering" },
      "role": { "id": "role_swe_sr", "title": "Senior Software Engineer" },
      "employmentStatus": "ACTIVE",
      "contractType": "FULL_TIME",
      "startDate": "2022-03-01",
      "avatarUrl": null
    }
  ],
  "total": 47,
  "page": 1,
  "size": 20,
  "totalPages": 3
}
```

---

### Create Employee

`POST /employees`

Request body: `EmployeeFormSchema` (see `_domain/models/entities.md`)

Response `201 Created`:

```json
{
  "data": {
    "id": "emp_new",
    "employeeNumber": "ORG-0048",
    "...": "all Employee fields"
  }
}
```

Error `409 Conflict` — duplicate email:

```json
{
  "type": "https://hris.example.com/errors/duplicate-email",
  "title": "Duplicate Email",
  "status": 409,
  "detail": "An employee with this email address already exists.",
  "errors": [{ "field": "email", "code": "DUPLICATE_EMAIL" }]
}
```

---

### Get Employee

`GET /employees/:id`

Response `200 OK`: Full `Employee` object.

Response `404 Not Found`:

```json
{
  "type": "https://hris.example.com/errors/not-found",
  "title": "Employee Not Found",
  "status": 404,
  "detail": "No employee with id 'emp_99' exists."
}
```

---

### Update Employee

`PATCH /employees/:id`

Request body: Partial `EmployeeFormSchema` — only fields being changed.
Response `200 OK`: Updated full `Employee` object.

---

### Change Employment Status

`POST /employees/:id/status`

Request body:

```json
{
  "newStatus": "TERMINATED",
  "effectiveDate": "2025-06-01",
  "reason": "Resignation"
}
```

Response `200 OK`: Updated full `Employee` object.

Error `422 Unprocessable Entity` — invalid transition:

```json
{
  "type": "https://hris.example.com/errors/invalid-status-transition",
  "title": "Invalid Status Transition",
  "status": 422,
  "detail": "Cannot transition from TERMINATED to ACTIVE.",
  "errors": [{ "field": "newStatus", "code": "INVALID_TRANSITION" }]
}
```

---

## Employee Documents

### List Documents

`GET /employees/:id/documents`

Response `200 OK`:

```json
{
  "data": [
    {
      "id": "doc_01",
      "employeeId": "emp_01",
      "type": "CONTRACT",
      "name": "Employment Contract 2022.pdf",
      "url": "https://storage.example.com/signed-url-...",
      "sizeBytes": 204800,
      "mimeType": "application/pdf",
      "uploadedAt": "2022-03-01T08:00:00Z",
      "uploadedBy": "admin_01"
    }
  ]
}
```

### Upload Document

`POST /employees/:id/documents`

Request: `multipart/form-data` — fields: `file` (File), `type` (DocumentType), `expiryDate` (optional ISO date).
Response `201 Created`: `EmployeeDocument` object.

### Delete Document

`DELETE /employees/:id/documents/:docId`

Response `204 No Content`.

---

## Audit Trail

### Get Audit Trail

`GET /employees/:id/audit`

Query parameters: `page` (default 1), `size` (default 20).

Response `200 OK`:

```json
{
  "data": [
    {
      "id": "audit_01",
      "employeeId": "emp_01",
      "action": "STATUS_CHANGED",
      "actor": "admin_01",
      "actorName": "System Admin",
      "before": { "employmentStatus": "ACTIVE" },
      "after": { "employmentStatus": "TERMINATED" },
      "reason": "Resignation",
      "occurredAt": "2025-06-01T10:30:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "size": 20,
  "totalPages": 1
}
```
