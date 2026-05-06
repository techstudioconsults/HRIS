'use client';

import Image from 'next/image';

export function SuspenseLoading() {
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
