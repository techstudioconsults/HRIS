'use client';

import React from 'react';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { formatDistanceToNow } from 'date-fns';
import { ActivityType } from '../home-types';

interface ActivityItemProps {
  type: ActivityType;
  title: string;
  message: string;
  timestamp: Date | string;
}

const getIconByType = (type: ActivityType) => {
  switch (type) {
    case 'approved':
      return <Icon name="CheckCircle" size={24} className="text-green-600" />;
    case 'rejected':
      return <Icon name="XCircle" size={24} className="text-red-600" />;
    case 'available':
      return <Icon name="FileText" size={24} className="text-blue-600" />;
    case 'submitted':
      return <Icon name="Clock" size={24} className="text-yellow-600" />;
    default:
      return <Icon name="FileText" size={24} className="text-gray-600" />;
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

const formatTimestamp = (date: Date | string): string => {
  const timestampDate = typeof date === 'string' ? new Date(date) : date;

  // Check if it's a specific date (not recent)
  const now = new Date();
  const diffMs = now.getTime() - timestampDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 7) {
    return timestampDate
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-');
  }

  return formatDistanceToNow(timestampDate, { addSuffix: true });
};

export const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  title,
  message,
  timestamp,
}) => {
  return (
    <div className="flex gap-[18px] py-[24px]">
      {/* Icon Container - 45.52px as per design */}
      <div
        className={`flex-shrink-0 flex items-center size-[45.52px] justify-center rounded-full ${getIconBgColor(type)}`}
      >
        {getIconByType(type)}
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 flex flex-col gap-[3.34px]">
        <h4 className="text-[20px] font-medium leading-[1.45] text-[#232323]">
          {title}
        </h4>
        <p className="text-[16px] font-normal leading-[1.45] text-[#878789]">
          {message}
        </p>
        <p className="text-[14px] font-normal leading-[1.45] text-[#878789]">
          {formatTimestamp(timestamp)}
        </p>
      </div>
    </div>
  );
};
