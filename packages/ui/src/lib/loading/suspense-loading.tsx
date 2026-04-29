'use client';

import Image from 'next/image';

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
    <div className="flex items-center justify-center">
      <Image
        src={`/images/logo.png`}
        className="text-primary size-6 animate-spin"
        alt={'techstudio-logo'}
        width={100}
        height={100}
      />
    </div>
  );
}
