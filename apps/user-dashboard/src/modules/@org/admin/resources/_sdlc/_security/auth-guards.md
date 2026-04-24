# Resources Module — Auth Guards

_Documents the authentication and authorisation guard layers protecting the Resources module._

## Route Guard

The Resources module pages (`/admin/resources`, `/admin/resources/*`) are protected by the global middleware route guard in `apps/user-dashboard/src/middleware.ts`. Unauthenticated requests are redirected to `/login`.

## Page-Level Guard

`ResourcesView` is a Server Component that reads the server-side session. If the session is absent or expired, it calls `redirect('/login?returnTo=/admin/resources')` before rendering.

## Component-Level Guards

Read-only mode is applied when the user lacks `admin:resources:write`:

```tsx
const { hasPermission } = useAuth();
const canWrite = hasPermission('admin:resources:write');

// "New Folder" and "Upload" buttons hidden when canWrite is false
{
  canWrite && <NewFolderButton />;
}
{
  canWrite && <UploadButton />;
}
```

Action menu items on `FolderCard` and `FileCard` are conditionally rendered the same way.

## API Guard

Every API request from the module includes `Authorization: Bearer <JWT>`. The `HttpAdapter` reads the token from the auth context and injects it automatically. A `401` response anywhere in the module triggers the global session-expiry handler.

## Guard Bypass Prevention

- Permission checks on the frontend are UX-only and must never be relied on for security.
- The backend re-validates `organisationId`, user permissions, and resource ownership on every request.
- JWT signature verification is the responsibility of the backend auth middleware.
