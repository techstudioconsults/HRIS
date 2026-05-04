'use client';

import { useMemo } from 'react';
import { CardGroup } from '../../../_components/card-group';
import { DashboardCard } from '../../../_components/dashboard-card';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useRouter } from 'next/navigation';
import { useEmployeeService } from '@/modules/@org/admin/employee/services/use-service';
import { useLeaveService } from '@/modules/@org/admin/leave/services/use-service';
import { useDashboardService } from '@/modules/@org/admin/dashboard/services/use-dashboard-service';
import { formatCurrency } from '@/lib/formatters';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const CardSection = () => {
  const navigate = useRouter();
  const currentYear = new Date().getFullYear();

  const { useGetAllEmployees } = useEmployeeService();
  const { useGetLeaveRequests } = useLeaveService();
  const { useGetPayrollSummary, useGetAttendanceOverview } =
    useDashboardService();

  const { data: employeesResponse, isPending: isEmployeesPending } =
    useGetAllEmployees({ limit: 1000 });
  const { data: leaveRequestsResponse, isPending: isLeavesPending } =
    useGetLeaveRequests({ status: 'pending', limit: 1000 });
  const { data: payrollMonths, isPending: isPayrollPending } =
    useGetPayrollSummary(currentYear);
  const { data: attendanceMonths, isPending: isAttendancePending } =
    useGetAttendanceOverview(currentYear);

  const newJoinersCount = useMemo(() => {
    if (!employeesResponse) return 0;
    const cutoffDate = new Date(Date.now() - THIRTY_DAYS_MS);
    return employeesResponse.data.items.filter(
      (employee) => new Date(employee.createdAt) >= cutoffDate
    ).length;
  }, [employeesResponse]);

  const pendingLeaveCount = leaveRequestsResponse?.data.items.length ?? 0;

  const totalNetPay = useMemo(() => {
    if (!payrollMonths) return 0;
    return payrollMonths.reduce(
      (sum, monthRecord) => sum + monthRecord.total,
      0
    );
  }, [payrollMonths]);

  const attendanceRate = useMemo(() => {
    if (!attendanceMonths) return null;
    const totalPresent = attendanceMonths.reduce(
      (sum, monthRecord) => sum + monthRecord.present,
      0
    );
    const totalAbsent = attendanceMonths.reduce(
      (sum, monthRecord) => sum + monthRecord.absent,
      0
    );
    const totalLate = attendanceMonths.reduce(
      (sum, monthRecord) => sum + monthRecord.late,
      0
    );
    const total = totalPresent + totalAbsent + totalLate;
    if (total === 0) return null;
    return Math.round((totalPresent / total) * 100);
  }, [attendanceMonths]);

  return (
    <CardGroup>
      <DashboardCard
        title="Payroll Summary"
        value={
          isPayrollPending ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            formatCurrency(totalNetPay)
          )
        }
        showTrendIcon={true}
        trend="up"
        icon={<Icon name="Briefcase" />}
        iconVariant="warning"
      />
      <DashboardCard
        title="Pending Leave Request"
        value={
          isLeavesPending ? (
            <Skeleton className="h-8 w-12" />
          ) : (
            pendingLeaveCount
          )
        }
        actionText="View all"
        onAction={() => navigate.push('/admin/leave')}
        icon={<Icon name="Calendar" />}
        iconVariant="primary"
      />
      <DashboardCard
        title="New Joiners"
        value={
          isEmployeesPending ? (
            <Skeleton className="h-8 w-12" />
          ) : (
            newJoinersCount
          )
        }
        icon={<Icon name="People" />}
        iconVariant="success"
      />
      <DashboardCard
        title="Click-In Summary"
        value={
          isAttendancePending ? (
            <Skeleton className="h-8 w-16" />
          ) : attendanceRate !== null ? (
            `${attendanceRate}%`
          ) : (
            'N/A'
          )
        }
        icon={<Icon name="Clock" />}
        iconVariant="purple-500"
      />
    </CardGroup>
  );
};
