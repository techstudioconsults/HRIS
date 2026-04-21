'use client';

import { Checkbox } from '@workspace/ui/components/checkbox';
// import Image from "next/image";
import { useTransition } from 'react';
import { MainButton } from '@workspace/ui/lib';
import { cn } from '@workspace/ui/lib/utils';
import { Card } from '@workspace/ui/components/card';
import type { ActionBannerProperties } from '../types';

export const ActionBanner = ({
  title,
  description,
  button,
  // icon,
  className,
  isCompleted = false,
}: ActionBannerProperties) => {
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
    <Card
      className={cn(
        'flex items-center rounded-lg p-6 shadow',
        // "border-low-grey-III border",
        className
      )}
    >
      <div className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={isCompleted}
            className={cn(
              'size-4 lg:size-6 rounded-full border-2',
              isCompleted ? 'bg-primary border-black' : 'border-primary'
            )}
          />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <p className="text-foreground text-sm! font-medium">{title}</p>
              {!isCompleted && <p className="text-sm">{description}</p>}
            </div>
          </div>
        </div>

        {!isCompleted && (
          <MainButton
            isLoading={isPending}
            variant="primary"
            className={cn('w-full lg:w-fit', buttonClassName)}
            onClick={handleClick}
            {...buttonProperties}
          >
            {label}
          </MainButton>
        )}
        {/* {icon && !isCompleted && (
          <Image src={icon} alt="" width={178} height={82} className="hidden object-contain sm:block" />
        )} */}
      </div>
    </Card>
  );
};
