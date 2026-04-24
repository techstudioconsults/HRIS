# User Leave — Data Exposure Controls

## Data Classification

| Field                    | Sensitivity | Exposure Rule                                                                          |
| ------------------------ | ----------- | -------------------------------------------------------------------------------------- |
| `reason`                 | Low         | Visible to the submitting employee and approving manager only                          |
| `rejectionReason`        | Low         | Read-only to the submitting employee; set only by HR/manager                           |
| `employeeId`             | Internal    | Never shown in the UI; scoped by JWT on the backend                                    |
| `approvedBy`             | Low         | Not shown to the employee (approver identity is not exposed to reduce social dynamics) |
| `supportingDocumentName` | Low         | Shown to the employee; document content stored privately                               |
| `leaveTypeId`            | None        | Internal reference; `type` (name) shown instead                                        |

## Document Upload Security

- Supporting documents are optional and limited to 5 MB.
- File type validation: PDF, JPG, PNG only — enforced on backend.
- Documents are stored in a private bucket; not publicly accessible.
- Signed download URLs are short-lived (15 min) and generated on demand.

## Cross-Employee Data Isolation

The `GET /leave-request` endpoint returns only the authenticated employee's requests. There is no query parameter that allows requesting another employee's data from this module. The admin leave module has a separate endpoint with appropriate admin-only access controls.

## Rejection Reason Display

`rejectionReason` is shown in the `LeaveDetailsModal` only when `status === 'rejected'`. It is always read-only from the employee's perspective and cannot be modified via any frontend action.
