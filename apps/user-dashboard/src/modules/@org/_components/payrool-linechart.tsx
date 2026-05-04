'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_COLORS } from '@/lib/chart-colors';
import { useDashboardService } from '@/modules/@org/admin/dashboard/services/use-dashboard-service';

const STATIC_FALLBACK = [
  { month: 'Jan', amount: 5_000_000 },
  { month: 'Feb', amount: 5_500_000 },
  { month: 'Mar', amount: 5_000_000 },
  { month: 'Apr', amount: 6_500_000 },
  { month: 'May', amount: 7_000_000 },
  { month: 'Jun', amount: 6_789_000 },
];

function formatCurrencyShort(value: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('NGN', '₦');
}

export function PayrollLineChart() {
  const currentYear = new Date().getFullYear();
  const { useGetPayrollSummary } = useDashboardService();
  const { data: monthlySummary, isPending } = useGetPayrollSummary(currentYear);

  if (isPending) {
    return (
      <Card className="w-full shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Monthly Payroll Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData =
    monthlySummary && monthlySummary.length > 0
      ? monthlySummary.map((monthRecord) => ({
          month: monthRecord.month,
          amount: monthRecord.total,
        }))
      : STATIC_FALLBACK;

  return (
    <Card className="w-full shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Monthly Payroll Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.blue}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.blue}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke={CHART_COLORS.grid}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  formatCurrencyShort(value as number).replace('₦', '')
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const payloadItem = payload[0]?.payload as {
                      month: string;
                      amount: number;
                    };
                    return (
                      <div className="rounded-md border border-gray-200 p-3 shadow-md">
                        <p className="font-semibold">{payloadItem.month}</p>
                        <p className="text-blue-600">
                          {formatCurrencyShort(payloadItem.amount)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={CHART_COLORS.blue}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmount)"
                activeDot={{
                  r: 6,
                  fill: CHART_COLORS.blue,
                  strokeWidth: 2,
                  stroke: CHART_COLORS.white,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
