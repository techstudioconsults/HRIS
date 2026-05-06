'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Icon } from '@workspace/ui/lib/icons/icon';

interface FieldValidFeedbackProps {
  name: string;
  message?: string;
}

/**
 * Shows a green "valid" feedback message when a form field transitions
 * from an error state to a valid state. The message auto-fades after 2 seconds.
 *
 * Uses `onChange` validation mode for real-time feedback.
 */
export function FieldValidFeedback({
  name,
  message = 'Valid',
}: FieldValidFeedbackProps) {
  const {
    formState: { errors, dirtyFields },
  } = useFormContext();

  const hasError = !!errors[name];
  const isDirty = (dirtyFields as Record<string, boolean>)[name];

  const prevErrorRef = useRef(hasError);
  const [showValid, setShowValid] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Trigger feedback when a previously errored dirty field becomes valid
    if (prevErrorRef.current && !hasError && isDirty) {
      setShowValid(true);
      setAnimationKey((prev) => prev + 1);
    }

    prevErrorRef.current = hasError;
  }, [hasError, isDirty]);

  const handleAnimationEnd = () => {
    setShowValid(false);
  };

  if (!showValid) return null;

  return (
    <p
      key={animationKey}
      role="status"
      aria-live="polite"
      className="animate-valid-feedback flex items-center gap-1"
      onAnimationEnd={handleAnimationEnd}
    >
      <Icon name={`CheckCircle2`} size={12} aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}
