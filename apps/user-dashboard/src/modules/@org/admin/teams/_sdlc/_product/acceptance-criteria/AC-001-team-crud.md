---
section: product
topic: acceptance-criteria
id: AC-001
---

# AC-001 — Team CRUD Acceptance Criteria

## Scenario 1: Create Team — happy path

**Given** I am on `/admin/teams`
**When** I click "Create Team", fill valid name and description, and submit
**Then** a POST to `/Teams` is sent with `multipart/form-data`
**And** the team table refreshes with the new team
**And** if I opted to continue the workflow, the Role dialog opens

## Scenario 2: Create Team — validation failure

**Given** I submit the team form with a name shorter than 2 characters
**Then** an inline error "Name must be at least 2 characters" appears
**And** no API call is made

## Scenario 3: Edit Team — happy path

**Given** I click Edit on an existing team
**Then** the team dialog opens in `workflowMode: 'edit'` with current values pre-filled
**When** I update the name and submit
**Then** a PATCH to `/teams/:id` is sent
**And** the table row updates inline

## Scenario 4: Delete Team — confirmation

**Given** I click Delete on a team
**Then** a confirmation dialog appears listing the team name
**When** I confirm
**Then** a DELETE to `/teams/:id` is sent
**And** the team is removed from the table

## Scenario 5: Assign Employee — happy path

**Given** I open the Employee dialog with a valid team selected
**When** I search for an employee, select a role, and submit
**Then** a POST to `/teams/:id/employees` is sent with `employeeId`, `roleId`
**And** the team member count updates

## Scenario 6: Export team roster

**Given** I click "Export" on the team list
**Then** a GET to `/teams/export` is sent with current filter params
**And** a file download begins with a `.csv` or `.xlsx` extension
