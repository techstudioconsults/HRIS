'use client';

import { BatchProgress } from '@workspace/ui/lib/progress';
import { cn } from '@workspace/ui/lib/utils';
import { Icon } from '@workspace/ui/lib/icons/icon';

import type { ImportProgress } from '../types';

interface StepProgressProperties {
  readonly progress: ImportProgress | null;
}

export function StepProgress({ progress }: StepProgressProperties) {
  const p = progress ?? {
    total: 0,
    completed: 0,
    successful: 0,
    failed: 0,
    percentage: 0,
  };

  const statusText =
    p.total === 0
      ? 'Preparing…'
      : p.completed < p.total
        ? `Processing row ${p.completed} of ${p.total}…`
        : 'Finalising…';

  return (
    <div
      className="mx-auto max-w-lg space-y-8 py-8"
      role="region"
      aria-label="Import progress"
    >
      {/* Spinner + heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <Icon
          name="Loader2"
          size={48}
          className="text-primary animate-spin"
          aria-hidden="true"
        />
        <div>
          <h3 className="text-foreground text-lg font-semibold">
            Importing employees
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Please keep this tab open until the import finishes.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <BatchProgress
        progress={p.percentage}
        status={statusText}
        size="md"
        ariaLive="polite"
        barClassName="h-3"
      />

      {/* Live counters */}
      <div
        className="grid grid-cols-3 gap-4"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`${p.completed} of ${p.total} completed — ${p.successful} succeeded, ${p.failed} failed`}
      >
        <CounterCard
          label="Completed"
          value={p.completed}
          total={p.total}
          variant="neutral"
        />
        <CounterCard
          label="Succeeded"
          value={p.successful}
          total={p.total}
          variant="success"
        />
        <CounterCard
          label="Failed"
          value={p.failed}
          total={p.total}
          variant="error"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Counter card
// ---------------------------------------------------------------------------

function CounterCard({
  label,
  value,
  total,
  variant,
}: {
  label: string;
  value: number;
  total: number;
  variant: 'neutral' | 'success' | 'error';
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 rounded-xl border p-4 text-center',
        variant === 'success' &&
          'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30',
        variant === 'error' &&
          'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30',
        variant === 'neutral' && 'border-muted bg-muted/40'
      )}
    >
      {variant === 'success' && (
        <Icon
          name="CheckCircle2"
          size={16}
          className="text-green-600 dark:text-green-400"
          aria-hidden="true"
        />
      )}
      {variant === 'error' && (
        <Icon
          name="XCircle"
          size={16}
          className="text-destructive"
          aria-hidden="true"
        />
      )}
      <span
        className={cn(
          'text-2xl font-bold',
          variant === 'success' && 'text-green-700 dark:text-green-400',
          variant === 'error' && 'text-destructive',
          variant === 'neutral' && 'text-foreground'
        )}
      >
        {value}
        {total > 0 && (
          <span className="text-muted-foreground ml-1 text-sm font-normal">
            / {total}
          </span>
        )}
      </span>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
    </div>
  );
}
