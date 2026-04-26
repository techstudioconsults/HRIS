import { type UseMutationOptions } from '@tanstack/react-query';

/**
 * Extended mutation options that include automatic query invalidation.
 */
export type ServiceMutationOptions<
  TData,
  TVariables,
  TError = Error,
  TContext = unknown,
> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationFn'
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
    context: TContext
  ) => ReadonlyArray<readonly unknown[]> | void;
};
