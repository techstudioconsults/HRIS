"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo } from "react";

import { ACCESS_LEVELS, MODULE_PERMISSIONS, ROLES } from "../auth-types";

interface ComponentGuardProperties {
  children: ReactNode;
  accessLevel: (typeof ACCESS_LEVELS)[keyof typeof ACCESS_LEVELS];
  requiredPermissions?: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

// Check if user has required permissions
const checkPermissions = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  return requiredPermissions.every((permission) => userPermissions.includes(permission));
};

// Check if user has owner role and admin permission
const isOwnerWithAdminPermission = (userRole: string, userPermissions: string[]): boolean => {
  return userRole === ROLES.OWNER && userPermissions.includes(MODULE_PERMISSIONS.ADMIN);
};

export const ComponentGuard = ({
  children,
  accessLevel,
  requiredPermissions = [],
  fallback = null,
  redirectTo = "/login",
}: ComponentGuardProperties) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = !!session;
  const userRole = session?.user?.employee?.role?.name || "";
  const userPermissions = useMemo(() => session?.user?.permissions || [], [session?.user?.permissions]);

  useEffect(() => {
    if (status === "loading") return;

    switch (accessLevel) {
      case ACCESS_LEVELS.PUBLIC: {
        // Public routes - accessible to everyone
        return;
      }

      case ACCESS_LEVELS.AUTHENTICATED: {
        // Authenticated routes - require login but no specific permissions
        if (!isAuthenticated) {
          router.push(redirectTo);
        }
        return;
      }

      case ACCESS_LEVELS.OWNER_ONLY: {
        // Owner-only routes - only accessible to owner role with admin permission
        if (!isAuthenticated) {
          router.push(redirectTo);
          return;
        }

        if (!isOwnerWithAdminPermission(userRole, userPermissions)) {
          router.push(redirectTo);
          return;
        }
        return;
      }

      case ACCESS_LEVELS.PERMISSION_BASED: {
        // Permission-based routes - require specific module permissions
        if (!isAuthenticated) {
          router.push(redirectTo);
          return;
        }

        if (!checkPermissions(userPermissions, requiredPermissions)) {
          router.push(redirectTo);
          return;
        }
        return;
      }

      default: {
        // Unknown access level - redirect to login
        router.push(redirectTo);
        return;
      }
    }
  }, [status, isAuthenticated, userRole, userPermissions, accessLevel, requiredPermissions, router, redirectTo]);

  // Show fallback while loading or if access is denied
  if (status === "loading") {
    return fallback;
  }

  // Check access based on level
  switch (accessLevel) {
    case ACCESS_LEVELS.PUBLIC: {
      return <>{children}</>;
    }

    case ACCESS_LEVELS.AUTHENTICATED: {
      if (!isAuthenticated) {
        return fallback;
      }
      return <>{children}</>;
    }

    case ACCESS_LEVELS.OWNER_ONLY: {
      if (!isAuthenticated || !isOwnerWithAdminPermission(userRole, userPermissions)) {
        return fallback;
      }
      return <>{children}</>;
    }

    case ACCESS_LEVELS.PERMISSION_BASED: {
      if (!isAuthenticated || !checkPermissions(userPermissions, requiredPermissions)) {
        return fallback;
      }
      return <>{children}</>;
    }

    default: {
      return fallback;
    }
  }
};

// Higher-order component for protecting components
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  accessLevel: (typeof ACCESS_LEVELS)[keyof typeof ACCESS_LEVELS],
  requiredPermissions?: string[],
) => {
  return function AuthenticatedComponent(properties: P) {
    return (
      <ComponentGuard accessLevel={accessLevel} requiredPermissions={requiredPermissions}>
        <Component {...properties} />
      </ComponentGuard>
    );
  };
};
