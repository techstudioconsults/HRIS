'use client';

import { dependencies } from '@/lib/tools/dependencies';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes/routes';

import { WithDependency } from '@/HOC/withDependencies';
import { Onboarding } from '@/modules/@org/user/home/_views/onboarding';
import { ActiveUser } from '@/modules/@org/user/home/_views/active-user';
import Lock from '~/images/dashboard/lock.svg';
import Card from '~/images/dashboard/card.svg';
import Gavel from '~/images/dashboard/gavel.svg';
import Coins from '~/images/dashboard/coins.svg';

const HomePage = () => {
  const router = useRouter();

  const ONBOARDING_STEPS: OnboardingStep[] = [
    {
      title: 'Reset Your Password',
      description: 'Change your password to something you can easily remember',
      buttonLabel: 'Change password',
      icon: <Lock />,
      isCompleted: false,
      action: () => {},
    },
    {
      title: 'Review Your Profile Details',
      description:
        'Confirm your personal info (name, department, role, contact).',
      buttonLabel: 'Review Profile',
      icon: <Card />,
      // isCompleted: user?.password_is_set,
      isCompleted: false,
      action: () => router.push(routes.user.dashboard()),
    },
    {
      title: 'Acknowledge HR Policies',
      description:
        "Read and accept your company's attendance, leave, and code of conduct policies.",
      buttonLabel: 'Acknowledge Policy',
      icon: <Gavel />,
      isCompleted: false,
      action: () => router.push(routes.user.profile()),
    },
    {
      title: 'Review Payroll Info',
      description: 'View your payment schedule and salary structure.',
      buttonLabel: 'Review payroll',
      icon: <Coins />,
      isCompleted: false,
      action: () => router.push(`/dashboard/products/new`),
    },
  ];

  const completedSteps =
    ONBOARDING_STEPS.filter((step) => step.isCompleted).length || 4;
  // Less than 4 steps completed -> Onboarding
  if (completedSteps < 4) {
    return (
      <Wrapper className="max-w-200 my-0! p-0">
        <Onboarding steps={ONBOARDING_STEPS} />
      </Wrapper>
    );
  }
  // All 5 steps completed -> ActiveUser
  return <ActiveUser />;
};

export const DashboardHomePage = WithDependency(HomePage, {
  authService: dependencies.AUTH_SERVICE,
});
