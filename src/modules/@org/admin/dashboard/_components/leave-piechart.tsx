"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const teamData = [
  {
    name: "Product",
    leaves: 23,
    percentage: 25,
    fill: "#1F2666", // dark blue
  },
  {
    name: "Sales",
    leaves: 18,
    percentage: 20,
    fill: "#9DD4AF", // success-75
  },
  {
    name: "Marketing",
    leaves: 15,
    percentage: 16,
    fill: "#F4D5A0", // Yellow
  },
  {
    name: "Engineering",
    leaves: 34,
    percentage: 37,
    fill: "#5542F6", // primary
  },
];

export function LeaveDistributionPieChart() {
  return (
    <Card className="bg-background w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Leave Distribution by Teams</CardTitle>
        {/* <p className="text-sm text-gray-500">This month</p> */}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 px-0">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={teamData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                dataKey="leaves"
                nameKey="name"
              >
                {teamData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-md border border-gray-200 bg-white p-3 shadow-md">
                        <p className="font-semibold">{data.name}</p>
                        <p>Leaves: {data.leaves}</p>
                        <p>{data.percentage}% of total</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid w-full grid-cols-2 items-start justify-between md:grid-cols-3 md:items-center lg:grid-cols-4">
          {teamData.map((team) => (
            <div key={team.name} className="">
              <div className="flex items-center justify-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: team.fill }} />
                <span className="text-sm font-medium">{team.name}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
