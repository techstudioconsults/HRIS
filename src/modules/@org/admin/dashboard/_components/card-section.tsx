import { SkeletonLoader } from "@/components/shared/loading";
import { Briefcase, Calendar, Clock, People } from "iconsax-reactjs";
import { lazy, Suspense } from "react";

import { CardGroup } from "./card-group";

const DashboardCard = lazy(() => import("./dashboard-card").then((module) => ({ default: module.DashboardCard })));

export const CardSection = () => {
  return (
    <CardGroup>
      <Suspense fallback={SkeletonLoader({ variant: "card" })}>
        <DashboardCard
          title="New Joiners"
          value={15}
          percentage="8%"
          showTrendIcon={true}
          trend="up"
          icon={<People size={20} />}
          iconVariant="success"
          titleColor=""
        />
      </Suspense>

      <Suspense fallback={SkeletonLoader({ variant: "card" })}>
        <DashboardCard
          title="Pending Leave Request"
          value={8}
          actionText="View all"
          //   onAction={() => console.log("View all clicked")}
          icon={<Calendar size={20} />}
          iconVariant="primary"
        />
      </Suspense>

      <Suspense fallback={SkeletonLoader({ variant: "card" })}>
        <DashboardCard
          title="Payroll Summary"
          value="N5.5M"
          //   percentage="94%"
          icon={<Briefcase size={20} />}
          iconVariant="warning"
        />
      </Suspense>

      <Suspense fallback={SkeletonLoader({ variant: "card" })}>
        <DashboardCard title="Click-In Summary" value="98%" icon={<Clock size={20} />} iconVariant="purple-500" />
      </Suspense>
    </CardGroup>
  );
};
