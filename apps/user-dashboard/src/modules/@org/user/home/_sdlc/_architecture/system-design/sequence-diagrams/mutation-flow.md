# User Home — Mutation Flow Sequence

_The home module has no direct mutations. All mutations are delegated to other modules._

## Quick-Action Navigation Flow

The home dashboard triggers navigation rather than mutations:

```
Employee               Home Dashboard          Target Module
   |                        |                       |
   |  clicks "Request Leave"|                       |
   |───────────────────────>|                       |
   |                        |  router.push('/user/leave')
   |                        |──────────────────────>|
   |                   [Leave module renders]       |
   |<──────────────────────────────────────────────>|
```

## Onboarding Task Action Flow

```
Employee               OnboardingView        Onboarding Module / Auth
   |                        |                       |
   |  clicks task button    |                       |
   |───────────────────────>|                       |
   |                        |  buttonAction()       |
   |                        |──────────────────────>|
   |                        |  (e.g. navigate to profile page)
   |<──────────────────────────────────────────────>|
```

## Notes

- The home module never calls `POST`, `PATCH`, or `DELETE` directly.
- Setup task completion is reflected on subsequent page loads via a fresh session read.
