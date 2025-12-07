"use client";

interface ProgressBarProperties {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProperties) => {
  const percentage = (current / total) * 100;

  return (
    <div className="flex w-full flex-col items-end gap-2 sm:w-[216px]">
      <div className="">
        <p className="text-gray !text-xs">
          {current} of {total} tasks completed
        </p>
      </div>
      <div className="bg-success-75 h-1 w-full overflow-hidden rounded-full">
        <div
          className="bg-success h-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
