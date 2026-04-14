'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@workspace/ui/components/card';
import { ActivityItem } from '../_components/activity-item';
import { Activity } from '../home-types';

interface RecentActivitiesProps {
  activities: Activity[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
}) => {
  return (
    <div className="flex flex-col gap-[19.2px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[22.56px] font-semibold leading-[1.2] text-[#232323]">
          Recent Activities
        </h2>
        <Link
          href="/user/activities"
          className="text-[18px] font-normal leading-[1.45] text-[#232323] hover:text-[#0266F3] transition-colors"
        >
          See all
        </Link>
      </div>

      {/* Activities Card */}
      <Card className="bg-white overflow-hidden rounded-[5px] border-[0.56px] border-[#EBEBEB]">
        {activities.length > 0 ? (
          <div className="divide-y divide-[#EDF2FA] px-10">
            {activities.map((activity, index) => (
              <div key={activity.id}>
                <ActivityItem
                  type={activity.type}
                  title={activity.title}
                  message={activity.message}
                  timestamp={activity.timestamp}
                />
                {index < activities.length - 1 && (
                  <div
                    style={{
                      height: '1px',
                      backgroundColor: '#EDF2FA',
                      margin: '0',
                    }}
                  />
                )}
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
