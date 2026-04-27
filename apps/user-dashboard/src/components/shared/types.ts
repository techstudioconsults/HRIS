import type { AnyIconName } from '@workspace/ui/lib/icons/types';

export type RenderType = 'toast' | 'banner' | 'modal';

export interface BaseNotification {
  id: string;
  event: string;
  title: string;
  body: string;
  render: RenderType;
  severity?: 'info' | 'success' | 'warning' | 'error';
  actions?: Array<{
    label: string;
    variant?: 'primary' | 'outline' | 'destructiveOutline' | 'default';
    icon?: AnyIconName;
    onClick: () => void;
  }>;
  dismissible?: boolean;
  payrollId?: string;
}

export interface PayrollMetadata {
  payrollId?: string;
  id?: string;
  payroll_id?: string;
}
