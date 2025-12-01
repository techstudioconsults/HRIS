# Role and Permission-Based Access Control (RBAC)

This HR application implements a comprehensive role and permission-based access control system that provides granular control over user access to different modules and features.

## Overview

The system uses a **claim-based access control** approach where:

- **Roles** define the user's position (e.g., "owner", "hr_manager", "welfare_officer")
- **Permissions** determine what actions a user can perform on specific modules
- **Admin routes** are restricted to users with "owner" role and "admin" permission
- **Module access** is controlled by specific permissions for each module

## Session Structure

The authentication session follows this structure:

```typescript
{
  "success": true,
  "data": {
    "employee": {
      "id": "3638e988-2ab6-4caf-af41-0a66a87d5367",
      "fullName": "Tobi Olanitori",
      "email": "tobi.olanitori@techstudioacademy.com",
      "role": {
        "id": "7162c85c-e982-453d-9444-f03babefa454",
        "name": "owner"
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "permissions": ["admin"]
  }
}
```

## Module Permissions

The system supports the following modules with granular permissions:

### Available Modules

- **Payroll** - `payroll:read`, `payroll:create`, `payroll:edit`, `payroll:delete`, `payroll:manage`
- **Leave Management** - `leave:read`, `leave:create`, `leave:edit`, `leave:delete`, `leave:manage`
- **Employee Records** - `employee:read`, `employee:create`, `employee:edit`, `employee:delete`, `employee:manage`
- **Attendance** - `attendance:read`, `attendance:create`, `attendance:edit`, `attendance:delete`, `attendance:manage`
- **Company Profile** - `company:read`, `company:create`, `company:edit`, `company:delete`, `company:manage`
- **Teams** - `teams:read`, `teams:create`, `teams:edit`, `teams:delete`, `teams:manage`

### Permission Levels

- **Read** - View data only
- **Create** - Add new records
- **Edit** - Modify existing records
- **Delete** - Remove records
- **Manage** - Full CRUD access (includes all above permissions)

### Special Permissions

- **Admin** - `admin` - Highest level access, required for admin routes

## Access Levels

### 1. Public Routes (`ACCESS_LEVELS.PUBLIC`)

- Accessible to everyone (authenticated and unauthenticated users)
- Examples: `/`, `/login`, `/register`, `/onboarding`

### 2. Authenticated Routes (`ACCESS_LEVELS.AUTHENTICATED`)

- Require user authentication but no specific permissions
- Examples: `/dashboard`, `/profile`

### 3. Owner-Only Routes (`ACCESS_LEVELS.OWNER_ONLY`)

- Only accessible to users with "owner" role AND "admin" permission
- Examples: `/admin/*` - All admin routes

### 4. Permission-Based Routes (`ACCESS_LEVELS.PERMISSION_BASED`)

- Require specific module permissions
- Examples: `/employees`, `/payroll`, `/leave`, `/attendance`, `/teams`, `/company`

## Implementation

### 1. Middleware Protection

The middleware automatically protects routes based on the route configuration:

```typescript
// src/lib/routes/routes.ts
import { ACCESS_LEVELS, MODULE_PERMISSIONS } from "@/lib/auth-types";

export const ROUTE_CONFIGS = [
  {
    path: "/admin",
    accessLevel: ACCESS_LEVELS.OWNER_ONLY,
    requiredPermissions: [MODULE_PERMISSIONS.ADMIN],
  },
  {
    path: "/employees",
    accessLevel: ACCESS_LEVELS.PERMISSION_BASED,
    requiredPermissions: [MODULE_PERMISSIONS.EMPLOYEE_READ, MODULE_PERMISSIONS.EMPLOYEE_MANAGE],
  },
];
```

### 2. Component-Level Protection

Use the `ComponentGuard` to protect individual components:

