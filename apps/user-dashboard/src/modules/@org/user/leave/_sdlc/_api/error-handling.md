# User Leave — API Error Handling

## Error Code Registry

| HTTP Status | Code                     | Trigger                                        | UI Behaviour                                                                                       |
| ----------- | ------------------------ | ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `400`       | `VALIDATION_ERROR`       | Malformed request body                         | Map `errors[].field` to form fields; show inline errors                                            |
| `401`       | `UNAUTHENTICATED`        | Session expired                                | Interceptor → sign out + redirect to `/login`                                                      |
| `403`       | `FORBIDDEN`              | Employee accessing another employee's requests | Page-level error; should never happen via normal UI navigation                                     |
| `409`       | `REQUEST_NOT_PENDING`    | Edit/delete on non-pending request             | Toast: "This request can no longer be edited."                                                     |
| `422`       | `END_BEFORE_START`       | End date before start date                     | Map to `endDate` field: "End date must be after start date."                                       |
| `422`       | `EXCEEDS_BALANCE`        | Request days exceed remaining balance          | Toast: "You do not have enough leave days remaining."                                              |
| `422`       | `LEAVE_TYPE_UNAVAILABLE` | Selected leave type no longer active           | Toast: "This leave type is no longer available. Please select another."                            |
| `500`       | `INTERNAL_ERROR`         | Unexpected server error                        | Toast: "Something went wrong. Your request was not submitted — please try again." Form stays open. |

## General Rules

1. Client-side Zod validation (`requestLeaveSchema`) runs before every API call — most field errors are caught before any request is made.
2. API validation errors (`422`) that have a `field` in `errors[]` are mapped to the corresponding form field via React Hook Form `setError`.
3. API errors without a field attribution (EXCEEDS_BALANCE, LEAVE_TYPE_UNAVAILABLE) are shown as a toast.
4. The form is **never closed** on error — the employee retains their input for correction.
5. List and balance load errors show a non-blocking error state with a Retry button.
