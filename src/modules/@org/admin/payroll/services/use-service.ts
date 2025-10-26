/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import { PayrollService } from "./service";

export const usePayrollService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<PayrollService>(dependencies.PAYROLL_SERVICE);

  // Queries
  const useGetAllPayrolls = (filters: IFilters = Object.create({ page: 1 }), options?: any) =>
    useServiceQuery(queryKeys.payroll.list(filters), (service) => service.getAllPayrolls(filters), options);

  const useGetPayrollById = (id: string, options?: any) =>
    useServiceQuery(queryKeys.payroll.details(id), (service) => service.getPayrollById(id), options);

  const useDownloadPayrolls = (filters: IFilters = Object.create({ page: 1 }), options?: any) =>
    useServiceQuery(queryKeys.payroll.download(filters), (service) => service.downloadPayrolls(filters), options);

  // Mutations
  const useCreatePayroll = () =>
    useServiceMutation((service, data: any) => service.createPayroll(data), {
      onSuccess: () => {
        return [queryKeys.payroll.list()];
      },
    });

  const useUpdatePayroll = () =>
    useServiceMutation((service, { id, data }: { id: string; data: any }) => service.updatePayroll(id, data), {
      onSuccess: (_, { id }) => {
        return [queryKeys.payroll.details(id), queryKeys.payroll.list()];
      },
    });

  const useDeletePayroll = () =>
    useServiceMutation((service, id: string) => service.deletePayroll(id), {
      onSuccess: () => {
        return [queryKeys.payroll.list()];
      },
    });

  return {
    // Queries
    useGetAllPayrolls,
    useGetPayrollById,
    useDownloadPayrolls,

    // Mutations
    useCreatePayroll,
    useUpdatePayroll,
    useDeletePayroll,
  };
};
