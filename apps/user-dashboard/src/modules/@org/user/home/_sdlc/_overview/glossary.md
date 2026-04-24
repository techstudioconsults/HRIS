# User Home — Glossary

_Domain and module-specific terms used across the home dashboard SDLC documents._

## Terms

| Term                           | Definition                                                                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Activity**                   | A single HR event visible in the employee's recent-activity feed (e.g. leave approved, payslip available).                         |
| **ActivityType**               | Enum of event categories: `approved`, `rejected`, `available`, `submitted`.                                                        |
| **Quick Action**               | A shortcut card on the home dashboard that navigates the employee to a key HR self-service flow.                                   |
| **SetupTask**                  | One item in the onboarding checklist (e.g. reset password, review profile). Has a `status` of `pending`, `completed`, or `locked`. |
| **SetupTaskStatus**            | The progress state of a single setup task: `pending` (not started), `completed` (done), `locked` (cannot be started yet).          |
| **Active-User View**           | The home dashboard variant rendered when `userSetupComplete === true` — shows quick actions and recent activities.                 |
| **Onboarding View**            | The home dashboard variant rendered when setup is incomplete — shows the guided checklist and progress header.                     |
| **SETUP_TASKS_TOTAL**          | Constant: 4 — the total number of setup tasks an employee must complete.                                                           |
| **SETUP_COMPLETION_THRESHOLD** | Constant: 4 — the number of completed tasks required to transition from onboarding view to active-user view.                       |
| **RecentActivitiesProps**      | Props type for the `RecentActivities` component; accepts an array of `Activity` objects.                                           |
