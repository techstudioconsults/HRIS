/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from '@/lib/react-query/query-keys';
import { createServiceHooks } from '@/lib/react-query/use-service-query';
import { dependencies } from '@/lib/tools/dependencies';

import { UserPayslipService } from './service';

export const useUserPayslipService = () => {
  const { useServiceQuery } = createServiceHooks<UserPayslipService>(
    dependencies.USER_PAYSLIP_SERVICE
  );

  const useGetPayslips = (filters: Filters = {}, options?: any) =>
    useServiceQuery(
      queryKeys.userPayslip.list(filters),
      (service) => service.getPayslips(filters),
      options
    );

  const useGetPayslipById = (payslipId: string, options?: any) =>
    useServiceQuery(
      queryKeys.userPayslip.details(payslipId),
      (service) => service.getPayslipById(payslipId),
      { enabled: !!payslipId, ...options }
    );

  return {
    useGetPayslips,
    useGetPayslipById,
  };
};
