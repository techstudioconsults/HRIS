'use client';

import React from 'react';

interface VerificationCardProps {
  status: 'pending' | 'completed' | 'locked';
  title: string;
  description: string;
  icon: React.ReactNode;
  decorativeIcon?: React.ReactNode;
  buttonLabel: string;
  onButtonClick: () => void | Promise<void>;
  isLoading?: boolean;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({
  status,
  title,
  description,
  icon,
  decorativeIcon,
  buttonLabel,
  onButtonClick,
  isLoading = false,
}) => {
  const isCompleted = status === 'completed';

  const handleClick = async () => {
    if (!isCompleted && !isLoading) {
      await onButtonClick();
    }
  };

  return (
    <div className="relative w-full border border-[#F3F3F3] rounded-lg bg-white p-5 flex items-stretch justify-between gap-4 overflow-hidden hover:shadow-sm transition-shadow">
      {/* Left Content Section */}
      <div className="flex gap-4 flex-1">
        {/* Status Icon */}
        <div className="flex-shrink-0 pt-1">
          {isCompleted ? (
            <div className="w-6 h-6 rounded-full bg-[#0F973D] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-[#878789] flex-shrink-0" />
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-[#232323] mb-1">{title}</h3>
          <p className="text-sm font-normal text-[#878789] mb-3">{description}</p>

          {isCompleted ? (
            <div className="text-sm font-medium text-[#0F973D]">Completed</div>
          ) : (
            <button
              onClick={handleClick}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-[#0266F3] border border-[#0266F3] rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Loading...' : buttonLabel}
            </button>
          )}
        </div>
      </div>

      {/* Right Decorative Icon */}
      {decorativeIcon && !isCompleted && (
        <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center opacity-80">{decorativeIcon}</div>
      )}
    </div>
  );
};
