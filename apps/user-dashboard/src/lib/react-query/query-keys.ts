export const queryKeys = {
  onboarding: {
    companyProfile: () => ["onboarding", "companyProfile"] as const,
    teams: () => ["onboarding", "teams"] as const,
    roles: (teamId: string) => ["onboarding", "roles", teamId] as const,
    role: (roleId: string) => ["onboarding", "role", roleId] as const,
    teamsWithRoles: () => ["onboarding", "teamsWithRoles"] as const,
  },
  product: {
    list: () => ["product", "list"] as const,
    details: (id: string) => ["product", "details", id] as const,
    filtered: (filters: Filters) => ["product", "filtered", filters] as const,
  },
  employee: {
    list: (filters?: Filters) => ["employee", "list", filters] as const,
    details: (id: string) => ["employee", "details", id] as const,
    teams: () => ["employee", "teams"] as const,
    download: (filters?: Filters) => ["employee", "download", filters] as const,
    suspendedByPayroll: (payrollId: string, filters?: Filters) =>
      ["employee", "suspendedByPayroll", payrollId, filters] as const,
  },

  folder: {
    list: (filters?: Filters) => ["folder", "list", filters] as const,
    details: (id: string) => ["folder", "details", id] as const,
    files: (folderId: string) => ["folder", "files", folderId] as const,
    download: (id: string) => ["folder", "download", id] as const,
  },
  file: {
    list: (filters?: Filters) => ["file", "list", filters] as const,
    details: (id: string) => ["file", "details", id] as const,
    download: (id: string) => ["file", "download", id] as const,
    byFolder: (folderId: string, filters?: Filters) => ["file", "byFolder", folderId, filters] as const,
    // Additional file-specific query keys if needed:
    recent: (limit?: number) => ["file", "recent", limit] as const,
    byType: (fileType: string, filters?: Filters) => ["file", "byType", fileType, filters] as const,
  },
  team: {
    list: (filters?: Filters) => ["teams", "list", filters] as const,
    details: (id: string) => ["teams", "detail", id] as const,
    download: (filters?: Filters) => ["teams", "download", filters] as const,
  },
  payroll: {
    list: (filters?: Filters) => ["payrolls", "list", filters] as const,
    details: (id: string) => ["payrolls", "detail", id] as const,
    download: (filters?: Filters) => ["payrolls", "download", filters] as const,
    policy: () => ["payrolls", "policy"] as const,
    bonuses: (filters?: Filters) => ["payrolls", "bonuses", filters] as const,
    deductions: (filters?: Filters) => ["payrolls", "deductions", filters] as const,
    wallet: () => ["payrolls", "wallet"] as const,
    approvedBanks: () => ["payrolls", "approved-banks"] as const,
    payslips: (payrollId: string, filters?: Filters) => ["payrolls", "payslips", payrollId, filters] as const,
    payslipDetails: (id: string) => ["payrolls", "payslip", id] as const,
    approvals: (payrollId: string) => ["payrolls", "approvals", payrollId] as const,
  },
  leave: {
    policy: () => ["leave", "policy"] as const,
    types: () => ["leave", "types"] as const,
    type: (id: string) => ["leave", "type", id] as const,
    requests: (filters?: Filters) => ["leave", "requests", filters] as const,
    request: (id: string) => ["leave", "request", id] as const,
    balances: (employeeId?: string) => ["leave", "balances", employeeId] as const,
    statistics: () => ["leave", "statistics"] as const,
  },
  // Add other domains as needed
};
