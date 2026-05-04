'use client';

import { cn } from '@workspace/ui/lib/utils';
import { Icon } from '@workspace/ui/lib/icons/icon';

import type { ImportStep } from '../types';

interface StepDefinition {
  readonly key: ImportStep;
  readonly label: string;
  readonly description: string;
}

const STEPS: StepDefinition[] = [
  { key: 'upload', label: 'Upload', description: 'Select your Excel file' },
  { key: 'preview', label: 'Preview', description: 'Review & validate rows' },
  {
    key: 'importing',
    label: 'Import',
    description: 'Employees being created',
  },
  { key: 'summary', label: 'Summary', description: 'Review results' },
];

const STEP_ORDER: ImportStep[] = ['upload', 'preview', 'importing', 'summary'];

function getStepState(
  stepKey: ImportStep,
  currentStep: ImportStep
): 'completed' | 'active' | 'upcoming' {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const stepIndex = STEP_ORDER.indexOf(stepKey);
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'active';
  return 'upcoming';
}

interface ImportStepperProperties {
  readonly currentStep: ImportStep;
}

export function ImportStepper({ currentStep }: ImportStepperProperties) {
  return (
    <nav aria-label="Import progress steps">
      <ol className="flex items-center justify-evenly gap-0">
        {STEPS.map((step, index) => {
          const state = getStepState(step.key, currentStep);
          const isLast = index === STEPS.length - 1;

          return (
            <li key={step.key} className="flex items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-1">
                <span
                  aria-current={state === 'active' ? 'step' : undefined}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full border-2 transition-colors',
                    state === 'completed' &&
                      'border-primary bg-primary text-primary-foreground',
                    state === 'active' &&
                      'border-primary text-primary bg-background',
                    state === 'upcoming' &&
                      'border-muted-foreground/40 text-muted-foreground/40 bg-background'
                  )}
                  aria-label={`Step ${index + 1}: ${step.label} — ${state}`}
                >
                  {state === 'completed' ? (
                    <Icon name="CheckCircle2" size={16} aria-hidden="true" />
                  ) : (
                    <Icon name="Circle" size={16} aria-hidden="true" />
                  )}
                </span>
                <div className="hidden text-center sm:block">
                  <p
                    className={cn(
                      'text-xs font-semibold',
                      state === 'active' && 'text-primary',
                      state === 'completed' && 'text-primary',
                      state === 'upcoming' && 'text-muted-foreground/50'
                    )}
                  >
                    {step.label}
                  </p>
                  <p
                    className={cn(
                      'text-[10px]',
                      state === 'upcoming'
                        ? 'text-muted-foreground/40'
                        : 'text-muted-foreground'
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={cn(
                    'mx-2 h-px flex-1 transition-colors',
                    STEP_ORDER.indexOf(step.key) <
                      STEP_ORDER.indexOf(currentStep)
                      ? 'bg-primary'
                      : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
