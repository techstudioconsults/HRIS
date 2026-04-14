'use client';

import { dependencies } from '@/lib/tools/dependencies';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

import { useRouter } from 'next/navigation';

import { ActiveUser } from '@/modules/@org/admin/dashboard/_views/active-user';
import { NewUser } from '@/modules/@org/admin/dashboard/_views/new-user';
import { Onboarding } from '@/modules/@org/admin/dashboard/_views/onboarding';
import { WithDependency } from '@/HOC/withDependencies';

const BaseDashboardHomePage = () => {
  const router = useRouter();

  const ONBOARDING_STEPS: OnboardingStep[] = [
    {
      title: 'Add your first department/team',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/verify_email.svg',
      isCompleted: false,
      action: () => {},
    },
    {
      title: 'Create roles and assign permissions',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/verify_email.svg',
      // isCompleted: user?.password_is_set,
      isCompleted: false,
      action: () => router.push(`/dashboard/settings`),
    },
    {
      title: 'Add your first employee',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/profile.svg',
      isCompleted: false,
      action: () => router.push(`/dashboard/profile`),
    },
    {
      title: 'Set up clock-in system',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/first_product.svg',
      isCompleted: false,
      action: () => router.push(`/dashboard/products/new`),
    },
    {
      title: 'Configure payroll info',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/payout.svg',
      isCompleted: false,
      action: () => router.push(`/dashboard/settings?tab=payment`),
    },
    {
      title: 'Invite other HR team members',
      description: '',
      buttonLabel: 'Configure',
      icon: '/images/first_sale.svg',
      isCompleted: false,
      action: () => router.push(`/dashboard/products/new`),
    },
  ];

  const completedSteps =
    ONBOARDING_STEPS.filter((step) => step.isCompleted).length || 0;
  // Less than 4 steps completed -> Onboarding
  if (completedSteps < 4) {
    return (
      <Wrapper className="max-w-200 my-0! p-0">
        <Onboarding steps={ONBOARDING_STEPS} />
      </Wrapper>
    );
  }
  // Exactly 4 steps completed -> NewUser
  if (completedSteps >= 4 && completedSteps < ONBOARDING_STEPS.length) {
    return <NewUser steps={ONBOARDING_STEPS} completedSteps={completedSteps} />;
  }
  // All 5 steps completed -> ActiveUser
  return <ActiveUser />;
};

export const DashboardHomePage = WithDependency(BaseDashboardHomePage, {
  authService: dependencies.AUTH_SERVICE,
});
