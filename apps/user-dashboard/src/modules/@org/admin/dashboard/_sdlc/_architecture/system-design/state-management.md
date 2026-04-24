# Admin Dashboard — State Management

_How application state is managed within the dashboard module._

## State Categories

### Server State (TanStack Query)

All data fetched from backend APIs is managed exclusively by TanStack Query. This covers headcount, attendance, pending actions, activity feed, leave summary, and payroll summary. No duplication of this state in Zustand or component state.

- Query keys are defined in the monorepo-wide `src/lib/react-query/query-keys.ts` file under the `dashboard` namespace.
- `staleTime` is set per query based on how frequently the underlying data changes (see `data-flow.md`).
- `gcTime` (garbage collection) defaults to 10 minutes — sufficient for a typical admin session.

### UI State (Local Component State)

The dashboard has minimal interactive UI state:

| State                       | Location                           | Description                                                            |
| --------------------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| Onboarding banner dismissed | `localStorage` via custom hook     | Persisted across page reloads; reset when new setup steps are detected |
| Active activity feed tab    | `useState` in `RecentActivityFeed` | Transient; resets on unmount                                           |

### Session / Auth State

Organisation onboarding status is read from the session context provided by the app shell (`useSession` hook). The dashboard module does not write to session state.

## Anti-patterns to Avoid

- Do not lift dashboard widget state to a global Zustand store — each widget is self-contained.
- Do not `useEffect` + `useState` for data fetching — always delegate to TanStack Query.
- Do not pass fetched data down as props through multiple component layers; co-locate the `useQuery` call with the component that needs it.
