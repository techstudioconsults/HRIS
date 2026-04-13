'use client';

import { Moon, Sun } from 'lucide-react';

import { Button } from '../../../button';
import { useModeToggle } from './use-theme-toggle';

export function ModeToggle() {
  const { mode, toggleTheme } = useModeToggle();
  const nextMode = mode === 'dark' ? 'light' : 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextMode} mode`}
      title={`Switch to ${nextMode} mode`}
    >
      {mode === 'dark' ? (
        <Sun className="size-6" />
      ) : (
        <Moon className="size-6" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
