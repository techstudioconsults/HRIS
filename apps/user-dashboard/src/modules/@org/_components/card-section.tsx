import { CardGroup } from './card-group';
import { DashboardCard } from './dashboard-card';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useRouter } from 'next/navigation';

export const CardSection = () => {
  const navigate = useRouter();
  return (
    <>
      <CardGroup className={``}>
        <DashboardCard
          title="Payroll Summary"
          value="N5.5M"
          percentage="38%"
          showTrendIcon={true}
          trend="up"
          icon={<Icon name="Briefcase" />}
          iconVariant="warning"
        />
        <DashboardCard
          title="Pending Leave Request"
          value={8}
          actionText="View all"
          onAction={() => navigate.push('/admin/leave')}
          icon={<Icon name="Calendar" />}
          iconVariant="primary"
        />
        <DashboardCard
          title="New Joiners"
          value={15}
          icon={<Icon name="People" />}
          iconVariant="success"
          titleColor=""
        />
        <DashboardCard
          title="Click-In Summary"
          value="98%"
          icon={<Icon name="Clock" />}
          iconVariant="purple-500"
        />
      </CardGroup>
      {/*<div className={` flex items-center gap-2 lg:hidden`}>*/}
      {/*  <div>*/}
      {/*    <ExportAction className={`p-3`} />*/}
      {/*  </div>*/}
      {/*  <div className={`w-full`}>*/}
      {/*    <ComboBox*/}
      {/*      options={[]}*/}
      {/*      value={undefined}*/}
      {/*      onValueChange={() => {}}*/}
      {/*      placeholder="Select overview period"*/}
      {/*      className="border-border h-10 border w-full!"*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  );
};
