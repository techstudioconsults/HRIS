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
import { useState } from 'react';

import type { ValidatedImportRow } from '../types';

interface StepPreviewProperties {
  readonly allRows: readonly ValidatedImportRow[];
  readonly validRows: readonly ValidatedImportRow[];
  readonly invalidRows: readonly ValidatedImportRow[];
  readonly fileName: string;
  readonly onStartImport: (
    rows: readonly ValidatedImportRow[]
  ) => Promise<void>;
  readonly onGoBack: () => void;
}

type FilterTab = 'all' | 'valid' | 'invalid';

export function StepPreview({
  allRows,
  validRows,
  invalidRows,
  fileName,
  onStartImport,
  onGoBack,
}: StepPreviewProperties) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isStarting, setIsStarting] = useState(false);

  const displayRows =
    activeTab === 'valid'
      ? validRows
      : activeTab === 'invalid'
        ? invalidRows
        : allRows;

  const handleStart = () => {
    if (validRows.length === 0) return;
    setIsStarting(true);
    void onStartImport(validRows);
  };

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Rows" value={allRows.length} variant="neutral" />
        <StatCard label="Valid" value={validRows.length} variant="success" />
        <StatCard label="Invalid" value={invalidRows.length} variant="error" />
      </div>

      {/* File name + tab filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground truncate text-sm">
          File: <span className="text-foreground font-medium">{fileName}</span>
        </p>
        <div
          className="flex gap-1 rounded-lg border p-1"
          role="tablist"
          aria-label="Filter rows by status"
        >
          {(
            [
              { key: 'all', label: `All (${allRows.length})` },
              { key: 'valid', label: `Valid (${validRows.length})` },
              { key: 'invalid', label: `Invalid (${invalidRows.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview table */}
      <div
        className="overflow-auto rounded-lg border"
        role="region"
        aria-label="Employee preview table"
      >
        <Table>
          <TableHeader className="bg-muted sticky top-0">
            <TableRow>
              <TableHead className="w-16">Row #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead>Errors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground h-24 text-center"
                >
                  No rows to display.
                </TableCell>
              </TableRow>
            ) : (
              displayRows.map((row) => (
                <TableRow
                  key={`${row.rowNumber}-${row.email}`}
                  className={cn(
                    'border-border/30',
                    !row.isValid && 'bg-destructive/5'
                  )}
                >
                  <TableCell className="text-muted-foreground text-sm">
                    {row.rowNumber}
                  </TableCell>
                  <TableCell className="font-medium">
                    {row.firstName} {row.lastName}
                  </TableCell>
                  <TableCell className="text-sm">{row.email}</TableCell>
                  <TableCell className="text-sm">
                    {row.teamName || '—'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {row.roleName || '—'}
                  </TableCell>
                  <TableCell>
                    {row.isValid ? (
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
                        Valid
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <Icon
                          name="AlertCircle"
                          size={12}
                          className="mr-1"
                          aria-hidden="true"
                        />
                        Invalid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.errors.length > 0 ? (
                      <ul className="space-y-0.5">
                        {row.errors.map((err, i) => (
                          <li
                            key={i}
                            className="text-destructive flex items-start gap-1 text-xs"
                          >
                            <span aria-hidden="true">·</span>
                            {err}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Invalid rows notice */}
      {invalidRows.length > 0 && (
        <p className="text-muted-foreground text-sm" role="note">
          <Icon
            name="AlertCircle"
            size={16}
            className="text-destructive mr-1 inline"
            aria-hidden="true"
          />
          {invalidRows.length} row{invalidRows.length !== 1 ? 's' : ''} will be
          skipped. Only the {validRows.length} valid row
          {validRows.length !== 1 ? 's' : ''} will be imported.
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onGoBack} disabled={isStarting}>
          <Icon
            name="ChevronLeft"
            size={16}
            className="mr-1"
            aria-hidden="true"
          />
          Back
        </Button>
        <MainButton
          variant="primary"
          isDisabled={validRows.length === 0 || isStarting}
          isLoading={isStarting}
          onClick={handleStart}
          className="gap-2"
          aria-label={`Start import of ${validRows.length} valid employees`}
        >
          {isStarting ? (
            <Icon
              name="Loader2"
              size={16}
              className="animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Icon name="Upload" size={16} aria-hidden="true" />
          )}
          Import {validRows.length} Employee{validRows.length !== 1 ? 's' : ''}
        </MainButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card sub-component
// ---------------------------------------------------------------------------

function StatCard({
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
          'text-2xl font-bold',
          variant === 'success' && 'text-green-700 dark:text-green-400',
          variant === 'error' && 'text-destructive',
          variant === 'neutral' && 'text-foreground'
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          'mt-1 text-xs font-medium',
          variant === 'neutral'
            ? 'text-muted-foreground'
            : 'text-muted-foreground'
        )}
      >
        {label}
      </p>
    </div>
  );
}
