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

  return {
    // Queries
    useGetCompanyPayrollPolicy,
  };
};
