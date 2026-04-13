'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { WelcomeWidget } from './welcome-widget';
import { SetupProgress } from './setup-progress';
import { VerificationCard } from './verification-card';
import { SetupTask, SetupPageState, SETUP_TASK_IDS } from './setup-types';

// Icons - using placeholder SVG components
const PasswordIcon = () => (
  <svg
    className="w-6 h-6 text-gray-700"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm0 20c-4.9
     0-9-4.1-9-9s4.1-9 9-9 9 4.1 9 9-4.1 9-9 9zm3.5-9c.8 0 1.5-.7 1.5-1.5S16.3 9 15.5 9
     14 9.7 14 10.5s.7 1.5 1.5 1.5zm-7 0c.8 0 1.5-.7 1.5-1.5S9.3 9 8.5 9 7 9.7 7 10.5 7.7 12 8.5 12z"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg
    className="w-6 h-6 text-gray-700"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
  </svg>
);

const PolicyIcon = () => (
  <svg
    className="w-6 h-6 text-gray-700"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
  </svg>
);

const PayrollIcon = () => (
  <svg
    className="w-6 h-6 text-gray-700"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4
    0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-5.5-3.4V7z"
    />
  </svg>
);

// Decorative icons
const LockDecorativeIcon = () => (
  <svg
    className="w-20 h-20 text-blue-100"
    fill="currentColor"
    viewBox="0 0 24 24"
    opacity={0.5}
  >
    <path d="M18 8h-1V6c0-2.8-2.2-5-5-5s-5 2.2-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
  </svg>
);

const ProfileDecorativeIcon = () => (
  <svg
    className="w-20 h-20 text-blue-100"
    fill="currentColor"
    viewBox="0 0 24 24"
    opacity={0.5}
  >
    <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
  </svg>
);

const PolicyDecorativeIcon = () => (
  <svg
    className="w-20 h-20 text-blue-100"
    fill="currentColor"
    viewBox="0 0 24 24"
    opacity={0.5}
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
  </svg>
);

const PayrollDecorativeIcon = () => (
  <svg
    className="w-20 h-20 text-blue-100"
    fill="currentColor"
    viewBox="0 0 24 24"
    opacity={0.5}
  >
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-5.5-3.4V7z" />
  </svg>
);

export const SetupPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [state, setState] = useState<SetupPageState>({
    tasks: [],
    completedCount: 0,
    totalCount: 4,
    isLoading: true,
    userSetupComplete: false,
  });

  // Initialize tasks
  useEffect(() => {
    const initializeTasks = () => {
      const tasks: SetupTask[] = [
        {
          id: SETUP_TASK_IDS.RESET_PASSWORD,
          title: 'Reset Your Password',
          description:
            'Change your password to something you can easily remember',
          status: 'pending',
          icon: <PasswordIcon />,
          decorativeIcon: <LockDecorativeIcon />,
          buttonLabel: 'Change Password',
          buttonAction: () => router.push('/user/settings/password'),
          order: 1,
        },
        {
          id: SETUP_TASK_IDS.REVIEW_PROFILE,
          title: 'Review Your Profile Details',
          description:
            'Confirm your personal info (name, department, role, contact)',
          status: 'pending',
          icon: <ProfileIcon />,
          decorativeIcon: <ProfileDecorativeIcon />,
          buttonLabel: 'Review Profile',
          buttonAction: () => router.push('/user/profile'),
          order: 2,
        },
        {
          id: SETUP_TASK_IDS.ACKNOWLEDGE_POLICY,
          title: 'Acknowledge HR Policies',
          description:
            "Read and accept your company's attendance, leave, and code of conduct policies",
          status: 'pending',
          icon: <PolicyIcon />,
          decorativeIcon: <PolicyDecorativeIcon />,
          buttonLabel: 'Acknowledge Policy',
          buttonAction: async () => {},
          order: 3,
        },
        {
          id: SETUP_TASK_IDS.REVIEW_PAYROLL,
          title: 'Review Payroll Info',
          description: 'View your payment schedule and salary structure',
          status: 'pending',
          icon: <PayrollIcon />,
          decorativeIcon: <PayrollDecorativeIcon />,
          buttonLabel: 'Review Payroll',
          buttonAction: () => router.push('/user/payslip'),
          order: 4,
        },
      ];

      setState((prev) => ({
        ...prev,
        tasks: tasks.sort((a, b) => a.order - b.order),
        isLoading: false,
      }));
    };

    initializeTasks();
  }, [router]);

  // Calculate completed count
  useEffect(() => {
    const completedCount = state.tasks.filter(
      (t) => t.status === 'completed'
    ).length;
    const userSetupComplete = completedCount === state.totalCount;

    setState((prev) => ({
      ...prev,
      completedCount,
      userSetupComplete,
    }));
  }, [state.tasks, state.totalCount]);

  const handleTaskAction = async (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (task && task.buttonAction) {
      await task.buttonAction();
    }
  };

  const userName = session?.user?.employee?.fullName || 'User';

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0266F3]" />
          <p className="mt-4 text-gray-600">Loading your setup...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full max-w-3xl mx-auto">
      {/* Welcome Widget */}
      <div className="mb-8">
        <WelcomeWidget userName={userName} />
      </div>

      {/* Progress Section */}
      <div className="mb-8">
        <SetupProgress
          completed={state.completedCount}
          total={state.totalCount}
        />
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 gap-4">
        {state.tasks.map((task) => (
          <VerificationCard
            key={task.id}
            status={task.status}
            title={task.title}
            description={task.description}
            icon={task.icon}
            decorativeIcon={task.decorativeIcon}
            buttonLabel={task.buttonLabel}
            onButtonClick={() => handleTaskAction(task.id)}
          />
        ))}
      </div>

      {/* Completion Message */}
      {state.userSetupComplete && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="text-green-600 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Setup Complete!
          </h3>
          <p className="text-green-700">
            You&apos;ve successfully completed your onboarding. You now have
            full access to your HR dashboard.
          </p>
          <button
            onClick={() => router.push('/user/dashboard')}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </main>
  );
};
