'use client';

import { useState } from 'react';
import { dependencies } from '@/lib/tools/dependencies';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes/routes';

import { ActiveUser } from '@/modules/@org/admin/dashboard/_views/active-user';
import { NewUser } from '@/modules/@org/admin/dashboard/_views/new-user';
import { Onboarding } from '@/modules/@org/admin/dashboard/_views/onboarding';
import { WithDependency } from '@/HOC/withDependencies';
import { useDashboardService } from './services/use-dashboard-service';

const BaseDashboardHomePage = () => {
  const router = useRouter();
  const { useGetCompanySetup } = useDashboardService();
  const { data: setupData } = useGetCompanySetup();

  const checklist = setupData?.checklist;

  const ONBOARDING_STEPS: OnboardingStep[] = [
    {
      title: 'Add your first department/team',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/verify_email.svg',
      isCompleted: checklist?.hasTeam,
      action: () => router.push(routes.admin.teams.list()),
    },
    {
      title: 'Create roles and assign permissions',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/verify_email.svg',
      isCompleted: checklist?.hasRoles,
      action: () => router.push(routes.admin.teams.list()),
    },
    {
      title: 'Add your first employee',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/profile.svg',
      isCompleted: checklist?.hasEmployee,
      action: () => router.push(routes.admin.employees.add()),
    },
    {
      title: 'Set up clock-in system',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/first_product.svg',
      isCompleted: checklist?.hasClockInPolicy,
      action: () => router.push(routes.admin.settings()),
    },
    {
      title: 'Configure payroll info',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/payout.svg',
      isCompleted: checklist?.hasPayrollConfig,
      action: () => router.push(routes.admin.payroll.setup()),
    },
    {
      title: 'Set up leave policy',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/first_sale.svg',
      isCompleted: checklist?.hasLeavePolicy,
      action: () => router.push(routes.admin.leave.types()),
    },
  ];

  const [hasSkippedOnboarding, setHasSkippedOnboarding] = useState(false);

  const completedSteps = ONBOARDING_STEPS.filter(
    (step) => step.isCompleted
  ).length;

  if (setupData?.isComplete || hasSkippedOnboarding) {
    return <ActiveUser />;
  }

  if (completedSteps < 4) {
    return (
      <Wrapper className="max-w-200 my-0! p-0">
        <Onboarding
          steps={ONBOARDING_STEPS}
          onSkip={() => setHasSkippedOnboarding(true)}
        />
      </Wrapper>
    );
  }

  if (completedSteps < ONBOARDING_STEPS.length) {
    return <NewUser steps={ONBOARDING_STEPS} completedSteps={completedSteps} />;
  }

  return <ActiveUser />;
};

export const DashboardHomePage = WithDependency(BaseDashboardHomePage, {
  authService: dependencies.AUTH_SERVICE,
});
