import type { Notification } from '@workspace/ui/lib/notification-widget';

export type TopBarProperties = {
  adminName: string;
  adminEmail?: string;
  adminAvatar?: string;
  adminRole?: string;
  notifications?: Notification[];
  className?: string;
  showSidebarTrigger?: boolean;
  sticky?: boolean;
};
