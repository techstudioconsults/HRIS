"use client";

import Loading from "@/app/Loading";
import { useSession } from "next-auth/react";
import { ReactNode, useCallback, useEffect, useState } from "react";

interface ComponentGuardProperties {
  children: ReactNode;
  // Authentication requirements
  requireAuth?: boolean;
  allowedRoles?: string[];
  // Custom conditions
  customCondition?: () => boolean | Promise<boolean>;
  // Fallback content
  fallback?: ReactNode;
  // Loading states
  showLoading?: boolean;
  loadingText?: string;
  // Error handling
  onUnauthorized?: () => void;
  onError?: (error: Error) => void;
}

export const ComponentGuard = ({
  children,
  requireAuth = false,
  allowedRoles = [],
  customCondition,
  fallback = null,
  showLoading = true,
  loadingText = "Loading...",
  onUnauthorized,
  onError,
}: ComponentGuardProperties) => {
  const { data: session, status } = useSession();
  const [isCustomConditionMet, setIsCustomConditionMet] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check custom condition if provided
  useEffect(() => {
    if (customCondition) {
      setIsLoading(true);
      const checkCondition = async () => {
        try {
          const result = await customCondition();
          setIsCustomConditionMet(result);
        } catch (error) {
          onError?.(error as Error);
          setIsCustomConditionMet(false);
        } finally {
          setIsLoading(false);
        }
      };

      checkCondition();
    }
  }, [customCondition, onError]);

  // Check authentication requirements
  const isAuthenticated = status === "authenticated";
  const isAuthLoading = status === "loading";

  // Check role requirements
  const hasRequiredRole =
    allowedRoles.length === 0 ||
    (isAuthenticated && allowedRoles.includes(session?.user?.role?.name.toUpperCase() || ""));

  // Determine if component should be rendered
  const shouldRender = useCallback(() => {
    // If custom condition is provided, it takes precedence
    if (customCondition !== undefined) {
      return isCustomConditionMet === true;
    }

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      return false;
    }

    // Check role requirement
    if (requireAuth && !hasRequiredRole) {
      return false;
    }

    return true;
  }, [isAuthenticated, hasRequiredRole, isCustomConditionMet, requireAuth, customCondition]);

  // Handle unauthorized access
  useEffect(() => {
    if (!shouldRender() && onUnauthorized) {
      onUnauthorized();
    }
  }, [isAuthenticated, hasRequiredRole, isCustomConditionMet, onUnauthorized, shouldRender]);

  // Show loading states
  if (isAuthLoading || (customCondition && isLoading) || (customCondition && isCustomConditionMet === null)) {
    return showLoading ? <Loading text={loadingText} /> : null;
  }

  // Render component if all conditions are met
  if (shouldRender()) {
    return <>{children}</>;
  }

  // Render fallback if conditions are not met
  return <>{fallback}</>;
};

// Higher-order component version for easier usage
export const withComponentGuard = <T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  guardProperties: Omit<ComponentGuardProperties, "children">,
) => {
  const GuardedComponent = (properties: T) => (
    <ComponentGuard {...guardProperties}>
      <Component {...properties} />
    </ComponentGuard>
  );

  GuardedComponent.displayName = `withComponentGuard(${Component.displayName || Component.name})`;

  return GuardedComponent;
};

// Specialized guards for common use cases
export const withAuth = <T extends Record<string, unknown>>(Component: React.ComponentType<T>, roles?: string[]) => {
  return withComponentGuard(Component, {
    requireAuth: true,
    allowedRoles: roles || [],
  });
};

export const withRole = <T extends Record<string, unknown>>(Component: React.ComponentType<T>, roles: string[]) => {
  return withComponentGuard(Component, {
    requireAuth: true,
    allowedRoles: roles,
  });
};

export const withCondition = <T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  condition: () => boolean | Promise<boolean>,
) => {
  return withComponentGuard(Component, {
    customCondition: condition,
  });
};

// Utility function to check if user has specific role
export const hasRole = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

// Utility function to check if user has any of the required roles
export const hasAnyRole = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};
