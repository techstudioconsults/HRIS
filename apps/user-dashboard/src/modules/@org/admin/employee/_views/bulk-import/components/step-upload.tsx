'use client';

import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { cn } from '@workspace/ui/lib/utils';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useCallback, useRef, useState } from 'react';

const ACCEPT = '.xlsx,.xls';
const MAX_FILE_SIZE_MB = 25;

interface StepUploadProperties {
  readonly parseError: string | null;
  readonly isLoadingTeams: boolean;
  readonly onFileAccepted: (file: File) => Promise<void>;
}

export function StepUpload({
  parseError,
  isLoadingTeams,
  onFileAccepted,
}: StepUploadProperties) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const displayError = localError ?? parseError;

  const processFile = useCallback(
    async (file: File) => {
      setLocalError(null);

      // Client-side size guard
      const sizeMb = file.size / (1024 * 1024);
      if (sizeMb > MAX_FILE_SIZE_MB) {
        setLocalError(
          `File is too large (${sizeMb.toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`
        );
        return;
      }

      setIsParsing(true);
      try {
        await onFileAccepted(file);
      } finally {
        setIsParsing(false);
      }
    },
    [onFileAccepted]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void processFile(file);
      // Reset so the same file can be re-uploaded
      e.target.value = '';
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) void processFile(file);
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const isDisabled = isLoadingTeams || isParsing;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Drop-zone */}
      <div
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-label="Upload Excel file — click or drag and drop"
        aria-disabled={isDisabled}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isDisabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          'flex min-h-52 cursor-pointer flex-col items-center justify-center gap-4',
          'rounded-xl border-2 border-dashed p-8 transition-colors',
          'focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/30',
          isDisabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <div
          className={cn(
            'bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full',
            isDragOver && 'scale-110'
          )}
          aria-hidden="true"
        >
          {isParsing ? (
            <Icon
              name="UploadCloud"
              className="size-8 animate-pulse"
              aria-hidden="true"
            />
          ) : (
            <Icon
              name="FileSpreadsheet"
              className="size-8"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="text-center">
          <p className="text-foreground font-semibold">
            {isParsing
              ? 'Parsing spreadsheet…'
              : isDragOver
                ? 'Drop your file here'
                : 'Drag & drop your Excel file here'}
          </p>
          {!isParsing && (
            <p className="text-muted-foreground mt-1 text-sm">
              or{' '}
              <span className="text-primary font-medium underline underline-offset-2">
                browse files
              </span>
            </p>
          )}
          <p className="text-muted-foreground mt-3 text-xs">
            Supported formats: .xlsx, .xls · Max size: {MAX_FILE_SIZE_MB} MB
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleInputChange}
          disabled={isDisabled}
        />
      </div>

      {/* Loading teams notice */}
      {isLoadingTeams && (
        <p className="text-muted-foreground text-center text-sm" role="status">
          Loading organisation teams… please wait before uploading.
        </p>
      )}

      {/* Parse / validation error */}
      {displayError && (
        <Alert variant="destructive" role="alert">
          <Icon
            name="AlertCircle"
            size={16}
            className="h-4 w-4"
            aria-hidden="true"
          />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      {/* Required columns hint */}
      <details className="border-muted rounded-lg border">
        <summary className="text-muted-foreground cursor-pointer select-none px-4 py-3 text-sm font-medium">
          Required spreadsheet columns
        </summary>
        <div className="px-4 pb-4 pt-0">
          <ul className="text-muted-foreground mt-2 grid grid-cols-2 gap-1 text-xs">
            {[
              'First Name',
              'Last Name',
              'Email',
              'Phone Number',
              'Department',
              'Role',
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
            ].map((col) => (
              <li key={col} className="flex items-center gap-1">
                <span className="text-primary" aria-hidden="true">
                  ·
                </span>
                {col}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}
