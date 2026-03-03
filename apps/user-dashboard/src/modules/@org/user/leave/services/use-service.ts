/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from '@/lib/react-query/query-keys';
import { createServiceHooks } from '@/lib/react-query/use-service-query';
import { dependencies } from '@/lib/tools/dependencies';
import type { CreateLeaveRequestPayload } from '../types';
import { UserLeaveService } from './service';

export const useUserLeaveService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<UserLeaveService>(dependencies.USER_LEAVE_SERVICE);
  // =============================
  // Leave Types - User can view only
  // =============================
  const useGetLeaveTypes = (filters: Record<string, any> = {}, options?: any) =>
    useServiceQuery(queryKeys.leave.types(), (service) => service.getLeaveTypes(filters), options);

  const useGetLeaveTypeById = (id: string, options?: any) =>
    useServiceQuery(queryKeys.leave.type(id), (service) => service.getLeaveTypeById(id), {
      enabled: !!id,
      ...options,
    });
  // =============================
  // Leave Requests - User can create and view their own
  // =============================
  const useGetLeaveRequests = (filters: Record<string, any> = {}, options?: any) =>
    useServiceQuery(queryKeys.leave.requests(filters), (service) => service.getLeaveRequests(filters), options);

  const useCreateLeaveRequest = () =>
    useServiceMutation((service, data: CreateLeaveRequestPayload) => service.createLeaveRequest(data), {
      invalidateQueries: () => [queryKeys.leave.requests({})],
    });

  const useGetLeaveRequestById = (id: string, options?: any) =>
    useServiceQuery(queryKeys.leave.request(id), (service) => service.getLeaveRequestById(id), {
      enabled: !!id,
      ...options,
    });
  return {
    // Leave Types
    useGetLeaveTypes,
    useGetLeaveTypeById,
    // Leave Requests
    useGetLeaveRequests,
    useCreateLeaveRequest,
    useGetLeaveRequestById,
  };
};
