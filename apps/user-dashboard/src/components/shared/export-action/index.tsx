/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { MainButton } from '@workspace/ui/lib/button';
import { cn } from '@workspace/ui/lib/utils';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { useTransition } from 'react';
import { Icon } from '@workspace/ui/lib/icons/icon';
import type { ExportActionProperties } from './types';

const ExportAction = <T extends object>({
  isDisabled = false,
  downloadMutation,
  currentPage = 1,
  dateRange,
  status,
  onDownloadComplete,
  buttonText = 'Export',
  additionalParameters,
  fileName = 'download',
  size = 'lg',
  className,
}: ExportActionProperties<T>) => {
  const [isPending, startTransition] = useTransition();

  const handleDownload = async () => {
    startTransition(async () => {
      const parameters: any = {
        page: currentPage,
        ...(dateRange?.from && {
          start_date: format(dateRange.from, 'yyyy-MM-dd'),
        }),
        ...(dateRange?.to && { end_date: format(dateRange.to, 'yyyy-MM-dd') }),
        ...(status && status !== 'all' && { status }),
        ...additionalParameters,
      };

      const file = await downloadMutation?.(parameters);
      const blob = new Blob([file as File], { type: 'text/csv' });
      saveAs(blob, `${fileName}.csv`);
      onDownloadComplete?.();
    });
  };

  return (
    <MainButton
      isDisabled={isDisabled}
      variant="primaryOutline"
      className={cn(
        'w-full text-primary lg:w-auto disabled:border-muted',
        className
      )}
      size={size as 'lg' | 'xl' | `icon`}
      ariaLabel={buttonText}
      onClick={handleDownload}
      isLoading={isPending}
      // isIconOnly={true}
    >
      <span className="inline-flex" aria-hidden="true">
        <Icon name="DocumentDownload" variant={`Outline`} />
      </span>
      <span className="hidden lg:inline">{buttonText}</span>
    </MainButton>
  );
};

export default ExportAction;
