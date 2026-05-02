// ---------------------------------------------------------------------------
// Types for the HR Employee Bulk Import domain
// ---------------------------------------------------------------------------

export type ImportStep = 'upload' | 'preview' | 'importing' | 'summary';

/** Raw row straight from the SheetJS parser — all values are strings */
export type RawImportRow = Readonly<Record<string, string>>;

/** After column-mapping and team/role resolution */
export interface MappedImportRow {
  readonly rowNumber: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phoneNumber: string;
  /** Display value from the sheet (used in failure report) */
  readonly teamName: string;
  /** Display value from the sheet (used in failure report) */
  readonly roleName: string;
  /** Resolved from teamName against the organisations teams */
  readonly teamId: string;
  /** Resolved from roleName within the matched team */
  readonly roleId: string;
  readonly dateOfBirth: string;
  readonly gender: string;
  readonly startDate: string;
  readonly employmentType: string;
  readonly workMode: string;
  readonly baseSalary: number;
  readonly bankName: string;
  readonly accountName: string;
  readonly accountNumber: string;
  readonly bankCode: string;
  readonly password: string;
}

/** After Zod validation */
export interface ValidatedImportRow extends MappedImportRow {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}

export type ImportRowStatus = 'success' | 'failed';

export interface ImportRowResult {
  readonly rowNumber: number;
  readonly employeeName: string;
  readonly email: string;
  readonly status: ImportRowStatus;
  readonly reason?: string;
}

export interface ImportProgress {
  readonly total: number;
  readonly completed: number;
  readonly successful: number;
  readonly failed: number;
  readonly percentage: number;
}

export interface ImportSummary {
  readonly total: number;
  readonly successful: number;
  readonly failed: number;
  readonly results: readonly ImportRowResult[];
  readonly failedRows: readonly ValidatedImportRow[];
}

// ---------------------------------------------------------------------------
// Excel column header constants — must match the template exactly
// ---------------------------------------------------------------------------

export const EXCEL_HEADERS = {
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  EMAIL: 'Email',
  PHONE_NUMBER: 'Phone Number',
  DEPARTMENT: 'Department',
  ROLE: 'Role',
  DATE_OF_BIRTH: 'Date of Birth',
  GENDER: 'Gender',
  START_DATE: 'Start Date',
  EMPLOYMENT_TYPE: 'Employment Type',
  WORK_MODE: 'Work Mode',
  BASE_SALARY: 'Base Salary',
  BANK_NAME: 'Bank Name',
  ACCOUNT_NAME: 'Account Name',
  ACCOUNT_NUMBER: 'Account Number',
  BANK_CODE: 'Bank Code',
} as const;

export const REQUIRED_HEADERS = Object.values(EXCEL_HEADERS);

// ---------------------------------------------------------------------------
// Compound results
// ---------------------------------------------------------------------------

export interface ValidationResult {
  readonly allRows: ValidatedImportRow[];
  readonly validRows: ValidatedImportRow[];
  readonly invalidRows: ValidatedImportRow[];
}
