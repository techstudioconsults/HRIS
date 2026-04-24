# ADR-001: Home Module Initial Design

**Date**: 2026-04-23
**Status**: Accepted

## Context

The employee home page must serve two distinct audiences: active employees (complete profile) and new employees still in onboarding. A single view would either clutter the new-employee experience with irrelevant quick actions or strip active employees of useful context.

## Options Considered

1. **Single view with conditional section rendering** — one component tree, sections shown/hidden by flags.
2. **Two separate view components with a switching parent** — `ActiveUserView` and `OnboardingView` as independent component trees rendered by a parent `HomePage`.
3. **Separate routes** (`/user/dashboard` vs `/user/onboarding`) — redirect on login based on profile state.

## Decision

Option 2: two separate view components (`_views/active-user` and `_views/onboarding`) rendered by `HomePage` based on the `userSetupComplete` flag from the session.

## Rationale

- Keeps each view's component tree focused and independently testable.
- Avoids prop-drilling and conditional complexity in a single monolithic view.
- The shared route (`/user/dashboard`) makes deep-linking and bookmarking simpler than option 3.

## Consequences

- `HomePage` acts as a thin orchestrator — it reads the session and delegates rendering to the correct view.
- Any new view variant (e.g., a suspended/offboarding employee view) follows the same pattern.
- Each view is tested independently via its own unit test file.
