---
section: architecture
topic: state-management
---

# Onboarding — State Management

## State Sources

| Layer               | Tool                         | What It Owns                                                  |
| ------------------- | ---------------------------- | ------------------------------------------------------------- |
| Server state (read) | TanStack Query `useQuery`    | `GET /employees/:id/setup` (setup status for route guard)     |
| Mutations           | TanStack Query `useMutation` | company PATCH, team CRUD, role CRUD, employee batch invite    |
| Form state          | React Hook Form              | In-flight form values per step (one form per accordion panel) |
| Tour state          | Driver.js (internal)         | Tour step position, highlight target                          |
| URL                 | Next.js router               | Active step (via route path, not query params)                |

## No Shared Cross-Step State

Steps do not share form state. Each step fetches what it needs independently:

- Step 1 fetches the current company profile on mount (to pre-fill the form).
- Step 2 fetches existing teams + their roles on mount (to populate the accordion).
- Step 3 fetches teams + roles again to populate team/role dropdowns in the employee form.

## Setup Status Query

```typescript
// Used by OnboardingRouteGuard and the Dashboard completion tracker
useQuery({
  queryKey: ['onboarding', 'setup', employeeId],
  queryFn: () => onboardingService.getSetupStatus(employeeId),
});
```

After completing the wizard, `MarkOnboardingCompleteOnDashboardVisit` calls:

```typescript
useMutation({
  mutationFn: () =>
    onboardingService.updateSetupStatus(employeeId, { takenTour: true }),
});
```

## Team/Role Local State (Step 2)

Within Step 2, the accordion item list is tracked in local React state:

```typescript
const [teams, setTeams] = useState<Team[]>(fetchedTeams);
```

After each team/role API mutation succeeds, the local state is updated to reflect the change. This avoids a full refetch after every action.

## Form Pattern Per Step

```typescript
const form = useForm<StepSchema>({
  resolver: zodResolver(schema),
  defaultValues: fetchedData,
});
const mutation = useMutation({ mutationFn: onboardingService.updateCompany });

async function onSubmit(data: StepSchema) {
  mutation.mutate(data, {
    onSuccess: () => router.push('/onboarding/step-2'),
    onError: (err) => form.setError('root', { message: err.message }),
  });
}
```
