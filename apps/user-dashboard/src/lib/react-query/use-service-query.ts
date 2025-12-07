// hooks/use-service-query.ts
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
  useSuspenseQuery,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";

import { container } from "../tools/dependencies";

/**
 * Extended mutation options that include automatic query invalidation
 */
type ServiceMutationOptions<TData, TVariables, TError = Error, TContext = unknown> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  "mutationFn"
> & {
  /**
   * Optional function to return query keys to invalidate after successful mutation.
   * This keeps cache management separate from business logic in onSuccess.
   *
   * @param data - The data returned from the mutation
   * @param variables - The variables passed to the mutation
   * @param context - The context value from onMutate
   * @returns Array of query keys to invalidate, or void/undefined to skip invalidation
   */
  invalidateQueries?: (
    data: TData,
    variables: TVariables,
    context: TContext,
  ) => ReadonlyArray<readonly unknown[]> | void;
};

/**
 * Creates React Query hooks for a specific service
 * @param serviceSymbol - The dependency injection symbol for the service
 * @returns Object containing useServiceQuery and useServiceMutation hooks
 */
export function createServiceHooks<TService>(serviceSymbol: symbol) {
  /**
   * Hook to get the service instance from the DI container
   */
  const useService = (): TService => {
    return container.get<TService>(serviceSymbol);
  };

  /**
   * Hook for creating service-based queries
   * @param queryKey - Unique key for the query
   * @param serviceMethod - Method to call on the service
   * @param options - Additional query options
   */
  const useServiceQuery = <TData, TError = Error>(
    queryKey: readonly unknown[],
    serviceMethod: (service: TService) => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
  ): UseQueryResult<TData, TError> => {
    const service = useService();
    return useQuery<TData, TError>({
      queryKey,
      queryFn: () => serviceMethod(service),
      ...options,
    });
  };

  /**
   * Hook for creating service-based suspense queries (for use with React Suspense)
   * @param queryKey - Unique key for the query
   * @param serviceMethod - Method to call on the service
   * @param options - Additional query options
   */
  const useSuspenseServiceQuery = <TData, TError = Error>(
    queryKey: readonly unknown[],
    serviceMethod: (service: TService) => Promise<TData>,
    options?: Omit<UseSuspenseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
  ): UseSuspenseQueryResult<TData, TError> => {
    const service = useService();
    return useSuspenseQuery<TData, TError>({
      queryKey,
      queryFn: () => serviceMethod(service),
      ...options,
    });
  };

  /**
   * Hook for creating service-based mutations with automatic query invalidation
   * @param serviceMethod - Method to call on the service
   * @param options - Mutation options including optional invalidateQueries function
   */
  const useServiceMutation = <TData, TVariables, TError = Error, TContext = unknown>(
    serviceMethod: (service: TService, variables: TVariables) => Promise<TData>,
    options?: ServiceMutationOptions<TData, TVariables, TError, TContext>,
  ): UseMutationResult<TData, TError, TVariables, TContext> => {
    const service = useService();
    const queryClient = useQueryClient();

    // Extract custom options to avoid conflicts
    const { onSuccess, invalidateQueries, ...restOptions } = options || {};

    return useMutation<TData, TError, TVariables, TContext>({
      mutationFn: (variables) => serviceMethod(service, variables),
      ...restOptions,
      onSuccess: async (data, variables, context, meta) => {
        // Handle query invalidation if specified
        if (invalidateQueries) {
          const queryKeysToInvalidate = invalidateQueries(data, variables, context);
          if (queryKeysToInvalidate && Array.isArray(queryKeysToInvalidate)) {
            // Invalidate all specified queries
            await Promise.all(queryKeysToInvalidate.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
          }
        }

        // Call the original onSuccess callback if provided
        await onSuccess?.(data, variables, context, meta);
      },
    });
  };

  return { useServiceQuery, useSuspenseServiceQuery, useServiceMutation };
}
