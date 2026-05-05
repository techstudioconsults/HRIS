'use client';

import React from 'react';
import Link from 'next/link';
import { routes } from '@/lib/routes/routes';
import { Card } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { ActivityItem } from '../_components/activity-item';
import type { RecentActivitiesProps } from '../types';

const ActivitySkeleton = () => (
  <div className="flex gap-4.5 py-6">
    <Skeleton className="shrink-0 size-8 lg:size-[45.52px] rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-2/5 rounded" />
      <Skeleton className="h-3 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/4 rounded" />
    </div>
  </div>
);

export const RecentActivities: React.FC<
  RecentActivitiesProps & { isLoading?: boolean }
> = ({ activities, isLoading = false }) => {
  return (
    <div className="flex flex-col gap-[19.2px]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-semibold leading-[1.2]">
          Recent Activities
        </h2>
        <Link
          href={routes.user.activities()}
          className="text-base lg:text-lg font-normal leading-[1.45] hover:text-primary transition-colors"
        >
          See all
        </Link>
      </div>

      <Card className="overflow-hidden rounded-lg">
        {isLoading ? (
          <div className="px-5 lg:px-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <ActivitySkeleton />
                <hr className="text-primary/5!" />
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="px-5 lg:px-10">
            {activities.map((activity) => (
              <div key={activity.id}>
                <ActivityItem
                  type={activity.type}
                  title={activity.title}
                  message={activity.message}
                  timestamp={activity.timestamp ?? ''}
                />
                <hr className="text-primary/5!" />
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
