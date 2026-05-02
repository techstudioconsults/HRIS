import {
  EXCEL_HEADERS,
  type MappedImportRow,
  type RawImportRow,
} from '../types';

// Using the global Team type (declared in src/types/entities.d.ts)
// This interface is structurally compatible with Team — kept local so this
// service does not import the global ambient declaration directly.
interface TeamLike {
  readonly id: string | number;
  readonly name: string;
  readonly roles?: ReadonlyArray<{ id: string | number; name: string }>;
}

/**
 * Attempts to parse a date string into YYYY-MM-DD format.
 * Accepts YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY, or any format
 * that Date.parse() can handle.
 */
function normaliseDate(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  // Return as-is and let the validator flag it
  return trimmed;
}

/**
 * Maps raw SheetJS rows into strongly-typed MappedImportRow objects.
 * Resolves team names → teamId and role names → roleId using the
 * organisation's loaded teams data.
 *
 * This layer is intentionally free of validation logic.
 */
export function mapRowsToPayloads(
  rawRows: RawImportRow[],
  teams: TeamLike[]
): MappedImportRow[] {
  return rawRows.map((raw, index) => {
    const teamName = String(raw[EXCEL_HEADERS.DEPARTMENT] ?? '').trim();
    const roleName = String(raw[EXCEL_HEADERS.ROLE] ?? '').trim();

    const matchedTeam = teams.find(
      (t) => t.name.toLowerCase() === teamName.toLowerCase()
    );
    const teamId = matchedTeam ? String(matchedTeam.id) : '';

    const matchedRole = matchedTeam?.roles?.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );
    const roleId = matchedRole ? String(matchedRole.id) : '';

    const salaryRaw = String(raw[EXCEL_HEADERS.BASE_SALARY] ?? '').trim();
    const baseSalary = parseFloat(salaryRaw.replace(/[^\d.]/g, '')) || 0;

    return {
      rowNumber: index + 2, // +1 for 1-index, +1 for header row
      firstName: String(raw[EXCEL_HEADERS.FIRST_NAME] ?? '').trim(),
      lastName: String(raw[EXCEL_HEADERS.LAST_NAME] ?? '').trim(),
      email: String(raw[EXCEL_HEADERS.EMAIL] ?? '')
        .trim()
        .toLowerCase(),
      phoneNumber: String(raw[EXCEL_HEADERS.PHONE_NUMBER] ?? '').trim(),
      teamName,
      roleName,
      teamId,
      roleId,
      dateOfBirth: normaliseDate(
        String(raw[EXCEL_HEADERS.DATE_OF_BIRTH] ?? '')
      ),
      gender: String(raw[EXCEL_HEADERS.GENDER] ?? '')
        .trim()
        .toLowerCase(),
      startDate: normaliseDate(String(raw[EXCEL_HEADERS.START_DATE] ?? '')),
      employmentType: String(raw[EXCEL_HEADERS.EMPLOYMENT_TYPE] ?? '')
        .trim()
        .toLowerCase(),
      workMode: String(raw[EXCEL_HEADERS.WORK_MODE] ?? '')
        .trim()
        .toLowerCase(),
      baseSalary,
      bankName: String(raw[EXCEL_HEADERS.BANK_NAME] ?? '').trim(),
      accountName: String(raw[EXCEL_HEADERS.ACCOUNT_NAME] ?? '').trim(),
      accountNumber: String(raw[EXCEL_HEADERS.ACCOUNT_NUMBER] ?? '').trim(),
      bankCode: String(raw[EXCEL_HEADERS.BANK_CODE] ?? '').trim(),
      // Default password — employee must reset on first login
      password: 'PleaseSetAdefaultHere1.',
    };
  });
}
