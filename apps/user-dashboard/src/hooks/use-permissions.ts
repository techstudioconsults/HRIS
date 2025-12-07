"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { MODULE_PERMISSIONS, ROLES } from "../lib/auth-types";

export const usePermissions = () => {
  const { data: session, status } = useSession();

  const userRole = useMemo(() => session?.user?.employee?.role?.name || "", [session?.user?.employee?.role?.name]);
  const userPermissions = useMemo(() => session?.user?.permissions || [], [session?.user?.permissions]);

  const isAuthenticated = !!session;
  const isLoading = status === "loading";

  // Check if user has owner role and admin permission
  const isOwnerWithAdminPermission = useMemo(() => {
    return userRole === ROLES.OWNER && userPermissions.includes(MODULE_PERMISSIONS.ADMIN);
  }, [userRole, userPermissions]);

  // Check if user has specific permission
  const hasPermission = useMemo(() => {
    return (permission: string) => userPermissions.includes(permission);
  }, [userPermissions]);

  // Check if user has any of the required permissions
  const hasAnyPermission = useMemo(() => {
    return (permissions: string[]) => permissions.some((permission) => userPermissions.includes(permission));
  }, [userPermissions]);

  // Check if user has all required permissions
  const hasAllPermissions = useMemo(() => {
    return (permissions: string[]) => permissions.every((permission) => userPermissions.includes(permission));
  }, [userPermissions]);

  // Check if user has manage permission for a module
  const hasManagePermission = useMemo(() => {
    return (module: string) => {
      const managePermission = `${module}:manage`;
      return userPermissions.includes(managePermission);
    };
  }, [userPermissions]);

  // Check if user has specific CRUD permission for a module
  const hasModulePermission = useMemo(() => {
    return (module: string, action: "read" | "create" | "edit" | "delete" | "manage") => {
      const permission = `${module}:${action}`;
      return userPermissions.includes(permission);
    };
  }, [userPermissions]);

  // Get all permissions for a specific module
  const getModulePermissions = useMemo(() => {
    return (module: string) => {
      return userPermissions.filter((permission: string) => permission.startsWith(`${module}:`));
    };
  }, [userPermissions]);

  return {
    // User state
    isAuthenticated,
    isLoading,
    userRole,
    userPermissions,

    // Permission checks
    isOwnerWithAdminPermission,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasManagePermission,
    hasModulePermission,
    getModulePermissions,

    // Constants
    ROLES,
    MODULE_PERMISSIONS,
  };
};