```typescript
import { ACCESS_LEVELS, MODULE_PERMISSIONS } from "@/lib/auth-types";
import { ComponentGuard } from "@/lib/routes/component-guard";

const ProtectedComponent = () => {
  return (
    <ComponentGuard
      accessLevel={ACCESS_LEVELS.OWNER_ONLY}
      requiredPermissions={[MODULE_PERMISSIONS.ADMIN]}
      fallback={<AccessDenied />}
    >
      <AdminDashboard />
    </ComponentGuard>
  );
};
```

### 3. Hook-Based Permission Checking

Use the `usePermissions` hook for conditional rendering:

```typescript
import { usePermissions } from "@/hooks/use-permissions";

const MyComponent = () => {
  const {
    hasPermission,
    hasModulePermission,
    isOwnerWithAdminPermission
  } = usePermissions();

  return (
    <div>
      {hasModulePermission('employee', 'create') && (
        <button>Add Employee</button>
      )}

      {isOwnerWithAdminPermission && (
        <AdminPanel />
      )}
    </div>
  );
};
```

### 4. Higher-Order Component

Use the `withAuth` HOC for component protection:

```typescript
import { withAuth } from "@/lib/routes/component-guard";
import { ACCESS_LEVELS, MODULE_PERMISSIONS } from "@/types/auth";

const AdminComponent = () => <div>Admin Content</div>;

export default withAuth(
  AdminComponent,
  ACCESS_LEVELS.OWNER_ONLY,
  [MODULE_PERMISSIONS.ADMIN]
);
```

## Route Configuration

### Adding New Routes

1. **Public Route:**

```typescript
{
  path: "/about",
  accessLevel: ACCESS_LEVELS.PUBLIC,
}
```

2. **Authenticated Route:**

```typescript
{
  path: "/dashboard",
  accessLevel: ACCESS_LEVELS.AUTHENTICATED,
}
```

3. **Owner-Only Route:**

```typescript
{
  path: "/admin/settings",
  accessLevel: ACCESS_LEVELS.OWNER_ONLY,
  requiredPermissions: [MODULE_PERMISSIONS.ADMIN],
}
```

4. **Permission-Based Route:**

```typescript
{
  path: "/payroll/reports",
  accessLevel: ACCESS_LEVELS.PERMISSION_BASED,
  requiredPermissions: [
    MODULE_PERMISSIONS.PAYROLL_READ,
    MODULE_PERMISSIONS.PAYROLL_MANAGE,
  ],
}
```

## Security Features

### 1. Automatic Redirects

- Unauthenticated users are redirected to `/login`
- Users without required permissions are redirected to `/login`
- Admin route access is strictly controlled

### 2. Token-Based Authentication

- JWT tokens for secure authentication
- Automatic token refresh
- Secure session management

### 3. Permission Validation

- Server-side permission checking in middleware
- Client-side permission checking in components
- Granular module-level access control

## Best Practices

1. **Always use middleware protection** for route-level security
2. **Use ComponentGuard** for sensitive components
3. **Implement permission checks** in components that show/hide features
4. **Test permission scenarios** thoroughly
5. **Keep permissions granular** for better security control
6. **Use the `usePermissions` hook** for conditional rendering

## Troubleshooting

### Common Issues

1. **Access Denied on Admin Routes**

   - Ensure user has "owner" role
   - Ensure user has "admin" permission
   - Check session data structure

2. **Permission Not Working**

   - Verify permission string format (e.g., "module:action")
   - Check if permission is included in user's permissions array
   - Ensure route is properly configured

3. **Middleware Not Working**
   - Check route configuration in `routes.ts`
   - Verify access level and required permissions
   - Ensure middleware is properly configured in `next.config.ts`

### Debug Tips

1. **Check Session Data:**

```typescript
const { data: session } = useSession();
console.log("Session:", session);
```

2. **Check User Permissions:**

```typescript
const { userPermissions } = usePermissions();
console.log("Permissions:", userPermissions);
```

3. **Test Permission Checks:**

```typescript
const { hasPermission } = usePermissions();
console.log("Has admin:", hasPermission("admin"));
```
