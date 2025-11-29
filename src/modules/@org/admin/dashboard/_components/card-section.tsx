import { Briefcase, Calendar, Clock, People } from "iconsax-reactjs";

import { CardGroup } from "./card-group";
import { DashboardCard } from "./dashboard-card";

export const CardSection = () => {
  return (
    <CardGroup>
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

      <DashboardCard
        title="Pending Leave Request"
        value={8}
        actionText="View all"
        //   onAction={() => console.log("View all clicked")}
        icon={<Calendar size={20} />}
        iconVariant="primary"
      />

      <DashboardCard
        title="Payroll Summary"
        value="N5.5M"
        //   percentage="94%"
        icon={<Briefcase size={20} />}
        iconVariant="warning"
      />

      <DashboardCard title="Click-In Summary" value="98%" icon={<Clock size={20} />} iconVariant="purple-500" />
    </CardGroup>
  );
};
