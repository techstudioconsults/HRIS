/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from '@/lib/react-query/query-keys';
import { createServiceHooks } from '@/lib/react-query/use-service-query';
import { dependencies } from '@/lib/tools/dependencies';

import { UserProfileService } from './service';

export const useUserProfileService = () => {
  const { useServiceQuery, useServiceMutation } =
    createServiceHooks<UserProfileService>(dependencies.USER_PROFILE_SERVICE);

  const useGetMyProfile = (employeeId: string, options?: any) =>
    useServiceQuery(
      queryKeys.profile.current(),
      (service) => service.getMyProfile(employeeId),
      { enabled: !!employeeId, ...options }
    );

  const useUpdateMyProfile = () =>
    useServiceMutation(
      (service, variables: { employeeId: string; data: FormData }) =>
        service.updateMyProfile(variables.employeeId, variables.data),
      {
        invalidateQueries: () => [queryKeys.profile.current()],
      }
    );

  return {
    useGetMyProfile,
    useUpdateMyProfile,
  };
};
