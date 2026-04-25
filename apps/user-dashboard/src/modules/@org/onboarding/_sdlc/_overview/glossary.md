---
section: overview
topic: glossary
---

# Onboarding — Glossary

| Term                     | Definition                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| **Company Profile**      | The company's name, industry, size, and address — stored in `/companies/current`.                         |
| **Team**                 | An organizational unit (e.g., "Engineering", "HR") that groups employees.                                 |
| **Role**                 | A position within a team (e.g., "Senior Engineer") with a defined set of permissions.                     |
| **Permission**           | A granular access right, e.g., `payroll:read`, `employee:manage`.                                         |
| **Onboarding Wizard**    | The 3-step setup flow at `/onboarding/step-1` through `/onboarding/step-3`.                               |
| **Setup Status**         | A per-employee record (`OnboardingSetupStatus`) tracking which onboarding checklist items are done.       |
| **takenTour**            | A boolean flag on the setup status indicating the employee has completed or dismissed the Driver.js tour. |
| **Owner**                | The company administrator who goes through the full onboarding wizard after registration.                 |
| **Driver.js**            | The guided tour library used for the optional interactive onboarding tour.                                |
| **OnboardingRouteGuard** | A component that verifies the user is authenticated before rendering onboarding pages.                    |
| **Accordion**            | The UI pattern used in Step 2 and Step 3 to show/hide team/employee configuration panels.                 |
