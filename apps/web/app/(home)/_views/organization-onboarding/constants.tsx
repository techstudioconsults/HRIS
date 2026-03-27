export interface OnboardingStepItem {
  title: string;
  description?: string;
  index: string;
}

export const organizationOnboardingHeader = {
  badge: 'Organization onboarding',
  titlePrefix: 'Set Up in Minutes. Run',
  titleMain: 'HR with',
  titleEmphasis: 'Confidence',
  subtitle:
    'Launch quickly and manage HR effortlessly with a platform built for speed and control.',
};

export const onboardingSteps: OnboardingStepItem[] = [
  {
    index: '01',
    title: 'Create your Organization Profile',
    description: 'Set up your company profile and workspace in minutes',
  },
  {
    index: '02',
    title: 'Set up your team',
  },
  {
    index: '03',
    title: 'Create and assign roles',
  },
  {
    index: '04',
    title: 'Onboard Your Employees',
  },
  {
    index: '05',
    title: 'Start HR administrations',
  },
];
