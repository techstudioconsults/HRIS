'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useReducer, useRef } from 'react';

import { container, dependencies } from '@/lib/tools/dependencies';
import { EmployeeService } from '@/modules/@org/admin/employee/services/service';
import { useEmployeeService } from '@/modules/@org/admin/employee/services/use-service';

import { parseExcelFile } from '../services/excel-parser';
import { mapRowsToPayloads } from '../services/field-mapper';
import { runImport } from '../services/import-orchestrator';
import { downloadFailureReport } from '../services/report-generator';
import { validateRows } from '../services/validator';
import type {
  ImportProgress,
  ImportStep,
  ImportSummary,
  ValidatedImportRow,
  ValidationResult,
} from '../types';

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

interface BulkImportState {
  readonly step: ImportStep;
  readonly fileName: string;
  readonly parseError: string | null;
  readonly validationResult: ValidationResult | null;
  readonly progress: ImportProgress | null;
  readonly summary: ImportSummary | null;
  readonly isImporting: boolean;
}

type BulkImportAction =
  | { type: 'PARSE_ERROR'; payload: string }
  | {
      type: 'VALIDATION_DONE';
      payload: { result: ValidationResult; fileName: string };
    }
  | { type: 'IMPORT_START' }
  | { type: 'IMPORT_PROGRESS'; payload: ImportProgress }
  | { type: 'IMPORT_COMPLETE'; payload: ImportSummary }
  | { type: 'GO_BACK' }
  | { type: 'RESET' };

const initialState: BulkImportState = {
  step: 'upload',
  fileName: '',
  parseError: null,
  validationResult: null,
  progress: null,
  summary: null,
  isImporting: false,
};

function reducer(
  state: BulkImportState,
  action: BulkImportAction
): BulkImportState {
  switch (action.type) {
    case 'PARSE_ERROR':
      return { ...state, parseError: action.payload };

    case 'VALIDATION_DONE':
      return {
        ...state,
        step: 'preview',
        parseError: null,
        validationResult: action.payload.result,
        fileName: action.payload.fileName,
      };

    case 'IMPORT_START':
      return {
        ...state,
        step: 'importing',
        isImporting: true,
        summary: null,
        progress: {
          total: 0,
          completed: 0,
          successful: 0,
          failed: 0,
          percentage: 0,
        },
      };

    case 'IMPORT_PROGRESS':
      return { ...state, progress: action.payload };

    case 'IMPORT_COMPLETE':
      return {
        ...state,
        step: 'summary',
        isImporting: false,
        summary: action.payload,
      };

    case 'GO_BACK':
      return { ...initialState };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useBulkImport() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const abortRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  // Load teams (for team/role name → ID resolution)
  const { useGetAllTeams } = useEmployeeService();
  const { data: teamsData = [], isLoading: loadingTeams } = useGetAllTeams();

  // Use the service instance directly to avoid per-row TanStack Query cache
  // invalidation during the bulk operation (we invalidate once at the end).
  const employeeService = useMemo(
    () => container.get<EmployeeService>(dependencies.EMPLOYEE_SERVICE),
    []
  );

  // ---------------------------------------------------------------------------
  // Step 1 → 2: Parse + validate
  // ---------------------------------------------------------------------------
  const handleFileAccepted = useCallback(
    async (file: File) => {
      dispatch({ type: 'PARSE_ERROR', payload: '' });

      const parseResult = await parseExcelFile(file);
      if (parseResult.error) {
        dispatch({ type: 'PARSE_ERROR', payload: parseResult.error });
        return;
      }

      const mappedRows = mapRowsToPayloads(parseResult.rows, teamsData);
      const validationResult = validateRows(mappedRows);

      dispatch({
        type: 'VALIDATION_DONE',
        payload: { result: validationResult, fileName: file.name },
      });
    },
    [teamsData]
  );

  // ---------------------------------------------------------------------------
  // Step 2 → 3: Execute import
  // ---------------------------------------------------------------------------
  const handleStartImport = useCallback(
    async (rowsToImport: readonly ValidatedImportRow[]) => {
      if (rowsToImport.length === 0) return;

      abortRef.current = new AbortController();
      dispatch({ type: 'IMPORT_START' });

      const summary = await runImport(
        rowsToImport,
        (fd) => employeeService.createEmployee(fd) as Promise<unknown>,
        (progress) => dispatch({ type: 'IMPORT_PROGRESS', payload: progress }),
        abortRef.current.signal
      );

      dispatch({ type: 'IMPORT_COMPLETE', payload: summary });

      // Invalidate the employee list once after all imports complete
      void queryClient.invalidateQueries({ queryKey: ['employee', 'list'] });
    },
    [employeeService, queryClient]
  );

  // ---------------------------------------------------------------------------
  // Step 4: Retry only failed rows
  // ---------------------------------------------------------------------------
  const handleRetryFailed = useCallback(
    (failedRows: readonly ValidatedImportRow[]) => {
      void handleStartImport([...failedRows]);
    },
    [handleStartImport]
  );

  // ---------------------------------------------------------------------------
  // Step 4: Download failure CSV report
  // ---------------------------------------------------------------------------
  const handleDownloadReport = useCallback((summary: ImportSummary) => {
    downloadFailureReport(summary.failedRows, summary.results);
  }, []);

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  const handleGoBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    dispatch({ type: 'RESET' });
  }, []);

  return {
    // State
    ...state,
    loadingTeams,
    // Derived
    validRows: state.validationResult?.validRows ?? [],
    invalidRows: state.validationResult?.invalidRows ?? [],
    allRows: state.validationResult?.allRows ?? [],
    // Handlers
    handleFileAccepted,
    handleStartImport,
    handleRetryFailed,
    handleDownloadReport,
    handleGoBack,
    handleReset,
  };
}
