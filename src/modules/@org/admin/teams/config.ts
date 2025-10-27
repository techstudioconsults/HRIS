import { ModuleConfig } from "@/stores/types";

// Team module configuration
export const teamConfig: ModuleConfig = {
  enabled: true,
  permissions: ["read", "write", "manage", "delete"],
  settings: {
    allowSelfJoin: false,
    maxTeamSize: 50,
    minTeamSize: 1,
    enableTeamHierarchy: true,
    enableTeamBudget: true,
    enableTeamGoals: true,
    enableTeamChat: true,
    enableTeamCalendar: true,
    enableTeamDocuments: true,
    requireManagerApproval: true,
    enableTeamRoles: true,
    enableTeamPermissions: true,
    enableTeamNotifications: true,
    enableTeamReports: true,
    enableTeamAnalytics: true,
    defaultTeamRoles: [
      { name: "Manager", permissions: ["read", "write", "manage", "delete"] },
      { name: "Lead", permissions: ["read", "write", "manage"] },
      { name: "Member", permissions: ["read", "write"] },
      { name: "Observer", permissions: ["read"] },
    ],
  },
};

// Team validation rules
export const teamValidationRules = {
  minTeamNameLength: 2,
  maxTeamNameLength: 100,
  minDescriptionLength: 10,
  maxDescriptionLength: 500,
  maxTeamMembers: 50,
  minTeamMembers: 1,
  requiredFields: ["name", "description", "managerId"],
  optionalFields: ["departmentId", "maxMembers", "budget", "goals"],
};

// Team status definitions
export const teamStatuses = {
  active: { label: "Active", color: "green", description: "Team is currently active" },
  inactive: { label: "Inactive", color: "gray", description: "Team is temporarily inactive" },
  archived: { label: "Archived", color: "blue", description: "Team has been archived" },
  suspended: { label: "Suspended", color: "orange", description: "Team is suspended" },
};

// Team role configurations
export const teamRoleConfig = {
  maxRoles: 20,
  maxRoleNameLength: 50,
  maxDescriptionLength: 200,
  defaultRoles: [
    {
      name: "Manager",
      description: "Full team management access",
      permissions: ["read", "write", "manage", "delete"],
      isDefault: true,
    },
    {
      name: "Lead",
      description: "Team leadership with management capabilities",
      permissions: ["read", "write", "manage"],
      isDefault: true,
    },
    {
      name: "Member",
      description: "Standard team member access",
      permissions: ["read", "write"],
      isDefault: true,
    },
    {
      name: "Observer",
      description: "Read-only access to team information",
      permissions: ["read"],
      isDefault: true,
    },
  ],
};

// Team member status definitions
export const teamMemberStatuses = {
  active: { label: "Active", color: "green", description: "Active team member" },
  inactive: { label: "Inactive", color: "gray", description: "Inactive team member" },
  pending: { label: "Pending", color: "yellow", description: "Pending approval" },
  removed: { label: "Removed", color: "red", description: "Removed from team" },
};

// Team permission definitions
export const teamPermissions = {
  read: { label: "Read", description: "View team information and members" },
  write: { label: "Write", description: "Create and edit team content" },
  manage: { label: "Manage", description: "Manage team members and settings" },
  delete: { label: "Delete", description: "Delete team and team content" },
  invite: { label: "Invite", description: "Invite new members to team" },
  remove: { label: "Remove", description: "Remove members from team" },
  assign_roles: { label: "Assign Roles", description: "Assign roles to team members" },
  manage_budget: { label: "Manage Budget", description: "Manage team budget" },
  create_goals: { label: "Create Goals", description: "Create and manage team goals" },
  view_analytics: { label: "View Analytics", description: "View team performance analytics" },
};

// Export all team configurations
export const teamModuleConfig = {
  config: teamConfig,
  validation: teamValidationRules,
  statuses: teamStatuses,
  roles: teamRoleConfig,
  memberStatuses: teamMemberStatuses,
  permissions: teamPermissions,
};
