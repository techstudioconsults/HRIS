'use client';

import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useKBar } from 'kbar';

export function KBarToggle() {
  const { query } = useKBar();

  return (
    <MainButton
      variant="outline"
      onClick={query.toggle}
      className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
      aria-label="Open command palette"
    >
      <Icon name="Command" size={16} />
      <span className="hidden md:inline">Command Menu</span>
      <span className="ml-2 hidden items-center gap-1 md:flex">
        <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-700">
          ⌘
        </kbd>
        <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-700">
          K
        </kbd>
      </span>
    </MainButton>
  );
}
