// hooks/use-service-query.ts
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";

import { container } from "../tools/dependencies";

export function createServiceHooks<TService>(serviceSymbol: symbol) {
  const useService = (): TService => {
    return container.get<TService>(serviceSymbol);
  };

  const useServiceQuery = <TData, TError = Error>(
    queryKey: readonly unknown[],
    serviceMethod: (service: TService) => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
  ) => {
    const service = useService();
    return useQuery<TData, TError>({
      queryKey,
      queryFn: () => serviceMethod(service),
      ...options,
    });
  };

  const useServiceMutation = <TData, TVariables, TError = Error>(
    serviceMethod: (service: TService, variables: TVariables) => Promise<TData>,
    options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">,
  ) => {
    const service = useService();
    return useMutation<TData, TError, TVariables>({
      mutationFn: (variables) => serviceMethod(service, variables),
      ...options,
    });
  };

  return { useServiceQuery, useServiceMutation };
}
