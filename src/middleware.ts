// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import { ADMIN_ROUTES, PUBLIC_ROUTES, SUPER_ADMIN_ROUTES, VENDOR_ROUTES } from "./lib/routes/routes";

// Helper function to check if path matches any route pattern
const matchesRoute = (path: string, routePatterns: string[]): boolean => {
  return routePatterns.some((pattern) => {
    if (pattern.endsWith("*")) {
      const basePattern = pattern.slice(0, -1);
      return path.startsWith(basePattern);
    }
    return path === pattern || path.startsWith(pattern + "/");
  });
};

// Supported locales
const SUPPORTED_LOCALES = ["en", "fr", "es", "ar"];

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

  // Extract locale from pathname
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If no locale in pathname, redirect to default locale (en)
  if (!pathnameHasLocale) {
    const locale = "en";
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  // Extract locale and path without locale
  const segments = pathname.split("/");
  const locale = segments[1];
  const pathWithoutLocale = `/${segments.slice(2).join("/")}`;

  // Check if locale is supported
  if (!SUPPORTED_LOCALES.includes(locale)) {
    return NextResponse.redirect(new URL(`/en${pathWithoutLocale}`, request.url));
  }

  // Get user token to check authentication and role
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // Handle role as object or string
  const userRole =
    typeof token?.role === "object" && (token?.role as { id: string })?.id
      ? (token?.role as { id: string }).id
      : (token?.role as string) || "customer";

  // Define protected routes (from the first middleware)
  const protectedRoutes = ["/onboarding", "/admin"];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathWithoutLocale.startsWith(route));

  // Handle protected routes for unauthenticated users
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user is trying to access a protected route
  const isVendorRoute = matchesRoute(pathWithoutLocale, VENDOR_ROUTES);
  const isAdminRoute = matchesRoute(pathWithoutLocale, ADMIN_ROUTES);
  const isSuperAdminRoute = matchesRoute(pathWithoutLocale, SUPER_ADMIN_ROUTES);
  const isPublicRoute = matchesRoute(pathWithoutLocale, PUBLIC_ROUTES);

  // Role-based access control
  if (isAuthenticated) {
    // Authenticated users - check role-based access
    switch (userRole) {
      case "customer": {
        // Customers can only access public routes
        if (isVendorRoute || isAdminRoute || isSuperAdminRoute) {
          const url = new URL(request.url);
          url.pathname = `/${locale}/shop`;
          return NextResponse.redirect(url);
        }
        break;
      }

      case "vendor": {
        // Vendors can access public routes and vendor routes
        if (isAdminRoute || isSuperAdminRoute) {
          const url = new URL(request.url);
          url.pathname = `/${locale}/dashboard/home`;
          return NextResponse.redirect(url);
        }
        break;
      }

      case "admin": {
        // Admins can access public routes, vendor routes, and admin routes
        if (isSuperAdminRoute) {
          const url = new URL(request.url);
          url.pathname = `/${locale}/admin/home`;
          return NextResponse.redirect(url);
        }
        break;
      }

      case "super-admin": {
        // Super admins can access all routes
        break;
      }

      default: {
        // Unknown role - redirect to login with current locale
        const url = new URL(request.url);
        url.pathname = `/${locale}/login`;
        return NextResponse.redirect(url);
      }
    }
  } else {
    // Unauthenticated users can only access public routes
    if (!isPublicRoute) {
      const url = new URL(request.url);
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }
  }

  // Continue with the request
  return NextResponse.next();
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
     * - login page (to avoid redirect loops)
     */
    "/((?!api|_next|static|images|favicon.ico|public|mockServiceWorker|login).*)",
  ],
};
