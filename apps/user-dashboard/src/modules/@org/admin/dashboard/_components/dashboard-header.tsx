'use client';

import { useMemo, useTransition } from 'react';
import { saveAs } from 'file-saver';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { ComboBox } from '@workspace/ui/lib/select-dropdown/combo-box';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useSession } from '@/lib/session';
import Link from 'next/link';
import { routes } from '@/lib/routes/routes';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { useEmployeeService } from '@/modules/@org/admin/employee/services/use-service';
import { useLeaveService } from '@/modules/@org/admin/leave/services/use-service';
import { useDashboardService } from '@/modules/@org/admin/dashboard/services/use-dashboard-service';
import { formatCurrency } from '@/lib/formatters';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function buildDashboardCsv(params: {
  year: number;
  payrollMonths: readonly { month: string; total: number }[] | undefined;
  attendanceMonths:
    | readonly {
        month: string;
        present: number;
        absent: number;
        late: number;
      }[]
    | undefined;
  distributionEntries:
    | readonly { name: string; leaves: number; percentage: number }[]
    | undefined;
  newJoinersCount: number;
  pendingLeaveCount: number;
  totalNetPay: number;
  attendanceRate: number | null;
}): string {
  const {
    year,
    payrollMonths,
    attendanceMonths,
    distributionEntries,
    newJoinersCount,
    pendingLeaveCount,
    totalNetPay,
    attendanceRate,
  } = params;

  const exportedAt = new Date().toLocaleString('en-NG', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const lines: string[] = [];

  lines.push(`HRIS Dashboard Summary,Exported: ${exportedAt}`);
  lines.push('');

  // ── Summary Metrics ──────────────────────────────────────────────────────
  lines.push('SUMMARY METRICS');
  lines.push('Metric,Value');
  lines.push(`New Joiners (Last 30 Days),${newJoinersCount}`);
  lines.push(`Pending Leave Requests,${pendingLeaveCount}`);
  lines.push(`Total Net Pay (${year}),${formatCurrency(totalNetPay)}`);
  lines.push(
    `Attendance Rate (${year}),${attendanceRate !== null ? `${attendanceRate}%` : 'N/A'}`
  );
  lines.push('');

  // ── Payroll Summary ───────────────────────────────────────────────────────
  lines.push(`PAYROLL SUMMARY (${year})`);
  lines.push('Month,Net Pay (NGN)');
  if (payrollMonths && payrollMonths.length > 0) {
    for (const monthRecord of payrollMonths) {
      lines.push(`${monthRecord.month},${monthRecord.total}`);
    }
  } else {
    lines.push('No payroll data available,');
  }
  lines.push('');

  // ── Attendance Overview ───────────────────────────────────────────────────
  lines.push(`ATTENDANCE OVERVIEW (${year})`);
  lines.push('Month,Present,Absent,Late');
  if (attendanceMonths && attendanceMonths.length > 0) {
    for (const monthRecord of attendanceMonths) {
      lines.push(
        `${monthRecord.month},${monthRecord.present},${monthRecord.absent},${monthRecord.late}`
      );
    }
  } else {
    lines.push('No attendance data available,,,');
  }
  lines.push('');

  // ── Leave Distribution ────────────────────────────────────────────────────
  lines.push('LEAVE DISTRIBUTION BY TEAM');
  lines.push('Team,Total Leaves,Percentage (%)');
  if (distributionEntries && distributionEntries.length > 0) {
    for (const entry of distributionEntries) {
      lines.push(`${entry.name},${entry.leaves},${entry.percentage}`);
    }
  } else {
    lines.push('No leave distribution data available,,');
  }

  return lines.join('\n');
}

export const DashboardHeader = () => {
  const [isExporting, startExportTransition] = useTransition();
  const { data: session, status } = useSession();

  const currentYear = new Date().getFullYear();

  const { useGetAllEmployees } = useEmployeeService();
  const { useGetLeaveRequests } = useLeaveService();
  const {
    useGetPayrollSummary,
    useGetAttendanceOverview,
    useGetLeaveDistribution,
  } = useDashboardService();

  const { data: employeesResponse } = useGetAllEmployees({ limit: 1000 });
  const { data: leaveRequestsResponse } = useGetLeaveRequests({
    status: 'pending',
    limit: 1000,
  });
  const { data: payrollMonths } = useGetPayrollSummary(currentYear);
  const { data: attendanceMonths } = useGetAttendanceOverview(currentYear);
  const { data: distributionEntries } = useGetLeaveDistribution();

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

  const handleExport = () => {
    startExportTransition(() => {
      const csvContent = buildDashboardCsv({
        year: currentYear,
        payrollMonths,
        attendanceMonths,
        distributionEntries,
        newJoinersCount,
        pendingLeaveCount,
        totalNetPay,
        attendanceRate,
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `dashboard-summary-${currentYear}.csv`);
    });
  };

  return (
    <div
      className={cn(
        'flex lg:items-center flex-col lg:flex-row lg:justify-between xl:pb-6'
      )}
    >
      <div className="min-h-22 py-3">
        {status === 'loading' ? (
          <>
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-5 w-64" />
          </>
        ) : session ? (
          <>
            <h4>Hi {`${session.user.employee.fullName}`},</h4>
            <p>Manage your team with confidence today.</p>
          </>
        ) : null}
      </div>

      <div className="flex justify-between items-center gap-4">
        <ComboBox
          options={[]}
          value={undefined}
          onValueChange={() => {}}
          placeholder="Select overview period"
          triggerClassName="lg:w-[20rem] w-full"
          disabled
        />

        {/* Desktop CTAs */}
        <MainButton
          variant="primaryOutline"
          className="hidden lg:flex text-primary"
          isLeftIconVisible={true}
          icon={<Icon name="DocumentDownload" variant="Outline" />}
          onClick={handleExport}
          isLoading={isExporting}
        >
          Export
        </MainButton>

        <MainButton
          variant="primary"
          isLeftIconVisible={true}
          icon={<Icon variant="Bold" name="Add" />}
          href={routes.admin.employees.add()}
          className="hidden lg:flex w-full"
        >
          Add Employee
        </MainButton>

        {/* Mobile CTA dropdown */}
        <div className="flex lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="shadow rounded-md p-2.5"
                variant="default"
              >
                <Icon
                  name="More"
                  size={20}
                  variant="Outline"
                  className="text-primary rotate-90"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background text-primary shadow-none flex flex-col gap-2 p-3 w-52"
            >
              <DropdownMenuItem onSelect={handleExport}>
                <Icon
                  name="DocumentDownload"
                  variant="Outline"
                  className="text-primary"
                />
                Export Summary
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/employees/add-employee">
                  <Icon name="Add" variant="Bold" className="text-primary" />
                  Add Employee
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
