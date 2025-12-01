"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@workspace/ui/components/chart";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

// Sample attendance data by month
const attendanceData = [
  {
    month: "Jan",
    present: 250,
    absent: 55,
    late: 10,
  },
  {
    month: "Feb",
    present: 230,
    absent: 20,
    late: 50,
  },
  {
    month: "Mar",
    present: 267,
    absent: 50,
    late: 12,
  },
  {
    month: "Apr",
    present: 280,
    absent: 8,
    late: 10,
  },
  {
    month: "May",
    present: 290,
    absent: 150,
    late: 8,
  },
  {
    month: "Jun",
    present: 300,
    absent: 4,
    late: 5,
  },
  {
    month: "Jun",
    present: 400,
    absent: 100,
    late: 5,
  },
];

const chartConfig = {
  present: {
    label: "Present",
    color: "var(--primary)", // Green for present
  },
  absent: {
    label: "Absent",
    color: "var(--danger)", // Red for absent
  },
  late: {
    label: "Late",
    color: "var(--secondary-300)", // Yellow for late
  },
} satisfies ChartConfig;

export function AttendanceBarChart() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Card className="bg-background w-full">
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
        <p className="text-muted-foreground text-sm">This year</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={attendanceData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-[180px]"
                  labelFormatter={(value) => {
                    const monthData = attendanceData.find((item) => item.month === value);
                    return (
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">{value}</span>
                        {monthData && (
                          <div className="grid grid-cols-2 gap-2">
                            <span>Present:</span>
                            <span className="text-right">{monthData.present}</span>
                            <span>Absent:</span>
                            <span className="text-right">{monthData.absent}</span>
                            <span>Late:</span>
                            <span className="text-right">{monthData.late}</span>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar dataKey="present" fill="currentColor" className="text-[#5542F6]" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" fill="currentColor" className="text-[#9DD4AF]" radius={[4, 4, 0, 0]} />
            <Bar dataKey="late" fill="currentColor" className="text-primary" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
