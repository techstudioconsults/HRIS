import { HttpAdapter } from '@/lib/http/http-adapter';

import type {
  Notification,
  NotificationType,
} from '@workspace/ui/lib/notification-widget';

/** Raw shape returned by the backend notification API */
export interface AppNotification {
  id: string;
  type: string;
  notifiableId: string;
  data: {
    body: string;
    title: string;
    metadata?: Record<string, string>;
  };
  isRead: boolean;
  createdAt: string;
}

export interface ApiEnvelope<T> {
  success?: boolean;
  status?: string;
  message?: string;
  data: T;
  errors?: unknown[];
  timestamp?: string;
}

function resolveNotificationType(eventType: string): NotificationType {
  switch (eventType) {
    case 'wallet.topup':
    case 'wallet.created.success':
    case 'payroll.approve.success':
    case 'payroll.completed':
    case 'salary.paid':
      return 'success';
    case 'payroll.approve.rejected':
      return 'error';
    case 'payroll.approve.request':
    case 'payroll.status':
    default:
      return 'info';
  }
}

function resolveActionUrl(
  eventType: string,
  metadata?: Record<string, string>
): string | undefined {
  // salary.paid notifications target the employee's own payslip page
  if (eventType === 'salary.paid') return '/user/payslip';
  // payroll approval events target the admin payroll page
  if (metadata?.payrollId || metadata?.payroll_id) return '/admin/payroll';
  if (eventType === 'wallet.topup' || eventType === 'wallet.created.success')
    return '/admin/payroll';
  return undefined;
}

export function mapAppNotification(dto: AppNotification): Notification {
  return {
    id: dto.id,
    title: dto.data.title,
    message: dto.data.body,
    type: resolveNotificationType(dto.type),
    timestamp: new Date(dto.createdAt),
    read: dto.isRead,
    actionUrl: resolveActionUrl(dto.type, dto.data.metadata),
  };
}

export class AppService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getAllNotifications(): Promise<ApiEnvelope<AppNotification[]>> {
    const response =
      await this.http.get<ApiEnvelope<AppNotification[]>>(`/notifications`);
    if (!response || response.status !== 200) {
      throw new Error(
        `Failed to fetch notifications: HTTP ${response?.status ?? 'no response'}`
      );
    }
    return response.data;
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    const response = await this.http.patch<void>(
      `/notifications/${notificationId}/read`,
      {}
    );
    if (!response || (response.status !== 200 && response.status !== 204)) {
      throw new Error(
        `Failed to mark notification ${notificationId} as read: HTTP ${response?.status ?? 'no response'}`
      );
    }
  }

  async markAllNotificationsRead(): Promise<void> {
    const response = await this.http.patch<void>(`/notifications/read-all`, {});
    if (!response || (response.status !== 200 && response.status !== 204)) {
      throw new Error(
        `Failed to mark all notifications as read: HTTP ${response?.status ?? 'no response'}`
      );
    }
  }

  async clearAllNotifications(): Promise<void> {
    const response = await this.http.delete<void>(`/notifications`);
    if (!response || (response.status !== 200 && response.status !== 204)) {
      throw new Error(
        `Failed to clear notifications: HTTP ${response?.status ?? 'no response'}`
      );
    }
  }
}
