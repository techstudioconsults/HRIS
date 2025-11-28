import { SkeletonLoader } from "@/components/shared/loading";
import { lazy, Suspense } from "react";

const AttendanceBarChart = lazy(() =>
  import("./attendance-barchart").then((module) => ({ default: module.AttendanceBarChart })),
);

const RecentActivities = lazy(() =>
  import("./recent-activities").then((module) => ({ default: module.RecentActivities })),
);

export function AttendanceAndRecentActivities() {
  return (
    <section className="grid grid-cols-1 gap-5 pb-5 md:grid-cols-[minmax(0,60%)_minmax(0,40%)]">
      <Suspense fallback={SkeletonLoader({ variant: "chart" })}>
        <AttendanceBarChart />
      </Suspense>

      <Suspense fallback={SkeletonLoader({ variant: "chart" })}>
        <RecentActivities />
      </Suspense>
    </section>
  );
}
