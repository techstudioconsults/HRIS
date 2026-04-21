'use client';

import React from 'react';
import { Icon } from '@workspace/ui/lib/icons/icon';
import type { ActivityType, ActivityItemProps } from '../types';
import { formatTimestamp } from '@workspace/ui/lib/utils';

const getIconByType = (type: ActivityType) => {
  switch (type) {
    case 'approved':
      return (
        <Icon name="CheckCircle" className="size-4 lg:size-6 text-green-600" />
      );
    case 'rejected':
      return <Icon name="XCircle" className="size-4 lg:size-6 text-red-600" />;
    case 'available':
      return (
        <Icon name="FileText" className="size-4 lg:size-6 text-blue-600" />
      );
    case 'submitted':
      return <Icon name="Clock" className="size-4 lg:size-6 text-yellow-600" />;
    default:
      return (
        <Icon name="FileText" className="size-4 lg:size-6 text-gray-600" />
      );
  }
};

const getIconBgColor = (type: ActivityType): string => {
  switch (type) {
    case 'approved':
      return 'bg-success/10';
    case 'rejected':
      return 'bg-danger/10';
    case 'available':
      return 'bg-primary/10';
    case 'submitted':
      return 'bg-warning/10';
    default:
      return 'bg-white';
  }
};

export const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  title,
  message,
  timestamp,
}) => {
  return (
    <div className="flex  gap-4.5 py-6">
      {/* Icon Container - 45.52px as per design */}
      <div
        className={`shrink-0 flex items-center size-8 lg:size-[45.52px] justify-center rounded-full ${getIconBgColor(type)}`}
      >
        {getIconByType(type)}
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 flex flex-col gap-[3.34px]">
        <h4 className="font-medium text-base lg:text-lg leading-[1.45]">
          {title}
        </h4>
        <p className=" font-normal text-sm text-gray leading-[1.45]">
          {message}
        </p>
        <p className="text-xs  font-normal leading-[1.45]">
          {formatTimestamp(timestamp)}
        </p>
      </div>
    </div>
  );
};
