export type SettingsTab =
  | 'account'
  | 'roles'
  | 'notifications'
  | 'security'
  | 'payroll'
  | 'hr';

// ---------------------------------------------------------------------------
// HR Settings — General Rules tab
// ---------------------------------------------------------------------------

export type GeneralHRRulesFormValues = {
  probationLength: string;
  autoConfirmAfterProbation: boolean;
  requireManualConfirmationReview: boolean;
  minimumNoticePeriodDays?: number;
  probationReminders: boolean;
  workAnniversaryReminders: boolean;
};

// ---------------------------------------------------------------------------
// Notification Settings tab
// ---------------------------------------------------------------------------

export type NotificationCategoryKey =
  | 'newEmployeeAdded'
  | 'employeeTermination'
  | 'newRoleCreated'
  | 'newTeamCreated'
  | 'resourceUploaded'
  | 'probationReviewDue'
  | 'salaryDisbursement'
  | 'walletTopUp'
  | 'paydayReminder'
  | 'loginFromNewDevice'
  | 'passwordChange'
  | 'rolePermissionChanges';

export type NotificationSettingsFormValues = {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  categories: Record<NotificationCategoryKey, boolean>;
};

// ---------------------------------------------------------------------------
// Placeholder panel
// ---------------------------------------------------------------------------

export type PlaceholderPanelProperties = {
  title: string;
  description: string;
  className?: string;
};

// ---------------------------------------------------------------------------
// Roles Management tab
// ---------------------------------------------------------------------------

export type RoleAssignedEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export type RoleRow = {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  permissions: string[];
  assignedEmployees: RoleAssignedEmployee[];
  lastModified: string;
};

export type RoleEditorState =
  | { open: false }
  | {
      open: true;
      mode: 'create' | 'edit';
      teamId: string;
      role?: { id: string; name: string; permissions: string[] };
    };

export type RoleToggleState =
  | { open: false }
  | {
      open: true;
      roleId: string;
      roleName: string;
      action: 'deactivate' | 'activate';
    };

// ---------------------------------------------------------------------------
// Security Settings tab
// ---------------------------------------------------------------------------

export type SecuritySettingsFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  enable2fa: boolean;
};
