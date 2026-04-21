/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from '@/lib/react-query/query-keys';
import { createServiceHooks } from '@/lib/react-query/use-service-query';
import { dependencies } from '@/lib/tools/dependencies';

import type {
  CreateLeaveTypePayload,
  RejectLeaveRequestPayload,
  UpdateLeaveTypePayload,
} from '../types';
import { LeaveService } from './service';

export const useLeaveService = () => {
  const { useServiceQuery, useServiceMutation } =
    createServiceHooks<LeaveService>(dependencies.LEAVE_SERVICE);

  // =============================
  // Leave Types
  // =============================

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
      {
        enabled: !!id,
        ...options,
      }
    );

  const useCreateLeaveType = () =>
    useServiceMutation(
      (service, data: CreateLeaveTypePayload) => service.createLeaveType(data),
      {
        invalidateQueries: () => [queryKeys.leave.types()],
      }
    );

  const useUpdateLeaveType = () =>
    useServiceMutation(
      (service, { id, data }: { id: string; data: UpdateLeaveTypePayload }) =>
        service.updateLeaveType(id, data),
      {
        invalidateQueries: (_, { id }) => [
          queryKeys.leave.types(),
          queryKeys.leave.type(id),
        ],
      }
    );

  const useDeleteLeaveType = () =>
    useServiceMutation((service, id: string) => service.deleteLeaveType(id), {
      invalidateQueries: () => [queryKeys.leave.types()],
    });

  // =============================
  // Leave Requests
  // =============================

  const useGetLeaveRequests = (
    filters: Record<string, any> = {},
    options?: any
  ) =>
    useServiceQuery(
      queryKeys.leave.requests(filters),
      (service) => service.getLeaveRequests(filters),
      options
    );

  const useApproveLeaveRequest = () =>
    useServiceMutation(
      (service, id: string) => service.approveLeaveRequest(id),
      {
        invalidateQueries: () => [['leave', 'requests'] as const],
      }
    );

  const useRejectLeaveRequest = () =>
    useServiceMutation(
      (
        service,
        { id, data }: { id: string; data: RejectLeaveRequestPayload }
      ) => service.rejectLeaveRequest(id, data),
      {
        invalidateQueries: () => [['leave', 'requests'] as const],
      }
    );

  return {
    // Leave Types
    useGetLeaveTypes,
    useGetLeaveTypeById,
    useCreateLeaveType,
    useUpdateLeaveType,
    useDeleteLeaveType,

    // Leave Requests
    useGetLeaveRequests,
    useApproveLeaveRequest,
    useRejectLeaveRequest,
  };
};

// NOTE: kept API-compatible export name `useLeaveService`.
