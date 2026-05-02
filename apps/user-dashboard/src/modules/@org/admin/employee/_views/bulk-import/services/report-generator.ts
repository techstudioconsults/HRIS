import { saveAs } from 'file-saver';

import type { ImportRowResult, ValidatedImportRow } from '../types';

// ---------------------------------------------------------------------------
// CSV helpers
// ---------------------------------------------------------------------------

function escapeCsvField(value: string): string {
  const str = String(value ?? '');
  // Wrap in quotes when the field contains commas, double-quotes, or newlines
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvLine(fields: string[]): string {
  return fields.map(escapeCsvField).join(',');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generates a CSV failure report and triggers a browser file download.
 *
 * Columns mirror the original import template plus a "Failure Reason" column
 * so the HR team can correct rows and re-upload.
 */
export function downloadFailureReport(
  failedRows: readonly ValidatedImportRow[],
  results: readonly ImportRowResult[]
): void {
  if (failedRows.length === 0) return;

  const headers = [
    'Row #',
    'First Name',
    'Last Name',
    'Email',
    'Department',
    'Role',
    'Phone Number',
    'Date of Birth',
    'Gender',
    'Start Date',
    'Employment Type',
    'Work Mode',
    'Base Salary',
    'Bank Name',
    'Account Name',
    'Account Number',
    'Bank Code',
    'Failure Reason',
  ];

  // Build a lookup: rowNumber → failure reason from API result
  const reasonMap = new Map<number, string>();
  for (const r of results) {
    if (r.status === 'failed' && r.reason) {
      reasonMap.set(r.rowNumber, r.reason);
    }
  }

  const lines: string[] = [toCsvLine(headers)];

  for (const row of failedRows) {
    const reason =
      reasonMap.get(row.rowNumber) ??
      (row.errors.length > 0 ? row.errors.join('; ') : 'Validation failed');

    lines.push(
      toCsvLine([
        String(row.rowNumber),
        row.firstName,
        row.lastName,
        row.email,
        row.teamName,
        row.roleName,
        row.phoneNumber,
        row.dateOfBirth,
        row.gender,
        row.startDate,
        row.employmentType,
        row.workMode,
        String(row.baseSalary),
        row.bankName,
        row.accountName,
        row.accountNumber,
        row.bankCode,
        reason,
      ])
    );
  }

  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const date = new Date().toISOString().slice(0, 10);
  saveAs(blob, `bulk-import-failures-${date}.csv`);
}
