"use client";

import { GlobalSearchInput } from "@/components/core/miscellaneous/search-input";
import { NotificationWidget, type Notification } from "@/components/shared/notification-widget";
import { AppEventsListener } from "@/components/shared/notification-widget/app-events-listener";
import { UserMenu } from "@/components/shared/user-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

type TopBarProperties = {
  adminName: string;
  adminEmail?: string;
  adminAvatar?: string;
  adminRole?: string;
  notifications?: Notification[];
  className?: string;
};

export default function TopBar({
  adminName,
  adminEmail,
  adminAvatar,
  adminRole,
  notifications = [],
  className = "",
}: TopBarProperties) {
  const locale = useLocale();
  const [notificationsList, setNotificationsList] = useState<Notification[]>(notifications);

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: `/${locale}/login`,
      });
    } catch {
      toast.error(`Something went wrong`);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to notification action URL if available
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotificationsList((previous) => previous.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotificationsList((previous) => previous.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotificationsList([]);
  };

  return (
    <>
      <header
        className={cn(
          "bg-background sticky top-0 z-[1] flex h-16 items-center justify-between gap-4 px-6 shadow lg:px-4",
          className,
        )}
      >
        {/* Search Input */}
        <div className="relative hidden w-fit items-center gap-4 md:flex">
          <SidebarTrigger className="absolute top-[3.5rem] -left-[30px] bg-[#1F2666] text-white shadow-none" />
          <GlobalSearchInput />
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-2 md:gap-4">
          {/* Notification Widget */}
          <NotificationWidget
            notifications={notificationsList}
            onNotificationClick={handleNotificationClick}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
          />

          {/* User Menu */}
          <UserMenu
            userName={adminName}
            userEmail={adminEmail}
            userAvatar={adminAvatar}
            userRole={adminRole}
            onProfileClick={() => {
              // Navigate to profile page
              window.location.href = `/${locale}/profile`;
            }}
            onSettingsClick={() => {
              // Navigate to settings page
              window.location.href = `/${locale}/settings`;
            }}
            onLogout={handleLogout}
          />
        </div>
      </header>
      <AppEventsListener />
    </>
  );
}
