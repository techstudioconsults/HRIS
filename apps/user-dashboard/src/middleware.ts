// middleware.ts
import { getRouteConfig } from "@/lib/routes/routes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import { ACCESS_LEVELS, MODULE_PERMISSIONS, PermissionCheckResult, ROLES } from "./lib/auth-types";

// Check if user has required permissions
const checkPermissions = (userPermissions: string[], requiredPermissions: string[]): PermissionCheckResult => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return { hasAccess: true };
  }

  const missingPermissions = requiredPermissions.filter((permission) => !userPermissions.includes(permission));

  if (missingPermissions.length > 0) {
    return {
      hasAccess: false,
      missingPermissions,
      reason: `Missing required permissions: ${missingPermissions.join(", ")}`,
    };
  }

  return { hasAccess: true };
};

// Check if user has owner role and admin permission
const isOwnerWithAdminPermission = (userRole: string, userPermissions: string[]): boolean => {
  return userRole === ROLES.OWNER && userPermissions.includes(MODULE_PERMISSIONS.ADMIN);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  // No locale segment handling — application no longer uses per-path locales
  const pathWithoutLocale = pathname;

  // Get user token to check authentication and role
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const isAuthenticated = !!token;

  // Extract user data from token
  const userRole = (token?.employee as { role?: { name?: string } })?.role?.name || "";
  const userPermissions = (token?.permissions as string[]) || [];

  // Get route configuration
  const routeConfig = getRouteConfig(pathWithoutLocale);

  // If no route config found, allow access (fallback)
  if (!routeConfig) {
    return NextResponse.next();
  }

  // Handle different access levels
  switch (routeConfig.accessLevel) {
    case ACCESS_LEVELS.PUBLIC: {
      // Public routes - accessible to everyone
      return NextResponse.next();
    }

    case ACCESS_LEVELS.AUTHENTICATED: {
      // Authenticated routes - require login but no specific permissions
      if (!isAuthenticated) {
        const loginUrl = new URL(`/login`, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        // Preserve original query parameters
        if (request.nextUrl.search) {
          loginUrl.search += (loginUrl.search ? "&" : "?") + request.nextUrl.search.slice(1);
        }
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    case ACCESS_LEVELS.OWNER_ONLY: {
      // Owner-only routes - only accessible to owner role with admin permission
      if (!isAuthenticated) {
        const loginUrl = new URL(`/login`, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        // Preserve original query parameters
        if (request.nextUrl.search) {
          loginUrl.search += (loginUrl.search ? "&" : "?") + request.nextUrl.search.slice(1);
        }
        return NextResponse.redirect(loginUrl);
      }

      if (!isOwnerWithAdminPermission(userRole, userPermissions)) {
        // Redirect to login page if not owner with admin permission
        const loginUrl = new URL(`/login`, request.url);
        // Preserve original query parameters
        if (request.nextUrl.search) {
          loginUrl.search += (loginUrl.search ? "&" : "?") + request.nextUrl.search.slice(1);
        }
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.next();
    }

    case ACCESS_LEVELS.PERMISSION_BASED: {
      // Permission-based routes - require specific module permissions
      if (!isAuthenticated) {
        const loginUrl = new URL(`/login`, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        // Preserve original query parameters
        if (request.nextUrl.search) {
          loginUrl.search += (loginUrl.search ? "&" : "?") + request.nextUrl.search.slice(1);
        }
        return NextResponse.redirect(loginUrl);
      }

      // Check if user has required permissions
      const permissionCheck = checkPermissions(
        userPermissions,
        (routeConfig.requiredPermissions as unknown as string[]) || [],
      );

      if (!permissionCheck.hasAccess) {
        // Redirect to login page if missing required permissions
        const loginUrl = new URL(`/login`, request.url);
        // Preserve original query parameters
        if (request.nextUrl.search) {
          loginUrl.search += (loginUrl.search ? "&" : "?") + request.nextUrl.search.slice(1);
        }
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.next();
    }

    default: {
      // Unknown access level - redirect to login
      const loginUrl = new URL(`/login`, request.url);
      // Preserve original query parameters
      if (request.nextUrl.search) {
        loginUrl.search += (loginUrl.search ? "&" : "?") + request.nextUrl.search.slice(1);
      }
      return NextResponse.redirect(loginUrl);
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next|static|images|favicon.ico|public|mockServiceWorker).*)",
  ],
};
