import { CardGroup } from './card-group';
import { DashboardCard } from './dashboard-card';
import { Icon } from '@workspace/ui/lib/icons/icon';

export const CardSection = () => {
  return (
    <CardGroup>
      <DashboardCard
        title="New Joiners"
        value={15}
        percentage="8%"
        showTrendIcon={true}
        trend="up"
        icon={<Icon name="People" />}
        iconVariant="success"
        titleColor=""
      />

      <DashboardCard
        title="Pending Leave Request"
        value={8}
        actionText="View all"
        //   onAction={() => console.log("View all clicked")}
        icon={<Icon name="Calendar" />}
        iconVariant="primary"
      />

      <DashboardCard
        title="Payroll Summary"
        value="N5.5M"
        //   percentage="94%"
        icon={<Icon name="Briefcase" />}
        iconVariant="warning"
      />

      <DashboardCard
        title="Click-In Summary"
        value="98%"
        icon={<Icon name="Clock" />}
        iconVariant="purple-500"
      />
    </CardGroup>
  );
};
