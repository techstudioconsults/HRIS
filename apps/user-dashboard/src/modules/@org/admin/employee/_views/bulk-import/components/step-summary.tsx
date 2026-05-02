'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { MainButton } from '@workspace/ui/lib/button';
import { cn } from '@workspace/ui/lib/utils';
import { Icon } from '@workspace/ui/lib/icons/icon';

import type { ImportSummary, ValidatedImportRow } from '../types';

interface StepSummaryProperties {
  readonly summary: ImportSummary;
  readonly onRetryFailed: (failedRows: readonly ValidatedImportRow[]) => void;
  readonly onDownloadReport: (summary: ImportSummary) => void;
  readonly onReset: () => void;
}

export function StepSummary({
  summary,
  onRetryFailed,
  onDownloadReport,
  onReset,
}: StepSummaryProperties) {
  const allSucceeded = summary.failed === 0;
  const hasFailures = summary.failed > 0;

  return (
    <div className="space-y-8">
      {/* Hero result */}
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        {allSucceeded ? (
          <Icon
            name="CheckCircle2"
            size={64}
            className="text-green-500"
            aria-hidden="true"
          />
        ) : (
          <Icon
            name="XCircle"
            size={64}
            className="text-destructive"
            aria-hidden="true"
          />
        )}
        <div>
          <h3 className="text-foreground text-xl font-bold">
            {allSucceeded ? 'Import complete!' : 'Import finished with errors'}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {allSucceeded
              ? `All ${summary.total} employees were created successfully.`
              : `${summary.successful} of ${summary.total} employees were created.`}
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="Total" value={summary.total} variant="neutral" />
        <SummaryCard
          label="Succeeded"
          value={summary.successful}
          variant="success"
        />
        <SummaryCard label="Failed" value={summary.failed} variant="error" />
      </div>

      {/* Per-row results table */}
      {summary.results.length > 0 && (
        <div
          className="overflow-auto rounded-lg border"
          role="region"
          aria-label="Import results per employee"
        >
          <Table>
            <TableHeader className="bg-muted sticky top-0">
              <TableRow>
                <TableHead className="w-16">Row #</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-24">Result</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.results.map((result) => (
                <TableRow
                  key={`${result.rowNumber}-${result.email}`}
                  className={cn(
                    'border-border/30',
                    result.status === 'failed' && 'bg-destructive/5'
                  )}
                >
                  <TableCell className="text-muted-foreground text-sm">
                    {result.rowNumber}
                  </TableCell>
                  <TableCell className="font-medium">
                    {result.employeeName}
                  </TableCell>
                  <TableCell className="text-sm">{result.email}</TableCell>
                  <TableCell>
                    {result.status === 'success' ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      >
                        <Icon
                          name="CheckCircle2"
                          size={12}
                          className="mr-1"
                          aria-hidden="true"
                        />
                        Success
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <Icon
                          name="XCircle"
                          size={12}
                          className="mr-1"
                          aria-hidden="true"
                        />
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {result.reason ?? '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Download CSV report */}
        {hasFailures && (
          <Button
            variant="outline"
            onClick={() => onDownloadReport(summary)}
            aria-label="Download CSV failure report"
          >
            <Icon
              name="Download"
              size={16}
              className="mr-2"
              aria-hidden="true"
            />
            Download Failure Report ({summary.failed})
          </Button>
        )}

        {/* Retry failed rows */}
        {hasFailures && (
          <Button
            variant="outline"
            onClick={() => onRetryFailed([...summary.failedRows])}
            aria-label={`Retry ${summary.failed} failed rows`}
          >
            <Icon
              name="RefreshCw"
              size={16}
              className="mr-2"
              aria-hidden="true"
            />
            Retry Failed ({summary.failed})
          </Button>
        )}

        {/* Start a new import */}
        <MainButton
          variant="primary"
          onClick={onReset}
          isLeftIconVisible
          icon={<Icon name="RotateCcw" size={16} aria-hidden="true" />}
          aria-label="Start a new bulk import"
        >
          New Import
        </MainButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary stat card
// ---------------------------------------------------------------------------

function SummaryCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: 'neutral' | 'success' | 'error';
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 text-center',
        variant === 'success' &&
          'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30',
        variant === 'error' &&
          'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30',
        variant === 'neutral' && 'border-muted bg-muted/40'
      )}
    >
      <p
        className={cn(
          'text-3xl font-bold',
          variant === 'success' && 'text-green-700 dark:text-green-400',
          variant === 'error' && 'text-destructive',
          variant === 'neutral' && 'text-foreground'
        )}
      >
        {value}
      </p>
      <p className="text-muted-foreground mt-1 text-xs font-medium">{label}</p>
    </div>
  );
}
