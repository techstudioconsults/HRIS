# User Home — Domain Entities

_Domain model definitions used by the employee home dashboard._

## Activity

Represents a single HR event in the employee's recent-activity timeline.

```ts
interface Activity {
  id: string;
  type: ActivityType; // 'approved' | 'rejected' | 'available' | 'submitted'
  title: string;
  message: string;
  timestamp?: Date | string | null;
}
```

**Invariants**: `id` and `type` are required. `message` must be human-readable and must not contain internal system details.

## QuickAction

A shortcut entry rendered as a card on the active-user dashboard.

```ts
interface QuickAction {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  href: string; // internal route, e.g. '/user/leave'
}
```

## SetupTask

A single onboarding checklist item assigned to a new employee.

```ts
interface SetupTask {
  id: string; // SETUP_TASK_IDS constant values
  title: string;
  description: string;
  status: SetupTaskStatus; // 'pending' | 'completed' | 'locked'
  icon: React.ReactNode;
  decorativeIcon: React.ReactNode;
  buttonLabel: string;
  buttonAction: () => void | Promise<void>;
  order: number;
}
```

**Invariants**: Tasks are ordered 1–4. A task cannot move from `locked` to `completed` without first becoming `pending`. The `buttonAction` for a `locked` task must be a no-op.

## SetupPageState

Aggregate view-model for the onboarding view.

```ts
interface SetupPageState {
  tasks: SetupTask[];
  completedCount: number;
  totalCount: number; // always SETUP_TASKS_TOTAL (4)
  isLoading: boolean;
  userSetupComplete: boolean;
}
```
