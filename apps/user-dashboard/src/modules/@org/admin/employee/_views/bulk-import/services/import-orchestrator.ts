import type {
  ImportProgress,
  ImportRowResult,
  ImportSummary,
  ValidatedImportRow,
} from '../types';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Maximum parallel requests — prevents API flooding / rate limiting */
const CONCURRENCY_LIMIT = 5;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreateEmployeeFn = (formData: FormData) => Promise<unknown>;
type ProgressCallback = (progress: ImportProgress) => void;

interface ApiErrorShape {
  response?: { data?: { message?: string } };
  message?: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function buildFormData(row: ValidatedImportRow): FormData {
  const fd = new FormData();
  fd.append('firstName', row.firstName);
  fd.append('lastName', row.lastName);
  fd.append('email', row.email);
  fd.append('phoneNumber', row.phoneNumber);
  fd.append('password', row.password);
  fd.append('teamId', row.teamId);
  fd.append('roleId', row.roleId);
  // Send as full ISO string — backend expects ISO 8601
  fd.append('dateOfBirth', new Date(row.dateOfBirth).toISOString());
  fd.append('gender', row.gender);
  fd.append('startDate', new Date(row.startDate).toISOString());
  fd.append('employmentType', row.employmentType);
  fd.append('workMode', row.workMode);
  fd.append('baseSalary', String(row.baseSalary));
  fd.append('bankName', row.bankName);
  fd.append('accountName', row.accountName);
  fd.append('accountNumber', row.accountNumber);
  fd.append('bankCode', row.bankCode);
  return fd;
}

function extractErrorMessage(err: unknown): string {
  const typed = err as ApiErrorShape;
  return typed?.response?.data?.message ?? typed?.message ?? 'Unexpected error';
}

// ---------------------------------------------------------------------------
// Core orchestrator
// ---------------------------------------------------------------------------

/**
 * Imports employees with controlled concurrency.
 *
 * - Fires at most CONCURRENCY_LIMIT requests simultaneously.
 * - Emits live ImportProgress after every settled row.
 * - Never aborts remaining rows on partial failure.
 * - Respects an optional AbortSignal to allow user cancellation.
 */
export async function runImport(
  rows: readonly ValidatedImportRow[],
  createEmployee: CreateEmployeeFn,
  onProgress: ProgressCallback,
  signal?: AbortSignal
): Promise<ImportSummary> {
  const total = rows.length;
  let completed = 0;
  let successful = 0;
  let failed = 0;
  const rowResults: ImportRowResult[] = new Array(total);

  const emitProgress = () => {
    onProgress({
      total,
      completed,
      successful,
      failed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  };

  // Emit initial 0% state immediately
  emitProgress();

  async function processRow(
    row: ValidatedImportRow,
    index: number
  ): Promise<void> {
    const base: Omit<ImportRowResult, 'status' | 'reason'> = {
      rowNumber: row.rowNumber,
      employeeName: `${row.firstName} ${row.lastName}`,
      email: row.email,
    };

    if (signal?.aborted) {
      failed++;
      completed++;
      rowResults[index] = {
        ...base,
        status: 'failed',
        reason: 'Import cancelled',
      };
      emitProgress();
      return;
    }

    try {
      const formData = buildFormData(row);
      await createEmployee(formData);
      successful++;
      completed++;
      rowResults[index] = { ...base, status: 'success' };
    } catch (err) {
      failed++;
      completed++;
      rowResults[index] = {
        ...base,
        status: 'failed',
        reason: extractErrorMessage(err),
      };
    }

    emitProgress();
  }

  // ---------------------------------------------------------------------------
  // Concurrency pool — spin up CONCURRENCY_LIMIT workers that each pull the
  // next available row index until all rows are processed.
  // ---------------------------------------------------------------------------
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < rows.length) {
      const taskIndex = nextIndex++;
      await processRow(rows[taskIndex], taskIndex);
    }
  }

  const workerCount = Math.min(CONCURRENCY_LIMIT, total);
  await Promise.all(Array.from({ length: workerCount }, worker));

  const failedRows = rows.filter((_, i) => rowResults[i]?.status === 'failed');

  return { total, successful, failed, results: rowResults, failedRows };
}
