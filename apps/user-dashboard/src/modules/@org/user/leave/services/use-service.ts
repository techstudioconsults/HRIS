/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from '@/lib/react-query/query-keys';
import { createServiceHooks } from '@/lib/react-query/use-service-query';
import { dependencies } from '@/lib/tools/dependencies';
import type {
  CreateLeaveRequestPayload,
  RejectLeaveRequestPayload,
  UpdateLeaveRequestPayload,
} from '../types';
import { UserLeaveService } from './service';
/**
 * Hook providing all leave service queries and mutations.
 * Handles leave types, leave requests, and related operations.
 */
export const useUserLeaveService = () => {
  const { useServiceQuery, useServiceMutation } =
    createServiceHooks<UserLeaveService>(dependencies.USER_LEAVE_SERVICE);
  // Leave Types
  const useGetLeaveTypes = (filters: Record<string, any> = {}, options?: any) =>
    useServiceQuery(
      queryKeys.leave.types(),
      (service) => service.getLeaveTypes(filters),
      options
    );
  const useGetLeaveTypeById = (id: string, options?: any) =>
    useServiceQuery(
      queryKeys.leave.type(id),
      (service) => service.getLeaveTypeById(id),
      { enabled: !!id, ...options }
    );
  // Leave Requests - Read
  const useGetLeaveRequests = (
    filters: Record<string, any> = {},
    options?: any
  ) =>
    useServiceQuery(
      queryKeys.leave.requests(filters),
      (service) => service.getLeaveRequests(filters),
      options
    );
  const useGetLeaveRequestById = (id: string, options?: any) =>
    useServiceQuery(
      queryKeys.leave.request(id),
      (service) => service.getLeaveRequestById(id),
      { enabled: !!id, ...options }
    );
  // Leave Requests - Write
  const useCreateLeaveRequest = () =>
    useServiceMutation(
      (service, data: CreateLeaveRequestPayload) =>
        service.createLeaveRequest(data),
      { invalidateQueries: () => [['leave', 'requests'] as const] }
    );
  const useUpdateLeaveRequest = () =>
    useServiceMutation(
      (
        service,
        { id, data }: { id: string; data: UpdateLeaveRequestPayload }
      ) => service.updateLeaveRequest(id, data),
      { invalidateQueries: () => [['leave', 'requests'] as const] }
    );
  const useDeleteLeaveRequest = () =>
    useServiceMutation(
      (service, id: string) => service.deleteLeaveRequest(id),
      { invalidateQueries: () => [['leave', 'requests'] as const] }
    );
  // Leave Request Actions
  const useApproveLeaveRequest = () =>
    useServiceMutation(
      (service, id: string) => service.approveLeaveRequest(id),
      { invalidateQueries: () => [['leave', 'requests'] as const] }
    );
  const useRejectLeaveRequest = () =>
    useServiceMutation(
      (
        service,
        { id, data }: { id: string; data: RejectLeaveRequestPayload }
      ) => service.rejectLeaveRequest(id, data),
      { invalidateQueries: () => [['leave', 'requests'] as const] }
    );
  return {
    // Leave Types
    useGetLeaveTypes,
    useGetLeaveTypeById,
    // Leave Requests
    useGetLeaveRequests,
    useGetLeaveRequestById,
    useCreateLeaveRequest,
    useUpdateLeaveRequest,
    useDeleteLeaveRequest,
    // Leave Request Actions
    useApproveLeaveRequest,
    useRejectLeaveRequest,
  };
};
