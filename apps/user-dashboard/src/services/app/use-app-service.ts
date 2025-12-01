import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import { AppService } from "./app.service";

export const useAppService = () => {
  const { useServiceQuery } = createServiceHooks<AppService>(dependencies.APP_SERVICE);

  // Queries
  const useGetAllProducts = () => useServiceQuery(queryKeys.product.list(), (service) => service.getAllProducts());

  // Mutations would go here
  // const useCreateProduct = () => useServiceMutation(...)

  return {
    // Queries
    useGetAllProducts,

    // Mutations
  };
};
