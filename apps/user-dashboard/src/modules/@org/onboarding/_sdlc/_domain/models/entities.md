---
section: domain
topic: entities
---

# Onboarding — Domain Entities

## CompanyProfile

```typescript
interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  size: string; // e.g. "1-10", "11-50", "51-200", "201-500", "500+"
  domain: string;
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

## Team

```typescript
interface TeamApiResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Team {
  id: string;
  name: string;
  roles: Role[]; // Enriched client-side by combining TeamApiResponse + roles fetch
}
```

## Role

```typescript
interface RoleApiResponse {
  id: string;
  name: string;
  teamId: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: string;
  name: string;
  teamId: string;
  permissions: string[];
}
```

## Employee (Onboarding Payload)

```typescript
interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string; // Initial password set by owner; optional if email invite used
  teamId: string;
  roleId: string;
  permissions?: unknown[];
}

interface OnboardEmployeesPayload {
  employees: Employee[];
}
```

## OnboardingSetupStatus

Tracks the owner's onboarding checklist items post-login.

```typescript
interface OnboardingSetupStatus {
  resetPassword?: boolean; // Has the employee reset their initial password?
  reviewProfileDetails?: boolean; // Has the employee reviewed their profile?
  acknowledgePolicy?: boolean; // Has the employee acknowledged the HR policy?
  reviewPayrollInfo?: boolean; // Has the employee reviewed payroll info?
  takenTour?: boolean; // Has the employee completed or dismissed the Driver.js tour?
}
```
