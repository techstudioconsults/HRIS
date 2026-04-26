import { cn } from '@workspace/ui/lib/utils';

import type { PlaceholderPanelProperties } from '../../types';

export const PlaceholderPanel = ({
  title,
  description,
  className = '',
}: PlaceholderPanelProperties) => {
  return (
    <div
      className={cn(
        'bg-background border-border rounded-lg border p-6 shadow-sm',
        className
      )}
    >
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  );
};
