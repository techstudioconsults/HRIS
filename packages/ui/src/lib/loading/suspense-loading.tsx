'use client';

import { LucideLoader } from 'lucide-react';

interface SuspenseLoadingProperties {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SuspenseLoading({}: SuspenseLoadingProperties) {
  const sizeClasses = {
    sm: '!h-[30dvh]',
    md: '!h-[50dvh]',
    lg: '!h-[70dvh]',
  };

  return (
    <div className="flex items-center justify-center w-full">
      <LucideLoader className="text-primary size-4 animate-spin" />
    </div>
  );
}
