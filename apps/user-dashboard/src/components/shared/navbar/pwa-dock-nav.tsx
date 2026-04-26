'use client';

import { adminNavItems, userNavItems } from '@/lib/tools/constants';
import { Button } from '@workspace/ui/components/button';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@workspace/ui/components/drawer';
import { Logo } from '@workspace/ui/lib/logo';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { cn } from '@workspace/ui/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { DockItem, DockLinkVariant, DockLinkProps } from './types';

const ADMIN_DOCK_IDS = [
  'dashboard',
  'leave',
  'attendance',
  'settings',
] as const;
const USER_DOCK_IDS = ['dashboard', 'leave', 'attendance', 'payslip'] as const;

const toDockId = (item: DockItem): string =>
  item.id?.toLowerCase() ?? item.name.toLowerCase().replace(/\s+/g, '');

const isItemActive = (pathname: string, itemUrl: string) =>
  pathname === itemUrl ||
  (itemUrl !== '/' && pathname.startsWith(`${itemUrl}/`));

const linkVariantClasses: Record<DockLinkVariant, string> = {
  dock: 'size-16 rounded-xl text-[11px] leading-none',
  drawer:
    'h-24 w-24 rounded-2xl border border-border/60 bg-background/70 text-xs shadow-sm backdrop-blur-md',
};

const DockLink = ({
  item,
  pathname,
  variant = 'dock',
  className,
  onNavigate,
}: DockLinkProps) => {
  const isActive = isItemActive(pathname, item.url);

  return (
    <Link
      href={item.url}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group flex flex-col mx-auto items-center justify-center gap-1.5 transition-all duration-200',
        linkVariantClasses[variant],
        isActive
          ? 'text-primary font-semibold'
          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground hover:shadow-sm',
        className
      )}
    >
      <Icon
        name={item.icon}
        variant={isActive ? 'TwoTone' : 'Bold'}
        size={variant === 'dock' ? 18 : 20}
      />
      <span className="max-w-full text-[8px] truncate px-1">{item.name}</span>
    </Link>
  );
};

export function PWADockNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const roleName = session?.user.employee.role.name;
  const isOwner = roleName === 'owner';

  const source = (isOwner ? adminNavItems : userNavItems) as DockItem[];
  const allowedIds = useMemo(
    () => new Set<string>(isOwner ? ADMIN_DOCK_IDS : USER_DOCK_IDS),
    [isOwner]
  );

  const dockItems = useMemo(
    () => source.filter((item) => allowedIds.has(toDockId(item))).slice(0, 4),
    [source, allowedIds]
  );

  const leftItems = dockItems.slice(0, 2);
  const rightItems = dockItems.slice(2, 4);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <nav className="mx-auto px-8" aria-label="PWA dock navigation">
        <div className="flex items-center justify-between border backdrop-blur-2xl rounded-full px-4">
          {leftItems.map((item) => (
            <DockLink
              key={item.url}
              item={item}
              pathname={pathname}
              variant="dock"
            />
          ))}

          <DrawerTrigger asChild>
            <Button
              className="h-fit w-fit rounded-full p-0"
              aria-label="Open all navigation links"
            >
              <Logo
                logo="/images/logo.png"
                width={28}
                height={28}
                className="size-12"
              />
            </Button>
          </DrawerTrigger>

          {rightItems.map((item) => (
            <DockLink
              key={item.url}
              item={item}
              pathname={pathname}
              variant="dock"
            />
          ))}
        </div>
      </nav>

      <DrawerContent className="max-h-[80dvh] px-4 pb-6">
        <div className="my-10 grid grid-cols-3 items-center gap-3">
          {source.map((item) => (
            <DockLink
              key={item.url}
              item={item}
              pathname={pathname}
              variant="drawer"
              onNavigate={() => setIsDrawerOpen(false)}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
