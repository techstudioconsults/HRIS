// HR Application Auth Types for Role and Permission-based Access Control

// export interface Role {
//   id: string;
//   name: string;
//   permissions: string[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface Employee {
//   id: string;
//   fullName: string;
//   email: string;
//   role: Role;
// }

// export interface AuthTokens {
//   accessToken: string;
//   refreshToken: string;
// }

// export interface AuthResponse {
//   success: boolean;
//   data: {
//     employee: Employee;
//     tokens: AuthTokens;
//     permissions: string[];
//   };
// }

// Module-based permissions for HR application
export const MODULE_PERMISSIONS = {
  // Payroll module
  PAYROLL_READ: "payroll:read",
  PAYROLL_CREATE: "payroll:create",
  PAYROLL_EDIT: "payroll:edit",
  PAYROLL_DELETE: "payroll:delete",
  PAYROLL_MANAGE: "payroll:manage", // Full CRUD access

  // Leave Management module
  LEAVE_READ: "leave:read",
  LEAVE_CREATE: "leave:create",
  LEAVE_EDIT: "leave:edit",
  LEAVE_DELETE: "leave:delete",
  LEAVE_MANAGE: "leave:manage", // Full CRUD access

  // Employee Records module
  EMPLOYEE_READ: "employee:read",
  EMPLOYEE_CREATE: "employee:create",
  EMPLOYEE_EDIT: "employee:edit",
  EMPLOYEE_DELETE: "employee:delete",
  EMPLOYEE_MANAGE: "employee:manage", // Full CRUD access

  // Attendance module
  ATTENDANCE_READ: "attendance:read",
  ATTENDANCE_CREATE: "attendance:create",
  ATTENDANCE_EDIT: "attendance:edit",
  ATTENDANCE_DELETE: "attendance:delete",
  ATTENDANCE_MANAGE: "attendance:manage", // Full CRUD access

  // Company Profile module
  COMPANY_READ: "company:read",
  COMPANY_CREATE: "company:create",
  COMPANY_EDIT: "company:edit",
  COMPANY_DELETE: "company:delete",
  COMPANY_MANAGE: "company:manage", // Full CRUD access

  // Teams module
  TEAMS_READ: "teams:read",
  TEAMS_CREATE: "teams:create",
  TEAMS_EDIT: "teams:edit",
  TEAMS_DELETE: "teams:delete",
  TEAMS_MANAGE: "teams:manage", // Full CRUD access

  // Admin permission (highest level access)
  ADMIN: "admin",
} as const;

// Role constants
export const ROLES = {
  OWNER: "owner",
  HR_MANAGER: "hr_manager",
  WELFARE_OFFICER: "welfare_officer",
  EMPLOYEE: "employee",
} as const;

// Route access levels
export const ACCESS_LEVELS = {
  PUBLIC: "public",
  AUTHENTICATED: "authenticated",
  OWNER_ONLY: "owner_only",
  PERMISSION_BASED: "permission_based",
} as const;

// Route definitions with access control
export interface RouteConfig {
  path: string;
  accessLevel: (typeof ACCESS_LEVELS)[keyof typeof ACCESS_LEVELS];
  requiredPermissions?: string[];
}

// Permission check result
export interface PermissionCheckResult {
  hasAccess: boolean;
  missingPermissions?: string[];
  reason?: string;
}

// Module permission mapping
export const MODULE_PERMISSION_MAP = {
  payroll: [
    MODULE_PERMISSIONS.PAYROLL_READ,
    MODULE_PERMISSIONS.PAYROLL_CREATE,
    MODULE_PERMISSIONS.PAYROLL_EDIT,
    MODULE_PERMISSIONS.PAYROLL_DELETE,
    MODULE_PERMISSIONS.PAYROLL_MANAGE,
  ],
  leave: [
    MODULE_PERMISSIONS.LEAVE_READ,
    MODULE_PERMISSIONS.LEAVE_CREATE,
    MODULE_PERMISSIONS.LEAVE_EDIT,
    MODULE_PERMISSIONS.LEAVE_DELETE,
    MODULE_PERMISSIONS.LEAVE_MANAGE,
  ],
  employee: [
    MODULE_PERMISSIONS.EMPLOYEE_READ,
    MODULE_PERMISSIONS.EMPLOYEE_CREATE,
    MODULE_PERMISSIONS.EMPLOYEE_EDIT,
    MODULE_PERMISSIONS.EMPLOYEE_DELETE,
    MODULE_PERMISSIONS.EMPLOYEE_MANAGE,
  ],
  attendance: [
    MODULE_PERMISSIONS.ATTENDANCE_READ,
    MODULE_PERMISSIONS.ATTENDANCE_CREATE,
    MODULE_PERMISSIONS.ATTENDANCE_EDIT,
    MODULE_PERMISSIONS.ATTENDANCE_DELETE,
    MODULE_PERMISSIONS.ATTENDANCE_MANAGE,
  ],
  company: [
    MODULE_PERMISSIONS.COMPANY_READ,
    MODULE_PERMISSIONS.COMPANY_CREATE,
    MODULE_PERMISSIONS.COMPANY_EDIT,
    MODULE_PERMISSIONS.COMPANY_DELETE,
    MODULE_PERMISSIONS.COMPANY_MANAGE,
  ],
  teams: [
    MODULE_PERMISSIONS.TEAMS_READ,
    MODULE_PERMISSIONS.TEAMS_CREATE,
    MODULE_PERMISSIONS.TEAMS_EDIT,
    MODULE_PERMISSIONS.TEAMS_DELETE,
    MODULE_PERMISSIONS.TEAMS_MANAGE,
  ],
} as const;
