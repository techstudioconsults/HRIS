export interface OnboardingStepItem {
  title: string;
  description: string;
  index: string;
  previewImageSrc: string;
  previewImageAlt: string;
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
    previewImageSrc:
      'https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto,w_1000/v1774766843/techstudio/hris-repo/wqqwa2vjuplsklo96azw.webp',
    previewImageAlt: 'Organization profile setup preview',
  },
  {
    index: '02',
    title: 'Set up your team',
    description: 'Add departments and assign team members to the right groups.',
    previewImageSrc:
      'https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto,w_1000/v1774771601/techstudio/hris-repo/n5wgvnpwyzrpzhhzhtcf.webp',
    previewImageAlt: 'Team setup preview',
  },
  {
    index: '03',
    title: 'Create and assign roles',
    description:
      'Define permissions and roles to control access across your workspace.',
    previewImageSrc:
      'https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto,w_1000/v1774766844/techstudio/hris-repo/bg8wa6retqdls0f7b8if.webp',
    previewImageAlt: 'Roles and permissions setup preview',
  },
  {
    index: '04',
    title: 'Onboard Your Employees',
    description:
      'Invite employees and capture their key records in one onboarding flow.',
    previewImageSrc:
      'https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto,w_1000/v1774771628/techstudio/hris-repo/ip2im0mkxyb0lrclk11a.webp',
    previewImageAlt: 'Employee onboarding preview',
  },
  {
    index: '05',
    title: 'Start HR administrations',
    description:
      'Run daily HR operations like attendance, leave, and employee updates.',
    previewImageSrc:
      'https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto,w_1000/v1774717335/techstudio/hris-repo/iiv3ky7p8aarak435vke.webp',
    previewImageAlt: 'HR administration dashboard preview',
  },
];
