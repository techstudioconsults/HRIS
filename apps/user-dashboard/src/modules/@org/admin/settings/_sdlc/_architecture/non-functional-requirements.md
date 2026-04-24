# Settings Module — Non-Functional Requirements

## Performance

| Requirement                            | Target                                        |
| -------------------------------------- | --------------------------------------------- |
| Settings tab initial load (cache miss) | < 2 seconds (P95)                             |
| Settings tab switch (cache hit)        | Instant (< 100ms)                             |
| Save any settings tab                  | < 3 seconds (P95)                             |
| Logo upload (2 MB max)                 | Progress visible; completes within 15 seconds |
| Roles list load                        | < 2 seconds (P95) with up to 100 custom roles |

## Reliability

- A single tab's API failure must not crash the entire settings page.
- Form values must be preserved on save error so the admin can retry without re-entering data.
- `staleTime: 10min` reduces redundant API calls for a configuration screen that changes infrequently.

## Accessibility

- Tab navigation: `role="tablist"` / `role="tab"` / `role="tabpanel"` landmark pattern.
- Each form field has a `<label>` linked via `htmlFor`.
- Validation errors linked via `aria-describedby`.
- Toggle switches (2FA, notification toggles) use `role="switch"` with `aria-checked`.
- Logo preview has `alt` text describing the current organisation logo.

## Security

- Only `ADMIN` role can access the Settings module — enforced in `proxy.ts` and on the backend.
- `organisationId` is always derived from the JWT on the backend — never accepted from the request body.
- Logo upload: file type and size validated client-side AND server-side; stored in a private bucket.

## Observability

- All settings save errors logged with `settingsDomain` context field.
- Roles creation/deletion logged as audit events on the backend.

## Compliance

- All settings changes persist `updatedBy` (user ID from JWT) and `updatedAt` timestamp.
- Password policy settings must enforce a minimum that meets Nigerian NDPR guidelines.
