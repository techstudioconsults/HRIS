'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS } from '@/lib/chart-colors';
import { useDashboardService } from '@/modules/@org/admin/dashboard/services/use-dashboard-service';

const FILL_CYCLE = [
  CHART_COLORS.navy,
  CHART_COLORS.green,
  CHART_COLORS.amber,
  CHART_COLORS.purple,
  CHART_COLORS.blue,
] as const;

const STATIC_FALLBACK = [
  { name: 'Product', leaves: 23, percentage: 25, fill: CHART_COLORS.navy },
  { name: 'Sales', leaves: 18, percentage: 20, fill: CHART_COLORS.green },
  { name: 'Marketing', leaves: 15, percentage: 16, fill: CHART_COLORS.amber },
  {
    name: 'Engineering',
    leaves: 34,
    percentage: 37,
    fill: CHART_COLORS.purple,
  },
];

export function LeaveDistributionPieChart() {
  const { useGetLeaveDistribution } = useDashboardService();
  const { data: distributionEntries, isPending } = useGetLeaveDistribution();

  if (isPending) {
    return (
      <Card className="w-full shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Leave Distribution by Teams
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-0">
          <Skeleton className="h-[250px] w-full" />
          <div className="grid w-full grid-cols-4 gap-2 px-4 pb-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData =
    distributionEntries && distributionEntries.length > 0
      ? distributionEntries.map((entry, index) => ({
          name: entry.name,
          leaves: entry.leaves,
          percentage: entry.percentage,
          fill: FILL_CYCLE[index % FILL_CYCLE.length] ?? CHART_COLORS.blue,
        }))
      : STATIC_FALLBACK;

  return (
    <Card className="w-full shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Leave Distribution by Teams
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 p-0">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                dataKey="leaves"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length > 0) {
                    const item = payload[0]
                      ?.payload as (typeof chartData)[number];
                    return (
                      <div className="rounded-md border border-gray-200 bg-background p-3 shadow-md">
                        <p className="font-semibold">{item.name}</p>
                        <p>Leaves: {item.leaves}</p>
                        <p>{item.percentage}% of total</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid w-full grid-cols-2 items-center justify-between gap-2 md:grid-cols-3 md:px-4 lg:grid-cols-4">
          {chartData.map((team) => (
            <div
              key={team.name}
              className="flex flex-col w-full items-center justify-center gap-2 md:justify-start"
            >
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: team.fill }}
              />
              <span className="text-xs font-medium">{team.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
