/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import { PayrollService } from "./service";

export const usePayrollService = () => {
  const { useServiceQuery } = createServiceHooks<PayrollService>(dependencies.PAYROLL_SERVICE);

  // Queries
  const useGetCompanyPayrollPolicy = (options?: any) =>
    useServiceQuery(queryKeys.payroll.policy(), (service) => service.getCompanyPayrollPolicy(), options);

  const useGetAllPayrolls = (filters: Filters = {}, options?: any) =>
    useServiceQuery(queryKeys.payroll.list(filters), (service) => service.getAllPayrolls(filters), options);

  const useDownloadPayrolls = (options?: any) =>
    useServiceQuery(queryKeys.payroll.download({}), (service) => service.downloadPayrolls(), options);

  return {
    // Queries
    useGetCompanyPayrollPolicy,
    useGetAllPayrolls,
    useDownloadPayrolls,
  };
};
