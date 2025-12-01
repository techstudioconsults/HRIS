"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Payroll data from your Figma design
const payrollData = [
  { month: "Jan", amount: 5_000_000 },
  { month: "Feb", amount: 5_500_000 },
  { month: "Mar", amount: 5_000_000 },
  { month: "Apr", amount: 6_500_000 },
  { month: "May", amount: 7_000_000 },
  { month: "Jun", amount: 6_789_000 }, // N5,789,000 from your Figma
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("NGN", "₦");
};

export function PayrollLineChart() {
  return (
    <Card className="bg-background w-full shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Monthly Payroll Summary</CardTitle>
        {/* <p className="text-sm text-gray-500">This year</p> */}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={payrollData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E0E0E0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#333333", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#333333", fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value).replace("₦", "")}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    return (
                      <div className="rounded-md border border-gray-200 bg-white p-3 shadow-md">
                        <p className="font-semibold">{payload[0].payload.month}</p>
                        <p className="text-blue-600">{formatCurrency(payload[0].payload.amount)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmount)"
                activeDot={{ r: 6, fill: "#3B82F6", strokeWidth: 2, stroke: "#FFFFFF" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
