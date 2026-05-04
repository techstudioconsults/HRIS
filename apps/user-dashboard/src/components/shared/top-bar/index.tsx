'use client';

import { AppEventsListener } from '@/components/shared/app-events-listener';
import { getTopBarTitle } from '@/lib/routes/top-bar-title';
import { useSession } from '@/lib/session';
import { GlobalSearchInput } from '@/modules/@org/shared/search-input';
import { useAppService } from '@/services/app/use-app-service';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import {
  NotificationWidget,
  type Notification,
} from '@workspace/ui/lib/notification-widget';
import { UserMenu } from '@workspace/ui/lib/user-menu';
import { cn } from '@workspace/ui/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { useLogout } from '@/modules/@org/auth/hooks/use-logout';
import { routes } from '@/lib/routes/routes';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { Button } from '@workspace/ui/components/button';
import type { TopBarProperties } from './types';

export default function TopBar({
  adminName,
  adminEmail,
  adminAvatar,
  adminRole,
  className = '',
  showSidebarTrigger = true,
  sticky = true,
}: TopBarProperties) {
  const pathname = usePathname();
  const [hideMobileSearch, setHideMobileSearch] = useState(true);
  const router = useRouter();
  const handleLogout = useLogout();

  const { data: session } = useSession();
  const employeeId = session?.user.employee.id;

  const {
    useGetNotifications,
    useMarkNotificationRead,
    useMarkAllNotificationsRead,
    useClearAllNotifications,
  } = useAppService();

  const { data: notifications = [] } = useGetNotifications(employeeId);
  const { mutate: markRead } = useMarkNotificationRead(employeeId);
  const { mutate: markAllRead } = useMarkAllNotificationsRead(employeeId);
  const { mutate: clearAll } = useClearAllNotifications(employeeId);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllRead();
  };

  const handleClearAll = () => {
    clearAll();
  };

  const title = getTopBarTitle(pathname);
  return (
    <>
      <header
        className={cn(
          'bg-background top-0 z-20 w-full',
          sticky ? 'sticky' : 'static',
          className
        )}
      >
        <div className="flex min-h-16 w-full flex-wrap items-center gap-2 px-3 py-2 sm:px-4 md:flex-nowrap md:gap-4 lg:px-6">
          {showSidebarTrigger && (
            <SidebarTrigger className="bg-primary-50 text-primary shadow-none hover:bg-primary-75" />
          )}
          <h4 className={cn(`md:hidden`)}>{title}</h4>
          <div
            className={cn('hidden lg:block', !showSidebarTrigger && 'lg:ml-0')}
          >
            <GlobalSearchInput className="sm:min-w-[320px] md:min-w-125 md:max-w-160" />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full text-primary lg:hidden hover:bg-primary-50`}
              aria-label="search"
              onClick={() => setHideMobileSearch((previous) => !previous)}
            >
              <Icon
                variant={`Outline`}
                name={`SearchNormal1`}
                className={`text-primary`}
                size={22}
              />
            </Button>
            <NotificationWidget
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearAll={handleClearAll}
            />
            <UserMenu
              userName={adminName}
              userEmail={adminEmail}
              userAvatar={adminAvatar}
              userRole={adminRole}
              onProfileClick={() =>
                router.push(
                  pathname.startsWith('/admin')
                    ? routes.admin.profile()
                    : routes.user.profile()
                )
              }
              onSettingsClick={() => router.push(routes.admin.settings())}
              onLogout={handleLogout}
            />
          </div>
        </div>
        <div
          className={cn(
            `hidden transition-all duration-300`,
            !hideMobileSearch && `block lg:hidden`
          )}
        >
          <GlobalSearchInput
            className="border-none
            placeholder:text-primary/25 bg-primary/5 rounded-none shadow-none"
          />
        </div>
      </header>
      <AppEventsListener />
    </>
  );
}
