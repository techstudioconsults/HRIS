import type { HtmlHTMLAttributes } from 'react';

export interface ExportActionProperties<
  T,
> extends HtmlHTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean;
  downloadMutation?: (parameters: T) => Promise<Blob | File>;
  currentPage?: number;
  dateRange?: { from?: Date; to?: Date };
  status?: string;
  onDownloadComplete?: () => void;
  buttonText?: string;
  additionalParameters?: Omit<T, 'page' | 'start_date' | 'end_date' | 'status'>;
  fileName?: string;
  size?: 'xs' | 'lg' | 'xl' | 'icon';
}
