import { MODULE_PERMISSIONS } from '../auth-types';

/**
 * Determines the appropriate dashboard route based on user permissions
 * @param permissions - Array of user permissions
 * @returns The dashboard route path
 */
export const getDashboardRoute = (permissions: string[] = []): string => {
  const isAdmin = permissions.includes(MODULE_PERMISSIONS.ADMIN);

  if (isAdmin) {
    return '/admin/dashboard';
  }

  return '/user/dashboard';
};

/**
 * Checks if a user is an admin
 * @param permissions - Array of user permissions
 * @returns true if user has admin permission
 */
export const isAdminUser = (permissions: string[] = []): boolean => {
  return permissions.includes(MODULE_PERMISSIONS.ADMIN);
};

/**
 * Checks if a user is a regular employee (non-admin)
 * @param permissions - Array of user permissions
 * @returns true if user does not have admin permission
 */
export const isRegularEmployee = (permissions: string[] = []): boolean => {
  return !permissions.includes(MODULE_PERMISSIONS.ADMIN);
};
