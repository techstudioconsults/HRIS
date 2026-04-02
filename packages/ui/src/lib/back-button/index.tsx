'use client';

import React from 'react';
import { cn } from '../utils';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { AnyIconName } from '@/lib/icons/types';
import { IconProps } from 'iconsax-react';

interface BackButtonProperties {
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: number;
  variant?: IconProps;
  iconClassName?: string;
  ariaLabel?: string;
  icon?: AnyIconName;
}

const handleBack = () => {
  history.back();
};

export const BackButton: React.FC<BackButtonProperties> = ({
  iconClassName,
  icon,
  size,
}) => {
  return (
    <span onClick={handleBack} className={cn(`cursor-pointer`, iconClassName)}>
      <Icon size={size} name={icon || 'ArrowLeft2'} />
    </span>
  );
};
