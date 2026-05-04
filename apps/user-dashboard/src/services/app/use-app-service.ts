import { queryKeys } from '@/lib/react-query/query-keys';
import { createServiceHooks } from '@/lib/react-query/use-service-query';
import { dependencies } from '@/lib/tools/dependencies';

import { AppService, mapAppNotification } from '@/services/app/app.service';

export const useAppService = () => {
  const { useServiceQuery, useServiceMutation } =
    createServiceHooks<AppService>(dependencies.APP_SERVICE);

  // employeeId is only used for query-cache isolation — the endpoint is token-scoped
  const useGetNotifications = (employeeId: string | undefined) =>
    useServiceQuery(
      queryKeys.notification.list(employeeId ?? ''),
      (service) => service.getAllNotifications(),
      {
        enabled: !!employeeId,
        select: (envelope) => envelope.data.map(mapAppNotification),
      }
    );

  const useMarkNotificationRead = (employeeId: string | undefined) =>
    useServiceMutation(
      (service, notificationId: string) =>
        service.markNotificationRead(notificationId),
      {
        invalidateQueries: () => [
          queryKeys.notification.list(employeeId ?? ''),
        ],
      }
    );

  const useMarkAllNotificationsRead = (employeeId: string | undefined) =>
    useServiceMutation(
      (service, _: void) => service.markAllNotificationsRead(),
      {
        invalidateQueries: () => [
          queryKeys.notification.list(employeeId ?? ''),
        ],
      }
    );

  const useClearAllNotifications = (employeeId: string | undefined) =>
    useServiceMutation((service, _: void) => service.clearAllNotifications(), {
      invalidateQueries: () => [queryKeys.notification.list(employeeId ?? '')],
    });

  return {
    useGetNotifications,
    useMarkNotificationRead,
    useMarkAllNotificationsRead,
    useClearAllNotifications,
  };
};
