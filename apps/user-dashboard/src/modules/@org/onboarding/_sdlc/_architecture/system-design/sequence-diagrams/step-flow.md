---
section: architecture
topic: sequence-diagram-step-flow
---

# Onboarding — Step Flow (Sequence Diagrams)

## Step 1 — Company Profile Save

```
Browser        CompanyProfileForm   OnboardingService   Backend API
   |                   |                   |                 |
   |-- submit ────────▶|                   |                 |
   |                   |-- updateCompany() ▶|                 |
   |                   |                   |-- PATCH /companies/current ──▶|
   |                   |                   |◀── 200 CompanyProfile         |
   |                   |◀── success ───────|                 |
   |                   |-- router.push('/onboarding/step-2') |
   |◀── /step-2 ───────|                   |                 |
```

## Step 2 — Add Team

```
Browser        AddTeamButton        OnboardingService   Backend API
   |               |                     |                  |
   |-- click ─────▶|                     |                  |
   |               |-- createTeam({ name }) ───────────────▶|
   |               |                     |-- POST /teams ───▶|
   |               |                     |◀── 201 { team }  |
   |               |◀── success ─────────|                  |
   |               |-- setTeams([...teams, newTeam])         |
   |◀── new accordion item appears
```

## Step 3 — Batch Employee Invite

```
Browser        FinishButton   OnboardingService   Backend API
   |               |               |                  |
   |-- click ─────▶|               |                  |
   |               |-- onboardEmployees(employees[]) ─▶|
   |               |               |-- POST /employees/onboard ──▶|
   |               |               |◀── 201 { invited: 3 }        |
   |               |◀── success ───|                  |
   |               |-- router.push('/admin/dashboard')  |
   |◀── /admin/dashboard
```
