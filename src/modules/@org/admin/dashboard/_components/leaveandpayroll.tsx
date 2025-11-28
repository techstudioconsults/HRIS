import { SkeletonLoader } from "@/components/shared/loading";
import { lazy, Suspense } from "react";

const LeaveDistributionPieChart = lazy(() =>
  import("./leave-piechart").then((module) => ({ default: module.LeaveDistributionPieChart })),
);

const PayrollLineChart = lazy(() =>
  import("./payrool-linechart").then((module) => ({ default: module.PayrollLineChart })),
);

export function LeaveAndPayroll() {
  return (
    <section className="grid grid-cols-1 gap-5 py-5 md:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
      <Suspense fallback={SkeletonLoader({ variant: "chart" })}>
        <LeaveDistributionPieChart />
      </Suspense>

      <Suspense fallback={SkeletonLoader({ variant: "chart" })}>
        <PayrollLineChart />
      </Suspense>
    </section>
  );
}
