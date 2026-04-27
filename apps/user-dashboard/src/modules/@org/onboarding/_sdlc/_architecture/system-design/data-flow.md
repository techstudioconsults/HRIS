---
section: architecture
topic: data-flow
---

# Onboarding — Data Flow

## Step 1 — Company Profile

```
CompanyProfileView mounts
  └─▶ GET /companies/current → pre-fill form with existing company data
User fills fields → submits
  └─▶ PATCH /companies/current { name, industry, size, address }
  ◀── 200 { data: CompanyProfile }
  └─▶ router.push('/onboarding/step-2')
```

## Step 2 — Teams & Roles

```
TeamsAndRolesView mounts
  └─▶ GET /teams → load existing teams
        └─▶ For each team: GET /roles/:teamId → load roles
  └─▶ Render TeamConfigAccordion[] from fetched data

Add team:
  └─▶ POST /teams { name }
  ◀── 201 { data: TeamApiResponse }
  └─▶ setTeams([...teams, newTeam])

Add role to team:
  └─▶ POST /roles { name, teamId, permissions[] }
  ◀── 201 { data: RoleApiResponse }
  └─▶ Update local team.roles state

Delete team:
  └─▶ DELETE /teams/:teamId
  ◀── 204
  └─▶ setTeams(teams.filter(...))

Next:
  └─▶ router.push('/onboarding/step-3')
```

## Step 3 — Employee Onboarding

```
EmployeeOnboardingView mounts
  └─▶ GET /teams (with roles) → populate TeamSelect + RoleSelect dropdowns

Invite employees:
  └─▶ Collect all employee forms into payload
  └─▶ POST /employees/onboard { employees: Employee[] }
  ◀── 201 { data: { invited: number } }
  └─▶ router.push('/admin/dashboard')

On dashboard first visit:
  └─▶ MarkOnboardingCompleteOnDashboardVisit
        └─▶ PATCH /employees/:id/setup { takenTour: true }
```

## Setup Status Check (Route Guard)

```
OnboardingRouteGuard mounts on each onboarding page
  └─▶ GET /employees/:id/setup
  ◀── OnboardingSetupStatus
  └─▶ If all steps complete → redirect to dashboard
```
