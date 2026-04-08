'use client';

import Image from 'next/image';
import { FC } from 'react';

type LogoProperties = {
  logo?: string;
  width?: number;
  height?: number;
  className?: string;
  whiteLogo?: boolean;
};

export const Logo: FC<LogoProperties> = ({
  logo = '/images/logo.png',
  width = 89,
  height = 60,
  className,
}) => {
  return (
    <div data-testid="logo" className="w-fit">
      {logo ? (
        <Image
          src={logo}
          alt="Logo"
          width={width}
          height={height}
          className={className}
        />
      ) : (
        <span className="text-xl font-bold">LOGO</span>
      )}
    </div>
  );
};
