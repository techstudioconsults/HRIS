import * as XLSX from 'xlsx';

import { REQUIRED_HEADERS, type RawImportRow } from '../types';

const SUPPORTED_EXTENSIONS = ['.xlsx', '.xls'] as const;

export interface ParseResult {
  readonly rows: RawImportRow[];
  readonly error?: string;
}

/**
 * Parses an Excel (.xlsx / .xls) file entirely in the browser using SheetJS.
 * Returns either the parsed rows or a user-friendly error message.
 *
 * Validates:
 *  - File extension is .xlsx or .xls
 *  - The first sheet is not empty
 *  - All required column headers are present
 */
export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const fileName = file.name.toLowerCase();
    const isSupported = SUPPORTED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!isSupported) {
      resolve({
        rows: [],
        error: `Unsupported file type "${file.name}". Please upload an .xlsx or .xls file.`,
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryData = event.target?.result;
        const workbook = XLSX.read(binaryData, { type: 'binary' });

        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          resolve({ rows: [], error: 'The spreadsheet contains no sheets.' });
          return;
        }

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          resolve({ rows: [], error: 'Unable to read the sheet data.' });
          return;
        }

        // raw: false formats dates as strings instead of serial numbers
        const rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(
          worksheet,
          { defval: '', raw: false }
        );

        if (rawRows.length === 0) {
          resolve({
            rows: [],
            error:
              'The spreadsheet is empty. Please upload a file with employee data rows.',
          });
          return;
        }

        // Verify all required headers exist on the first row
        const sheetHeaders = Object.keys(rawRows[0]);
        const missingHeaders = REQUIRED_HEADERS.filter(
          (h) => !sheetHeaders.includes(h)
        );

        if (missingHeaders.length > 0) {
          resolve({
            rows: [],
            error: `Missing required columns: ${missingHeaders.join(', ')}. Please use the provided template.`,
          });
          return;
        }

        resolve({ rows: rawRows as RawImportRow[] });
      } catch {
        resolve({
          rows: [],
          error:
            'Failed to parse the spreadsheet. Please check the file is a valid Excel workbook.',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        rows: [],
        error: 'Failed to read the file. Please try again.',
      });
    };

    reader.readAsBinaryString(file);
  });
}
