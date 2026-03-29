import { type FaqAccordionItem } from '@workspace/ui/lib';

export const faqItems: FaqAccordionItem[] = [
  {
    id: 'small-teams',
    question: 'Is Techstudio HR suitable for small teams?',
    answer:
      'Absolutely! Techstudio HR is designed to work for teams of any size, from 2 to 2,000+.',
  },
  {
    id: 'payroll-frequency',
    question: 'Can i run payroll biweekly and weekly?',
    answer:
      'Yes. You can set payroll cycles to weekly, biweekly, monthly, or custom schedules that match your operations.',
  },
  {
    id: 'employee-login',
    question: 'Do employees get their own login?',
    answer:
      'Yes. Every employee has a secure personal login to access attendance, leave, and profile details based on assigned permissions.',
  },
  {
    id: 'data-security',
    question: 'Is my company data secure?',
    answer:
      'Yes. Data is protected with role-based access, encrypted transport, and secure authentication practices.',
  },
  {
    id: 'geo-location',
    question: 'Does the attendance feature offer geo-location?',
    answer:
      'Yes. Attendance can be configured with geo-location checks to validate clock-ins from approved locations.',
  },
];
