// Define tour segments (timestamps must match actual video length)
import { TourSegment } from '@/lib/video-player/tour-modal/TourVideo';

export const tourSegments: TourSegment[] = [
  {
    id: 'intro',
    title: 'Introduction',
    time: 0,
    description: 'Welcome and high-level platform overview.',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    time: 2,
    description: 'Navigating the main dashboard widgets.',
  },
  {
    id: 'employees',
    title: 'Employees',
    time: 4,
    description: 'Managing employee records and profiles.',
  },
  {
    id: 'payroll',
    title: 'Payroll',
    time: 6,
    description: 'Running payroll and reviewing summaries.',
  },
  {
    id: 'reports',
    title: 'Reports',
    time: 8,
    description: 'Generating and exporting reports.',
  },
  {
    id: 'wrap',
    title: 'Wrap Up',
    time: 10,
    description: 'Next steps and further resources.',
  },
];

export const transcriptLines = [
  'Welcome to TechstudioHR, your streamlined HR management suite.',
  "In this tour we'll highlight the main dashboard and quick actions.",
  'Learn how to add and manage employees effortlessly.',
  'Process payroll with confidence and real-time validation.',
  'Generate insightful reports to drive decision making.',
  "Thank you for watching. You're ready to begin onboarding steps!",
];
