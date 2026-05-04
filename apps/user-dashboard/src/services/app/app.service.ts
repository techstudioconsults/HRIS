import { HttpAdapter } from '@/lib/http/http-adapter';

import type {
  Notification,
  NotificationType,
} from '@workspace/ui/lib/notification-widget';

export interface NotificationDTO {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
}

export interface ApiEnvelope<T> {
  status: string;
  message?: string;
  data: T;
  errors?: unknown[];
  timestamp: string;
}

export function mapNotificationDTO(dto: NotificationDTO): Notification {
  return {
    ...dto,
    timestamp: new Date(dto.timestamp),
  };
}

export class AppService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getAllNotifications(
    employeeId: string
  ): Promise<ApiEnvelope<NotificationDTO[]>> {
    const response = await this.http.get<ApiEnvelope<NotificationDTO[]>>(
      `/notifications/users/${employeeId}`
    );
    if (!response || response.status !== 200) {
      throw new Error(
        `Failed to fetch notifications for employee ${employeeId}: HTTP ${response?.status ?? 'no response'}`
      );
    }
    return response.data;
  }

  async getAllPayrollNotifications(
    payrollId: string
  ): Promise<ApiEnvelope<NotificationDTO[]>> {
    const response = await this.http.get<ApiEnvelope<NotificationDTO[]>>(
      `/notifications/payrolls/${payrollId}`
    );
    if (!response || response.status !== 200) {
      throw new Error(
        `Failed to fetch payroll notifications for payroll ${payrollId}: HTTP ${response?.status ?? 'no response'}`
      );
    }
    return response.data;
  }
}
