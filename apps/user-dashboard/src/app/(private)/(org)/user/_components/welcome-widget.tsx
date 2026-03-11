'use client';

import React from 'react';

interface WelcomeWidgetProps {
  userName: string;
  progress?: {
    completed: number;
    total: number;
  };
}

export const WelcomeWidget: React.FC<WelcomeWidgetProps> = ({ userName }) => {
  return (
    <div className="relative w-full rounded-[9px] bg-[#0266F3] px-8 py-10 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 882 427" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lines" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M0 0L30 30M30 0L0 30" stroke="white" strokeWidth="1" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="882" height="427" fill="url(#lines)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-[12px]">
        <h1 className="text-[36px] font-semibold leading-[1.2] text-[#F3F2FB]">Hi, {userName}!</h1>
        <p className="text-[18px] font-normal leading-[1.45] text-[#F3F2FB] opacity-[0.87]">
          Welcome back! Hope you're having a productive day.
        </p>
      </div>
    </div>
  );
};
