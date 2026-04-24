# Leave Management — State Management

_Documents all state concerns in the leave module and the chosen solution for each._

## State Taxonomy

| State Concern                                    | Type         | Solution                      | Location                              |
| ------------------------------------------------ | ------------ | ----------------------------- | ------------------------------------- |
| Leave requests list (paginated)                  | Server state | TanStack Query                | `hooks/use-leave-requests.ts`         |
| Leave types list                                 | Server state | TanStack Query                | `hooks/use-leave-types.ts`            |
| Organisation leave policy                        | Server state | TanStack Query                | `hooks/use-leave-policy.ts`           |
| Employee leave balance                           | Server state | TanStack Query                | `hooks/use-employee-leave-balance.ts` |
| Active filter values                             | UI state     | Zustand                       | `store/use-leave-filter-store.ts`     |
| Current pagination page                          | UI state     | Zustand (within filter store) | `store/use-leave-filter-store.ts`     |
| Detail drawer: open/closed + selected request ID | UI state     | Zustand                       | `store/use-leave-drawer-store.ts`     |
| Setup wizard: current step + draft form data     | UI state     | Zustand                       | `store/use-leave-wizard-store.ts`     |
| Leave type form: field values during edit        | Form state   | React Hook Form               | `components/leave-type-form.tsx`      |
| Leave policy form: field values during edit      | Form state   | React Hook Form               | `components/leave-policy-form.tsx`    |

## Zustand Store Contracts

### `useLeaveFilterStore`

```ts
interface LeaveFilterState {
  status: LeaveRequestStatus | 'all';
  leaveTypeId: string | null;
  departmentId: string | null;
  dateRange: { from: Date | null; to: Date | null };
  page: number;
  setFilter: (
    key: keyof Omit<LeaveFilterState, 'setFilter' | 'reset' | 'page'>,
    value: unknown
  ) => void;
  setPage: (page: number) => void;
  reset: () => void;
}
```

### `useLeaveWizardStore`

```ts
interface LeaveWizardState {
  currentStep: 'leave-types' | 'policy' | 'review';
  draftLeaveTypes: Partial<CreateLeaveTypeDto>[];
  draftPolicy: Partial<CreateLeavePolicyDto>;
  setStep: (step: LeaveWizardState['currentStep']) => void;
  addDraftLeaveType: (lt: Partial<CreateLeaveTypeDto>) => void;
  setDraftPolicy: (policy: Partial<CreateLeavePolicyDto>) => void;
  reset: () => void;
}
```

## TanStack Query Key Conventions

All leave query keys are defined in `src/lib/react-query/query-keys.ts`:

```ts
// leave namespace
['leave', 'requests', filters][('leave', 'requests', requestId)][ // paginated request list // single request detail
  ('leave', 'types')
][('leave', 'types', typeId)][('leave', 'policy')][ // all leave types for org // single leave type // org leave policy
  ('leave', 'balance', employeeId)
]; // employee leave balance
```

Invalidation on mutation targets the most specific key — never invalidate the entire `['leave']` namespace to avoid unnecessary re-fetches.
