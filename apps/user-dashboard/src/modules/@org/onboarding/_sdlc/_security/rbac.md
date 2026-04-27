# Onboarding — RBAC Configuration

## Route Access

| Route                 | Required      | Who                                                  |
| --------------------- | ------------- | ---------------------------------------------------- |
| `/onboarding/welcome` | Authenticated | Owner only (proxy redirects non-owners to dashboard) |
| `/onboarding/step-1`  | Authenticated | Owner only                                           |
| `/onboarding/step-2`  | Authenticated | Owner only                                           |
| `/onboarding/step-3`  | Authenticated | Owner only                                           |

## Who Goes Through Onboarding?

Only the **company owner** (role: `owner`, permission: `admin:admin`) goes through the initial onboarding wizard. Employees invited in Step 3 log in directly to their dashboard — they do not see the onboarding wizard.

## Permission Requirements for API Calls

All onboarding endpoints require a valid Bearer token. The backend enforces company-scoping:

- `PATCH /companies/current` — only the company owner can update company details.
- `POST /teams`, `POST /roles`, `POST /employees/onboard` — require `admin:admin` permission.

## Post-Onboarding Access

After completing onboarding, the owner is redirected to `/admin/dashboard`. The onboarding routes are blocked by `proxy.ts` for users whose `takenTour` flag is `true`.

## Employees Cannot Access Onboarding

Regular employees (`employee` role) are never routed to `/onboarding/*`. The proxy redirects them to `/user/home`.
