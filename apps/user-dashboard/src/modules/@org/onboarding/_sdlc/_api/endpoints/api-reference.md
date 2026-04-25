---
section: api
topic: endpoints
---

# Onboarding — API Reference

All endpoints require `Authorization: Bearer <accessToken>`. Company-scoping is enforced by the backend via JWT.

Base: `/api/v1` (inferred from HttpAdapter configuration)

---

## PATCH /companies/current

Update the authenticated company's profile (Step 1).

**Request Body**

```json
{
  "name": "Acme Corp",
  "industry": "Technology",
  "size": "11-50",
  "address": {
    "addressLine1": "1 Innovation Drive",
    "addressLine2": "",
    "city": "Lagos",
    "state": "Lagos State",
    "country": "Nigeria",
    "postcode": "100001"
  }
}
```

**Response 200** — returns updated `CompanyProfile`

---

## GET /teams

List all teams for the authenticated company (with or without roles, depending on backend).

**Response 200**

```json
{ "status": "success", "data": [{ "id": "team_01", "name": "Engineering", ... }] }
```

---

## POST /teams

Create a new team.

**Request Body** — `{ "name": "Engineering" }`

**Response 201** — returns `TeamApiResponse`

---

## PATCH /teams/:teamId

Update a team's name.

**Request Body** — `{ "name": "Updated Name" }`

**Response 200** — returns updated `TeamApiResponse`

---

## DELETE /teams/:teamId

Delete a team. Fails with 409 if the team has active employees.

**Response 204** — no body

---

## GET /roles/:teamId

List all roles for a given team.

**Response 200**

```json
{
  "status": "success",
  "data": [
    {
      "id": "role_01",
      "name": "Engineer",
      "teamId": "team_01",
      "permissions": ["leave:read"]
    }
  ]
}
```

---

## POST /roles

Create a role for a team.

**Request Body** — `{ "name": "Engineer", "teamId": "team_01", "permissions": ["leave:read", "payroll:read"] }`

**Response 201** — returns `RoleApiResponse`

---

## PATCH /roles/:roleId

Update a role's name or permissions.

**Response 200** — returns updated `RoleApiResponse`

---

## DELETE /roles/:roleId

Delete a role.

**Response 204** — no body

---

## POST /employees/onboard

Batch invite employees.

**Request Body**

```json
{
  "employees": [
    {
      "firstName": "Bola",
      "lastName": "Adeyemi",
      "email": "bola@acme.com",
      "phoneNumber": "+2348012345678",
      "password": "TempPass123!",
      "teamId": "team_01",
      "roleId": "role_01"
    }
  ]
}
```

**Response 201** — `{ "status": "success", "data": { "invited": 1 } }`

---

## GET /employees/:employeeId/setup

Get the setup status for an employee.

**Response 200** — returns `OnboardingSetupStatus`

---

## PATCH /employees/:employeeId/setup

Update the setup status.

**Request Body** — `{ "takenTour": true }`

**Response 200** — returns updated `OnboardingSetupStatus`
