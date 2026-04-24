# AC-001 — Account Settings Validation

_Precise validation rules for the Account Settings form fields._

## Validation Rules

### Organisation Name

| Rule       | Condition                | Error                                                |
| ---------- | ------------------------ | ---------------------------------------------------- |
| Required   | `name.trim().length > 0` | "Organisation name is required."                     |
| Max length | `name.length <= 200`     | "Organisation name must be 200 characters or fewer." |

### Contact Email

| Rule         | Condition                 | Error                                 |
| ------------ | ------------------------- | ------------------------------------- |
| Required     | `email.trim().length > 0` | "Contact email is required."          |
| Valid format | Zod `z.string().email()`  | "Please enter a valid email address." |

### Logo Upload

| Rule      | Condition                         | Error                              |
| --------- | --------------------------------- | ---------------------------------- |
| File type | MIME: `image/png` or `image/jpeg` | "Logo must be a PNG or JPG image." |
| File size | `sizeBytes <= 2_097_152` (2 MB)   | "Logo must be smaller than 2 MB."  |

### Phone Number

| Rule     | Condition                                   | Error                                |
| -------- | ------------------------------------------- | ------------------------------------ |
| Optional | Blank is allowed                            | —                                    |
| Format   | E.164 or standard national format (lenient) | "Please enter a valid phone number." |

## UI Behaviour

- Inline errors appear below each field on blur or on submit attempt.
- The "Save Changes" button is disabled while the form has unresolved validation errors.
- Logo preview renders immediately on file selection (before save).
- After a successful save, all fields reflect the newly saved values.

## Test Scenarios

- Empty org name → inline required error, save disabled.
- Org name of 201 characters → inline length error.
- Logo of 3 MB PNG → client-side file size error, no API call.
- Valid email and name → save succeeds, success toast shown.
- API returns 500 → error toast, form values retained.
