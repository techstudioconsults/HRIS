'use client';

import React, { useTransition } from 'react';
import { Card } from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';
import { MainButton } from '@workspace/ui/lib/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import type { QuickActionCardProps } from '../types';

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  button,
  isCompleted = false,
  icon,
}) => {
  const [isPending, startTransition] = useTransition();
  const {
    label,
    className: buttonClassName,
    onClick,
    ...buttonProperties
  } = button;

  const handleClick = () => {
    startTransition(async () => {
      if (!onClick) return;
      await onClick();
    });
  };

  return (
    <Card className={cn(`flex-row items-start px-8`)}>
      <Checkbox
        checked={isCompleted}
        className={cn(
          'size-4 lg:size-6 rounded-full border-2',
          isCompleted ? 'bg-primary border-black' : 'border-primary'
        )}
      />
      {/* Text Content */}
      <div className="flex flex-col">
        <h3 className="text-[20px] font-medium leading-[1.45]">{title}</h3>
        <p className="text-sm text-gray font-normal leading-[1.45]">
          {description}
        </p>
        {!isCompleted && (
          <MainButton
            isLoading={isPending}
            variant="primaryOutline"
            className={cn('mt-4 w-fit', buttonClassName)}
            onClick={handleClick}
            {...buttonProperties}
          >
            {label}
          </MainButton>
        )}
      </div>
      <div className={`ml-auto my-auto hidden lg:block`}>{icon}</div>
    </Card>
  );
};
