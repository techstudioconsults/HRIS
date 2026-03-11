'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

interface QuickActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bgColor?: string;
  borderColor?: string;
  iconColor?: string;
  href: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  title,
  description,
  bgColor,
  borderColor,
  iconColor,
  href,
}) => {
  return (
    <Link href={href}>
      <Card className={cn(`cursor-pointer transition-all hover:shadow-md overflow-hidden h-full`)}>
        <div className="flex flex-col gap-7 p-[15.7px]">
          {/* Icon Container */}
          <div
            className={cn(
              'flex items-center p-2 border border-primary shadow-md rounded-sm w-fit rounded-[5px]',
              bgColor,
              borderColor
            )}
          >
            <Icon className={cn('w-6 h-6 text-gray-700', iconColor)} />
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-1">
            <h3 className="text-[20px] font-medium leading-[1.45]">{title}</h3>
            <p className="text-[15.7px] font-normal leading-[1.45]">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
