---
section: architecture
topic: state-management
---

# Auth — State Management

## State Sources

| Layer      | Tool                         | What It Owns                                                        |
| ---------- | ---------------------------- | ------------------------------------------------------------------- |
| Session    | NextAuth JWT cookie          | `employee`, `tokens` (`accessToken`, `refreshToken`), `permissions` |
| UI store   | Zustand (`useAuthStore`)     | `user`, `isAuthenticated`, `sessionExpiry` — derived from session   |
| Form state | React Hook Form              | In-flight form values, validation errors, submission state          |
| Mutations  | TanStack Query `useMutation` | Loading, error, success state for auth mutations                    |

## Zustand Store

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sessionExpiry: Date | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  clearUser: () => void;
  logout: () => void;
  setSessionExpiry: (expiry: Date | null) => void;
}
```

**Lifecycle:**

- Populated on session resolve (e.g., from `useSession()` in a layout provider).
- Cleared on `logout()` — which is called after `signOut()` completes.
- Not persisted — resets on page reload (session re-populates it).

## Token Lifecycle

```
NextAuth session JWT
  ├── accessToken   → tokenManager.getAccessToken() → HttpAdapter request headers
  └── refreshToken  → tokenManager.refreshAccessToken() → called on 401
```

The `tokenManager` reads from the NextAuth session (server or client). The HttpAdapter interceptor is the only consumer — components never touch tokens directly.

## Form State Pattern

All auth forms follow this pattern:

```typescript
const form = useForm<FormSchema>({ resolver: zodResolver(schema) });
const mutation = useMutation({ mutationFn: authService.login });

function onSubmit(data: FormSchema) {
  mutation.mutate(data, {
    onSuccess: () => router.push('/onboarding'),
    onError: (err) => form.setError('root', { message: err.message }),
  });
}
```

No query keys needed — auth is pure mutations with no cacheable server state.
