# Route Guards

This directory contains route guard components for protecting routes based on authentication and user roles. The implementation uses a multi-layered approach:

1. **Middleware** (Primary protection) - Handles redirects server-side before the page loads
2. **Server Route Guards** - Additional server-side protection for server components
3. **Client Route Guards** - Client-side protection for client components (minimal redirects)

## Architecture

### 1. Middleware (Primary Protection)

The `src/middleware.ts` file handles all route protection at the server level before pages are rendered. This prevents the flash of content and provides the best user experience.

### 2. Server Route Guards

Use these in **Server Components** for additional protection:

```tsx
// In a server component
import { ServerAdminGuard } from "@/lib/routes/server-route-guard";

export default async function AdminPage() {
  return (
    <ServerAdminGuard>
      <div>Admin-only content</div>
    </ServerAdminGuard>
  );
}
```

### 3. Client Route Guards

Use these in **Client Components** for loading states and final checks:

```tsx
// In a client component
"use client";

import { AdminGuard } from "@/lib/routes/route-guard";

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div>Admin dashboard content</div>
    </AdminGuard>
  );
}
```

## Usage Examples

### Server Components (Recommended)

```tsx
// app/admin/page.tsx
import { ServerAdminGuard } from "@/lib/routes/server-route-guard";

export default async function AdminPage() {
  return (
    <ServerAdminGuard>
      <div>Admin content here</div>
    </ServerAdminGuard>
  );
}
```

### Client Components

```tsx
// components/AdminDashboard.tsx
"use client";

import { AdminGuard } from "@/lib/routes/route-guard";

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div>Admin dashboard</div>
    </AdminGuard>
  );
}
```

### Mixed Approach (Best Practice)

```tsx
// app/admin/page.tsx (Server Component)
import { ServerAdminGuard } from "@/lib/routes/server-route-guard";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  return (
    <ServerAdminGuard>
      <AdminDashboard />
    </ServerAdminGuard>
  );
}

// components/AdminDashboard.tsx (Client Component)
("use client");
import { AdminGuard } from "@/lib/routes/route-guard";

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div>Admin dashboard with client-side features</div>
    </AdminGuard>
  );
}
```

## Available Guards

### Server Guards

- `ServerRouteGuard` - Generic server guard
- `ServerSuperAdminGuard` - Super admin only
- `ServerAdminGuard` - Admin and super admin
- `ServerVendorGuard` - Vendor only
- `ServerCustomerGuard` - Customer only
- `ServerAuthenticatedGuard` - Any authenticated user

### Client Guards

- `RouteGuard` - Generic client guard
- `SuperAdminGuard` - Super admin only
- `AdminGuard` - Admin and super admin
- `VendorGuard` - Vendor only
- `CustomerGuard` - Customer only
- `AuthenticatedGuard` - Any authenticated user

## Benefits of This Approach

1. **No Flash of Content** - Middleware handles redirects before page load
2. **Server-Side Security** - Server guards provide additional protection
3. **Client-Side UX** - Client guards handle loading states smoothly
4. **Flexible** - Can be used in both server and client components
5. **Backward Compatible** - Existing code continues to work

## Migration Guide

If you're migrating from the old client-side only approach:

1. **Replace client guards in server components** with server guards
2. **Keep client guards in client components** for loading states
3. **Remove manual redirects** - middleware handles them
4. **Test thoroughly** - ensure all routes are properly protected

## Best Practices

1. **Use server guards in server components** for better performance
2. **Use client guards in client components** for smooth UX
3. **Rely on middleware** as the primary protection layer
4. **Test edge cases** like expired sessions and role changes
5. **Monitor redirects** to ensure they're working as expected
