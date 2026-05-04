import { queryKeys } from '@/lib/react-query/query-keys';
import { createServiceHooks } from '@/lib/react-query/use-service-query';
import { dependencies } from '@/lib/tools/dependencies';

import { DashboardService } from './dashboard.service';

export const useDashboardService = () => {
  const { useServiceQuery } = createServiceHooks<DashboardService>(
    dependencies.DASHBOARD_SERVICE
  );

  const useGetPayrollSummary = (year: number) =>
    useServiceQuery(queryKeys.dashboard.payrollSummary(year), (service) =>
      service.getPayrollSummary(year)
    );

  const useGetAttendanceOverview = (year: number) =>
    useServiceQuery(queryKeys.dashboard.attendanceOverview(year), (service) =>
      service.getAttendanceOverview(year)
    );

  const useGetLeaveDistribution = () =>
    useServiceQuery(queryKeys.dashboard.leaveDistribution(), (service) =>
      service.getLeaveDistribution()
    );

  return {
    useGetPayrollSummary,
    useGetAttendanceOverview,
    useGetLeaveDistribution,
  };
};
