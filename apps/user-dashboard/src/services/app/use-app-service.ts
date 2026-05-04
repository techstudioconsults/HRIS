import { queryKeys } from '@/lib/react-query/query-keys';
import { createServiceHooks } from '@/lib/react-query/use-service-query';
import { dependencies } from '@/lib/tools/dependencies';

import { AppService, mapNotificationDTO } from '@/services/app/app.service';

export const useAppService = () => {
  const { useServiceQuery } = createServiceHooks<AppService>(
    dependencies.APP_SERVICE
  );

  // Queries
  // const useGetAllProducts = () =>
  //   useServiceQuery(queryKeys.product.list(), (service) =>
  //     service.getAllProducts(``)
  //   );

  const useGetNotifications = (employeeId: string | undefined) =>
    useServiceQuery(
      queryKeys.notification.list(employeeId ?? ''),
      (service) => service.getAllNotifications(employeeId ?? ''),
      {
        enabled: !!employeeId,
        select: (envelope) => envelope.data.map(mapNotificationDTO),
      }
    );

  // Mutations would go here
  // const useCreateProduct = () => useServiceMutation(...)

  return {
    // Queries
    // useGetAllProducts,
    useGetNotifications,

    // Mutations
  };
};
