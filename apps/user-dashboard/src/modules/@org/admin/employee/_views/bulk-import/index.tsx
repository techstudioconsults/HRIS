'use client';

import { BreadCrumb } from '@workspace/ui/lib/breadcrumb';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { cn } from '@workspace/ui/lib/utils';

import { useBulkImport } from './hooks/use-bulk-import';
import { ImportStepper } from './components/import-stepper';
import { StepProgress } from './components/step-progress';
import { StepPreview } from './components/step-preview';
import { StepSummary } from './components/step-summary';
import { StepUpload } from './components/step-upload';

/**
 * BulkImportEmployee — multi-step wizard orchestrator.
 *
 * Step state is intentionally local (useReducer) — not URL-persisted.
 * A page refresh returns to step 1 by design; bulk import is a
 * destructive multi-step flow that should not be deep-linked.
 */
export function BulkImportEmployee() {
  const {
    step,
    fileName,
    parseError,
    progress,
    summary,
    loadingTeams,
    validRows,
    invalidRows,
    allRows,
    handleFileAccepted,
    handleStartImport,
    handleRetryFailed,
    handleDownloadReport,
    handleGoBack,
    handleReset,
  } = useBulkImport();

  return (
    <div className="space-y-8">
      {/* Page header */}
      <DashboardHeader
        title="Bulk Import Employees"
        subtitle={
          <BreadCrumb
            items={[
              { label: 'Employees', href: '/admin/employees' },
              { label: 'Bulk Import', href: '' },
            ]}
            showHome
          />
        }
      />

      {/* Step wizard card */}
      <div className={cn('bg-background rounded-2xl p-6 shadow', 'space-y-8')}>
        {/* Stepper */}
        <ImportStepper currentStep={step} />

        <hr className="border-border/60" />

        {/* Step content */}
        <div role="main" aria-label={`Step: ${step}`}>
          {step === 'upload' && (
            <StepUpload
              parseError={parseError}
              isLoadingTeams={loadingTeams}
              onFileAccepted={handleFileAccepted}
            />
          )}

          {step === 'preview' && (
            <StepPreview
              allRows={allRows}
              validRows={validRows}
              invalidRows={invalidRows}
              fileName={fileName}
              onStartImport={handleStartImport}
              onGoBack={handleGoBack}
            />
          )}

          {step === 'importing' && <StepProgress progress={progress} />}

          {step === 'summary' && summary && (
            <StepSummary
              summary={summary}
              onRetryFailed={handleRetryFailed}
              onDownloadReport={handleDownloadReport}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
