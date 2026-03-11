'use client';

import React from 'react';

interface SetupProgressProps {
  completed: number;
  total: number;
}

export const SetupProgress: React.FC<SetupProgressProps> = ({ completed, total }) => {
  const percentage = (completed / total) * 100;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-normal text-[#878789]">
        {completed} of {total} tasks completed
      </p>
      <div className="w-full h-3 bg-[#F3F3F3] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C9E7D3] transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
