import { DashboardHomePage } from '@/modules/@org/admin/dashboard';
import { MarkOnboardingCompleteOnDashboardVisit } from '@/modules/@org/onboarding';

const AdminDashboardPage = () => {
  return (
    <>
      <MarkOnboardingCompleteOnDashboardVisit />
      <DashboardHomePage />
    </>
  );
};

export default AdminDashboardPage;
