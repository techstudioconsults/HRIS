// middleware.ts
import { auth } from "@/modules/@org/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const { nextUrl } = request;
  const isLoggedIn = !!request.auth;

  // Define protected routes
  const protectedRoutes = ["/onboarding", "/admin"];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));

  // Redirect logic
  if (isProtectedRoute && !isLoggedIn) {
    // Get absolute URL for /login
    const loginUrl = new URL("/login", nextUrl.origin);
    // Add redirect parameter to return to current page after login
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/trpc routes
     * - static files (._next/static)
     * - public folder
     * - auth callbacks
     * - login page
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
