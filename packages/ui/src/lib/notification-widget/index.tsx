'use client';

import { Check, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { EmptyState, MainButton } from '@workspace/ui/lib';
import { NotificationItem } from '@workspace/ui/lib';
import { NotificationWidgetProperties } from '@workspace/ui/lib';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '../utils';
import { Separator } from '@workspace/ui/components/separator';
import { Icon } from '@workspace/ui/lib/icons/icon';

export function NotificationWidget({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  maxHeight = '500px',
}: NotificationWidgetProperties) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.();
  };

  const handleClearAll = () => {
    onClearAll?.();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={`hover:bg-primary-50`} asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label="Notifications"
        >
          <Icon
            name={`Notification`}
            variant={`Outline`}
            className={`text-primary`}
            size={24}
          />
          {unreadCount > 0 && (
            <span
              className="bg-destructive absolute -top-1 -right-1 flex size-5
             items-center justify-center rounded-full text-[10px] font-bold text-white"
            >
              {displayCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-screen md:min-w-[500px] p-0 shadow-none"
        sideOffset={18}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                {displayCount} new
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={handleMarkAllAsRead}
                  title="Mark all as read"
                >
                  <Check className="size-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive size-8"
                onClick={handleClearAll}
                title="Clear all"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <EmptyState
            className="text-primary"
            icon={<Icon name={`BellOff`} className="text-primary" />}
            title="No notifications."
            description="You have no notifications at the moment."
          />
        ) : (
          <ScrollArea className={cn('overflow-y-auto')} style={{ maxHeight }}>
            <div className="flex flex-col gap-2 p-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={onNotificationClick}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/10 hover:text-primary w-full text-sm font-medium"
                onClick={() => {
                  setOpen(false);
                  // Navigate to notifications page
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

export * from './types';
