import React from 'react';
import { Card } from '@workspace/ui/components/card';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { AnyIconName } from '@workspace/ui/lib/icons/types';
import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';

export const UserDashboardCard = ({
  icon,
  title,
  description,
  color,
  link,
}: {
  icon: AnyIconName;
  title: string;
  description: string;
  color: string;
  link: string;
}) => {
  return (
    <Link href={link}>
      <Card
        className={cn(
          `px-6 rounded-lg shadow border border-transparent 
        transition-[border] duration-500`,
          color === `primary` && `hover:border-primary/10`,
          color === `success` && `hover:border-success/10`,
          color === `danger` && `hover:border-destructive/10`
        )}
      >
        <div
          className={cn(
            `size-10 text-primary border shadow-6xl rounded-lg flex items-center justify-center`,
            color === `primary` &&
              `bg-primary/10 text-primary border-primary/30`,
            color === `success` &&
              `bg-success/10 text-success border-success/30`,
            color === `danger` &&
              `bg-destructive/10 text-destructive border-destructive/30`
          )}
        >
          <Icon name={icon} />
        </div>
        <div>
          <h5 className={`text-lg font-semibold`}>{title}</h5>
          <p className={`text-gray text-sm`}>{description}</p>
        </div>
      </Card>
    </Link>
  );
};
