'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@workspace/ui/components/card';
import { ActivityItem } from '../_components/activity-item';
import type { RecentActivitiesProps } from '../types';

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
}) => {
  return (
    <div className="flex flex-col gap-[19.2px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-semibold leading-[1.2]">
          Recent Activities
        </h2>
        <Link
          href="/user/activities"
          className="text-base lg:text-lg font-normal leading-[1.45]  hover:text-[#0266F3] transition-colors"
        >
          See all
        </Link>
      </div>

      {/* Activities Card */}
      <Card className="overflow-hidden rounded-lg">
        {activities.length > 0 ? (
          <div className="px-5 lg:px-10">
            {activities.map((activity, index) => (
              <div key={activity.id}>
                <ActivityItem
                  type={activity.type}
                  title={activity.title}
                  message={activity.message}
                  timestamp={activity.timestamp ?? ''}
                />
                <hr className={`text-primary/5!`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">No recent activities</p>
          </div>
        )}
      </Card>
    </div>
  );
};
