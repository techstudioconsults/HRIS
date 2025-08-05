import { ACCESS_LEVELS, MODULE_PERMISSIONS } from "../auth-types";

// Define route patterns with access control
export const ROUTE_CONFIGS = [
  // Public routes - accessible to everyone
  {
    path: "/",
    accessLevel: ACCESS_LEVELS.PUBLIC,
  },
  {
    path: "/pricing",
    accessLevel: ACCESS_LEVELS.PUBLIC,
  },
  {
    path: "/terms-and-conditions",
    accessLevel: ACCESS_LEVELS.PUBLIC,
  },
  {
    path: "/privacy-policy",
    accessLevel: ACCESS_LEVELS.PUBLIC,
  },
  {
    path: "/about",
    accessLevel: ACCESS_LEVELS.PUBLIC,
  },
  {
    path: "/contact",
    accessLevel: ACCESS_LEVELS.PUBLIC,
  },
  {
    path: "/login",
    accessLevel: ACCESS_LEVELS.PUBLIC,
  },
  {
    path: "/register",
    accessLevel: ACCESS_LEVELS.PUBLIC,
  },
  {
    path: "/forgot-password",
    accessLevel: ACCESS_LEVELS.PUBLIC,
  },
  {
    path: "/reset-password",
    accessLevel: ACCESS_LEVELS.PUBLIC,
  },
  {
    path: "/onboarding",
    accessLevel: ACCESS_LEVELS.PUBLIC,
  },

  // Authenticated routes - require login but no specific permissions
  {
    path: "/dashboard",
    accessLevel: ACCESS_LEVELS.AUTHENTICATED,
  },
  {
    path: "/profile",
    accessLevel: ACCESS_LEVELS.AUTHENTICATED,
  },

  // Owner-only routes - only accessible to owner role with admin permission
  {
    path: "/admin",
    accessLevel: ACCESS_LEVELS.OWNER_ONLY,
    requiredPermissions: [MODULE_PERMISSIONS.ADMIN],
  },

  // Permission-based routes - require specific module permissions
  {
    path: "/employees",
    accessLevel: ACCESS_LEVELS.PERMISSION_BASED,
    requiredPermissions: [MODULE_PERMISSIONS.EMPLOYEE_READ, MODULE_PERMISSIONS.EMPLOYEE_MANAGE],
  },
  {
    path: "/payroll",
    accessLevel: ACCESS_LEVELS.PERMISSION_BASED,
    requiredPermissions: [MODULE_PERMISSIONS.PAYROLL_READ, MODULE_PERMISSIONS.PAYROLL_MANAGE],
  },
  {
    path: "/leave",
    accessLevel: ACCESS_LEVELS.PERMISSION_BASED,
    requiredPermissions: [MODULE_PERMISSIONS.LEAVE_READ, MODULE_PERMISSIONS.LEAVE_MANAGE],
  },
  {
    path: "/attendance",
    accessLevel: ACCESS_LEVELS.PERMISSION_BASED,
    requiredPermissions: [MODULE_PERMISSIONS.ATTENDANCE_READ, MODULE_PERMISSIONS.ATTENDANCE_MANAGE],
  },
  {
    path: "/teams",
    accessLevel: ACCESS_LEVELS.PERMISSION_BASED,
    requiredPermissions: [MODULE_PERMISSIONS.TEAMS_READ, MODULE_PERMISSIONS.TEAMS_MANAGE],
  },
  {
    path: "/company",
    accessLevel: ACCESS_LEVELS.PERMISSION_BASED,
    requiredPermissions: [MODULE_PERMISSIONS.COMPANY_READ, MODULE_PERMISSIONS.COMPANY_MANAGE],
  },
] as const;

// Helper function to get route config by path
export const getRouteConfig = (path: string) => {
  return ROUTE_CONFIGS.find((config) => {
    if (config.path.endsWith("*")) {
      const basePath = config.path.slice(0, -1);
      return path.startsWith(basePath);
    }
    return path === config.path || path.startsWith(config.path + "/");
  });
};

// Legacy route arrays for backward compatibility
export const PUBLIC_ROUTES = ROUTE_CONFIGS.filter((config) => config.accessLevel === ACCESS_LEVELS.PUBLIC).map(
  (config) => config.path,
);

export const ADMIN_ROUTES = ROUTE_CONFIGS.filter((config) => config.accessLevel === ACCESS_LEVELS.OWNER_ONLY).map(
  (config) => config.path,
);

export const AUTHENTICATED_ROUTES = ROUTE_CONFIGS.filter(
  (config) => config.accessLevel === ACCESS_LEVELS.AUTHENTICATED,
).map((config) => config.path);

export const PERMISSION_BASED_ROUTES = ROUTE_CONFIGS.filter(
  (config) => config.accessLevel === ACCESS_LEVELS.PERMISSION_BASED,
).map((config) => config.path);
