# User Home — Fetch Flow Sequence

_Sequence diagram for loading the employee home dashboard._

## Active-User Dashboard Load

```
Browser          Next.js Server       Auth Session       (Future) Activities API
   |                   |                   |                        |
   |  GET /user/dashboard                  |                        |
   |──────────────────>|                   |                        |
   |                   |  read session     |                        |
   |                   |──────────────────>|                        |
   |                   |  { name, userSetupComplete: true }         |
   |                   |<──────────────────|                        |
   |                   |  GET /employees/{id}/activities            |
   |                   |───────────────────────────────────────────>|
   |                   |  Activity[]                                |
   |                   |<───────────────────────────────────────────|
   |  ActiveUserView (HTML + hydration data)                        |
   |<──────────────────|                   |                        |
```

## Onboarding Dashboard Load

```
Browser          Next.js Server       Auth Session
   |                   |                   |
   |  GET /user/dashboard                  |
   |──────────────────>|                   |
   |                   |  read session     |
   |                   |──────────────────>|
   |                   |  { name, userSetupComplete: false, setupTasks: [...] }
   |                   |<──────────────────|
   |  OnboardingView (HTML)                |
   |<──────────────────|                   |
```
