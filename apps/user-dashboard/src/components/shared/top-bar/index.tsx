'use client';

import { AppEventsListener } from '@/components/shared/app-events-listener';
import { GlobalSearchInput } from '@/modules/@org/shared/search-input';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import {
  NotificationWidget,
  type Notification,
} from '@workspace/ui/lib/notification-widget';
import { UserMenu } from '@workspace/ui/lib/user-menu';
import { cn } from '@workspace/ui/lib/utils';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { MainButton } from '@workspace/ui/lib';

type TopBarProperties = {
  adminName: string;
  adminEmail?: string;
  adminAvatar?: string;
  adminRole?: string;
  notifications?: Notification[];
  className?: string;
};

const handleLogout = async () => {
  try {
    await signOut({
      redirect: true,
      callbackUrl: `/login`,
    });
  } catch {
    toast.error(`Something went wrong`);
  }
};

export default function TopBar({
  adminName,
  adminEmail,
  adminAvatar,
  adminRole,
  notifications = [],
  className = '',
}: TopBarProperties) {
  const [hideMobileSearch, setHideMobileSearch] = useState(true);
  const router = useRouter();
  const [notificationsList, setNotificationsList] =
    useState<Notification[]>(notifications);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotificationsList((previous) =>
      previous.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotificationsList((previous) =>
      previous.map((n) => ({ ...n, read: true }))
    );
  };

  const handleClearAll = () => {
    setNotificationsList([]);
  };

  return (
    <>
      <header
        className={cn(
          'bg-background sticky top-0 z-20 w-full border-b',
          className
        )}
      >
        <div className="flex min-h-16 w-full flex-wrap items-center gap-2 px-3 py-2 sm:px-4 md:flex-nowrap md:gap-4 lg:px-6">
          <SidebarTrigger className="bg-primary-50 text-primary shadow-none hover:bg-primary-75" />

          <div className={`hidden lg:block`}>
            <GlobalSearchInput
              className="border border-primary/25 sm:min-w-[320px] md:min-w-[500px]
            placeholder:text-primary/25 shadow-none md:max-w-[640px]"
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
            <MainButton
              isIconOnly
              size={`icon`}
              icon={<Icon name={`SearchNormal1`} />}
              className={`rounded-full text-primary lg:hidden size-9 hover:bg-primary-50`}
              onClick={() => setHideMobileSearch((previous) => !previous)}
            />
            <NotificationWidget
              notifications={notificationsList}
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
              onProfileClick={() => router.push('/profile')}
              onSettingsClick={() => router.push('/settings')}
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
