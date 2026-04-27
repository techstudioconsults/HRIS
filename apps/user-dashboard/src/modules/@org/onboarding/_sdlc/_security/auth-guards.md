# Onboarding — Auth Guards

## proxy.ts Enforcement

All `/onboarding/*` routes are in the `AUTH_BLOCKED_FOR_AUTHENTICATED_PREFIXES` list. This means:

- Authenticated users who have completed onboarding → redirect to dashboard.
- Unauthenticated users → redirect to `/login`.

The proxy logic:

```
Request to /onboarding/*
  └─▶ getToken() → null       → redirect /login
  └─▶ getToken() → valid      → check setup status
        └─▶ takenTour = true  → redirect getDashboardRoute(permissions)
        └─▶ takenTour = false → allow through (show onboarding wizard)
```

## OnboardingRouteGuard Component

A client-side guard component rendered on each onboarding page. Provides a fallback for edge cases where the middleware did not redirect:

```typescript
// components/onboarding-route-guard.tsx
export function OnboardingRouteGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') return <FullPageSpinner />;
  if (status === 'unauthenticated') {
    redirect('/login');
    return null;
  }

  return <>{children}</>;
}
```

## Company-Level Data Guard

The backend enforces company scoping on all onboarding endpoints. The owner cannot accidentally modify another company's data — all PATCH/DELETE operations validate that the resource belongs to the JWT's company.

## Employee Isolation

Employees invited in Step 3 cannot access the onboarding wizard. Their role (`employee`) is checked by `proxy.ts` — they are redirected to `/user/home`.
