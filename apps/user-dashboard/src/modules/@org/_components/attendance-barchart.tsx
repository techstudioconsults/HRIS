'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart';
import { Skeleton } from '@workspace/ui/components/skeleton';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import { useDashboardService } from '@/modules/@org/admin/dashboard/services/use-dashboard-service';
import { useDashboardOverviewPeriod } from '@/lib/nuqs/use-dashboard-overview-period';

const STATIC_FALLBACK = [
  { month: 'Jan', present: 250, absent: 55, late: 10 },
  { month: 'Feb', present: 230, absent: 20, late: 50 },
  { month: 'Mar', present: 267, absent: 50, late: 12 },
  { month: 'Apr', present: 280, absent: 8, late: 10 },
  { month: 'May', present: 290, absent: 150, late: 8 },
  { month: 'Jun', present: 300, absent: 4, late: 5 },
  { month: 'Jul', present: 400, absent: 100, late: 5 },
];

const chartConfig = {
  present: { label: 'Present', color: 'var(--chart-2)' },
  absent: { label: 'Absent', color: 'var(--chart-3)' },
  late: { label: 'Late', color: 'var(--primary)' },
} satisfies ChartConfig;

export function AttendanceBarChart() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const [year] = useDashboardOverviewPeriod();
  const { useGetAttendanceOverview } = useDashboardService();
  const { data: monthlyAttendance, isPending } = useGetAttendanceOverview(year);

  if (!isClient || isPending) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <p className="text-muted-foreground text-sm">{year}</p>
        </CardHeader>
        <CardContent className="p-0">
          <Skeleton className="h-75 w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData =
    monthlyAttendance && monthlyAttendance.length > 0
      ? monthlyAttendance.map((monthRecord) => ({
          month: monthRecord.month,
          present: monthRecord.present,
          absent: monthRecord.absent,
          late: monthRecord.late,
        }))
      : STATIC_FALLBACK;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
        <p className="text-muted-foreground text-sm">{year}</p>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-muted-foreground text-sm">{value}</span>
              )}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-[180px]"
                  labelFormatter={(value) => {
                    const monthEntry = chartData.find(
                      (item) => item.month === value
                    );
                    return (
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">{value}</span>
                        {monthEntry && (
                          <div className="grid grid-cols-2 gap-2">
                            <span>Present:</span>
                            <span className="text-right">
                              {monthEntry.present}
                            </span>
                            <span>Absent:</span>
                            <span className="text-right">
                              {monthEntry.absent}
                            </span>
                            <span>Late:</span>
                            <span className="text-right">
                              {monthEntry.late}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey="present"
              fill="var(--color-present)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="absent"
              fill="var(--color-absent)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="late"
              fill="var(--color-late)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
