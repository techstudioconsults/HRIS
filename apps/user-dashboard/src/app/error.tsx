/* eslint-disable no-console */
'use client';

import { Button } from '@workspace/ui/components/button';
import { Logo } from '@workspace/ui/lib/logo';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root error:', error);
  }, [error]);

  return (
    <div className="flex h-[70dvh]! flex-col items-center justify-center rounded-md bg-background shadow">
      <div className="flex flex-col items-center gap-4 text-center">
        <Icon name="AlertCircle" size={48} className="text-destructive" />
        <Logo width={100} height={47} />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Something went wrong!</h2>
          <p className="text-muted-foreground text-sm">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-muted-foreground text-xs">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <Button onClick={reset} variant="default" className="mt-2">
          Try again
        </Button>
      </div>
    </div>
  );
}
