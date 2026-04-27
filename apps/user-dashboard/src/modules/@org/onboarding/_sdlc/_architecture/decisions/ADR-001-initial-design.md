---
section: architecture
topic: adr
id: ADR-001
status: Accepted
---

# ADR-001 — Onboarding Architecture: Multi-Step Wizard with Partial Saves

## Context

The onboarding flow has 3 steps with distinct data entities (company, teams/roles, employees). Users may leave mid-flow and return. Steps are sequential but each must save independently.

## Decisions

1. **Separate pages per step** — `/onboarding/step-1`, `/step-2`, `/step-3`. Each page owns its own service calls and form state. No shared form state across steps (no multi-step form library). This simplifies back-navigation and partial saves.

2. **OnboardingService for all mutations** — wraps `HttpAdapter` for all CRUD operations on company, teams, roles, and employees. Consumed via `useOnboardingService()` hooks (TanStack Query mutations).

3. **No global onboarding store** — each step manages its own local state. Teams/roles in Step 2 are fetched fresh on Step 2 mount (not carried forward from Step 1). Employee form in Step 3 fetches teams+roles to populate dropdowns.

4. **Accordion UI for Step 2 and Step 3** — owner can configure multiple teams (Step 2) or invite multiple employees (Step 3) without leaving the page. Each accordion panel is an independent form.

5. **Setup status from backend** — `OnboardingSetupStatus` is fetched from `/employees/:id/setup` and used by the route guard. It is not duplicated in client state — always the source of truth is the backend.

6. **Driver.js tour** — optional, triggered from the Welcome page. Tour steps are configured in `config/tour-steps.ts`. Completing or dismissing the tour sets `takenTour = true` via `PATCH /employees/:id/setup`.

## Consequences

- **Positive**: Each step is independently testable and deployable.
- **Positive**: Back-navigation is safe — partial saves per step mean no data loss.
- **Negative**: Teams and roles must be re-fetched at the start of Step 3 to populate employee dropdowns — a small additional API call.
