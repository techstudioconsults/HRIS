import type {
  AccountSettings,
  PayrollSettings,
  SecuritySettings,
  HRSettings,
  NotificationSettings,
  Role,
  RolesResponse,
} from '@/modules/@org/admin/settings/types';

export const mockAccountSettings: AccountSettings = {
  organisationId: 'org_01',
  name: 'Techstudio Academy Ltd',
  logoUrl: null,
  contactEmail: 'admin@techstudioacademy.com',
  phone: '+234 800 000 0000',
  address: '10 Admiralty Way, Lekki Phase 1, Lagos',
  registrationNumber: 'RC-1234567',
  updatedBy: 'admin_01',
  updatedAt: '2026-01-15T09:00:00Z',
};

export const mockPayrollSettings: PayrollSettings = {
  organisationId: 'org_01',
  payCycle: 'MONTHLY',
  currency: 'NGN',
  deductions: [
    {
      type: 'TAX',
      label: 'PAYE Tax',
      valueType: 'PERCENTAGE',
      value: 7.5,
      enabled: true,
    },
    {
      type: 'PENSION',
      label: 'Pension (Employee)',
      valueType: 'PERCENTAGE',
      value: 8,
      enabled: true,
    },
    {
      type: 'HEALTH_INSURANCE',
      label: 'Health Insurance (NHIS)',
      valueType: 'PERCENTAGE',
      value: 1.75,
      enabled: true,
    },
  ],
  updatedBy: 'admin_01',
  updatedAt: '2026-01-15T09:00:00Z',
};

export const mockSecuritySettings: SecuritySettings = {
  organisationId: 'org_01',
  enforce2FA: false,
  sessionTimeoutMinutes: 60,
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    expiryDays: 0,
  },
  updatedBy: 'admin_01',
  updatedAt: '2026-01-15T09:00:00Z',
};

export const mockHRSettings: HRSettings = {
  organisationId: 'org_01',
  workingHoursPerWeek: 40,
  probationPeriodMonths: 6,
  leaveCarryover: {
    enabled: true,
    maxDays: 5,
    expiryMonths: 3,
  },
  updatedBy: 'admin_01',
  updatedAt: '2026-01-15T09:00:00Z',
};

export const mockNotificationSettings: NotificationSettings = {
  organisationId: 'org_01',
  events: [
    {
      eventType: 'LEAVE_REQUEST_SUBMITTED',
      label: 'New Leave Request',
      emailEnabled: true,
      inAppEnabled: true,
    },
    {
      eventType: 'LEAVE_REQUEST_APPROVED',
      label: 'Leave Request Approved',
      emailEnabled: true,
      inAppEnabled: true,
    },
    {
      eventType: 'LEAVE_REQUEST_DECLINED',
      label: 'Leave Request Declined',
      emailEnabled: true,
      inAppEnabled: false,
    },
    {
      eventType: 'PAYROLL_RUN_COMPLETED',
      label: 'Payroll Run Completed',
      emailEnabled: true,
      inAppEnabled: true,
    },
    {
      eventType: 'CONTRACT_EXPIRY_APPROACHING',
      label: 'Contract Expiry Alert',
      emailEnabled: true,
      inAppEnabled: true,
    },
    {
      eventType: 'ONBOARDING_COMPLETED',
      label: 'Onboarding Completed',
      emailEnabled: false,
      inAppEnabled: true,
    },
  ],
  updatedBy: 'admin_01',
  updatedAt: '2026-01-15T09:00:00Z',
};

export const mockSystemRoles: Role[] = [
  {
    id: 'role_super_admin',
    organisationId: 'org_01',
    name: 'Super Admin',
    isSystem: true,
    permissions: [
      'admin:employees:read',
      'admin:employees:write',
      'admin:leave:read',
      'admin:leave:write',
      'admin:payroll:read',
      'admin:payroll:write',
      'admin:resources:read',
      'admin:resources:write',
      'admin:settings:read',
      'admin:settings:write',
      'admin:teams:read',
      'admin:teams:write',
    ],
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'role_hr_manager',
    organisationId: 'org_01',
    name: 'HR Manager',
    isSystem: true,
    permissions: [
      'admin:employees:read',
      'admin:employees:write',
      'admin:leave:read',
      'admin:leave:write',
      'admin:settings:read',
    ],
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'role_hr_officer',
    organisationId: 'org_01',
    name: 'HR Officer',
    isSystem: true,
    permissions: ['admin:employees:read', 'admin:leave:read'],
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'role_employee',
    organisationId: 'org_01',
    name: 'Employee',
    isSystem: true,
    permissions: [],
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2020-01-01T00:00:00Z',
  },
];

export const mockCustomRoles: Role[] = [
  {
    id: 'role_custom_01',
    organisationId: 'org_01',
    name: 'Recruitment Lead',
    isSystem: false,
    permissions: ['admin:employees:read', 'admin:employees:write'],
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-06-01T10:00:00Z',
    createdBy: 'admin_01',
  },
];

export const mockRolesResponse: RolesResponse = {
  system: mockSystemRoles,
  custom: mockCustomRoles,
};
