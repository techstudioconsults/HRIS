---
section: api
topic: error-handling
---

# Onboarding — API Error Handling

## Error Matrix

| Status | Endpoint                 | Scenario           | UI Behaviour                                                    |
| ------ | ------------------------ | ------------------ | --------------------------------------------------------------- |
| `422`  | Any                      | Validation failure | Map `errors[].field` to `form.setError(field, message)`         |
| `409`  | DELETE /teams/:id        | Team has employees | Toast "This team has employees. Reassign them before deleting." |
| `409`  | POST /employees/onboard  | Duplicate email    | Show field error on affected employee's email field             |
| `404`  | GET /employees/:id/setup | Employee not found | Log error; onboarding guard falls back to showing wizard        |
| `500`  | Any                      | Server error       | Toast "Something went wrong. Please try again."                 |

## Retry Policy

All onboarding mutations retry 0 times. Errors are surfaced immediately for the user to correct and retry. The exception is `GET /employees/:id/setup` which retries up to 2 times (TanStack Query default for queries).

## Validation Error Mapping

Backend returns errors in the shape:

```json
{
  "errors": [
    {
      "field": "name",
      "code": "REQUIRED",
      "message": "Company name is required."
    }
  ]
}
```

Map each to `form.setError(error.field, { message: error.message })` in the `onError` callback.

## Empty State Handling

- `GET /teams` returning `data: []` → render "No teams yet. Add your first team." with a CTA.
- `GET /roles/:teamId` returning `data: []` → render "No roles for this team yet." with CTA.
