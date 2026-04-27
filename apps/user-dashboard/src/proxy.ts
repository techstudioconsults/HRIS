import { getRouteConfig } from '@/lib/routes/routes';
import { getDashboardRoute } from '@/lib/routes/redirect-helpers';
import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_LEVELS,
  MODULE_PERMISSIONS,
  type PermissionCheckResult,
  ROLES,
} from '@/lib/auth-types';
import { COOKIE_SESSION_META } from '@/lib/session/cookie-names';
import { verifyMeta } from '@/lib/session/session-manager';

const AUTH_BLOCKED_FOR_AUTHENTICATED_PREFIXES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/onboarding',
] as const;

const isBlockedAuthPageForAuthenticatedUser = (path: string): boolean =>
  AUTH_BLOCKED_FOR_AUTHENTICATED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );

const checkPermissions = (
  userPermissions: string[],
  requiredPermissions: string[]
): PermissionCheckResult => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return { hasAccess: true };
  }
  const missingPermissions = requiredPermissions.filter(
    (p) => !userPermissions.includes(p)
  );
  if (missingPermissions.length > 0) {
    return {
      hasAccess: false,
      missingPermissions,
      reason: `Missing required permissions: ${missingPermissions.join(', ')}`,
    };
  }
  return { hasAccess: true };
};

const isOwnerWithAdminPermission = (
  userRole: string,
  userPermissions: string[]
): boolean =>
  userRole === ROLES.OWNER &&
  userPermissions.includes(MODULE_PERMISSIONS.ADMIN);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET ?? '';
  const metaCookie = request.cookies.get(COOKIE_SESSION_META)?.value;
  const session = metaCookie ? await verifyMeta(metaCookie, secret) : null;

  const isAuthenticated = !!session;
  const userRole = session?.role?.name ?? '';
  const userPermissions = session?.permissions ?? [];

  if (isAuthenticated && isBlockedAuthPageForAuthenticatedUser(pathname)) {
    return NextResponse.redirect(
      new URL(getDashboardRoute(userPermissions), request.url)
    );
  }

  const routeConfig = getRouteConfig(pathname);
  if (!routeConfig) return NextResponse.next();

  const isAdminUser = userPermissions.includes(MODULE_PERMISSIONS.ADMIN);

  if (isAuthenticated && isAdminUser && pathname.startsWith('/user')) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (isAuthenticated && !isAdminUser && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  switch (routeConfig.accessLevel) {
    case ACCESS_LEVELS.PUBLIC:
      return NextResponse.next();

    case ACCESS_LEVELS.AUTHENTICATED: {
      if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        if (request.nextUrl.search) {
          loginUrl.search +=
            (loginUrl.search ? '&' : '?') + request.nextUrl.search.slice(1);
        }
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    case ACCESS_LEVELS.OWNER_ONLY: {
      if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (!isOwnerWithAdminPermission(userRole, userPermissions)) {
        return NextResponse.redirect(
          new URL(getDashboardRoute(userPermissions), request.url)
        );
      }
      return NextResponse.next();
    }

    case ACCESS_LEVELS.PERMISSION_BASED: {
      if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
      const permissionCheck = checkPermissions(
        userPermissions,
        (routeConfig.requiredPermissions as unknown as string[]) ?? []
      );
      if (!permissionCheck.hasAccess) {
        return NextResponse.redirect(
          new URL(getDashboardRoute(userPermissions), request.url)
        );
      }
      return NextResponse.next();
    }

    default: {
      const loginUrl = new URL('/login', request.url);
      if (request.nextUrl.search) {
        loginUrl.search +=
          (loginUrl.search ? '&' : '?') + request.nextUrl.search.slice(1);
      }
      return NextResponse.redirect(loginUrl);
    }
  }
}

export const config = {
  matcher: [
    '/((?!api|_next|static|images|favicon.ico|public|mockServiceWorker).*)',
  ],
};
