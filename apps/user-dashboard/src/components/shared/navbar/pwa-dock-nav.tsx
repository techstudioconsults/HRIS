'use client';

import { adminNavItems, userNavItems } from '@/lib/tools/constants';
import { Icon } from '@workspace/ui/lib/icons/icon';
import type { AnyIconName } from '@workspace/ui/lib/icons/types';
import { cn } from '@workspace/ui/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type DockItem = {
  name: string;
  url: string;
  icon: AnyIconName;
  id?: string;
};

const ADMIN_DOCK_IDS = [
  'dashboard',
  'leave',
  'attendance',
  'settings',
] as const;
const USER_DOCK_IDS = ['dashboard', 'leave', 'attendance', 'payslip'] as const;

const toDockId = (item: DockItem): string =>
  item.id?.toLowerCase() ?? item.name.toLowerCase().replace(/\s+/g, '');

export function PWADockNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const roleName = session?.user.employee.role.name;
  const isOwner = roleName === 'owner';

  const source = (isOwner ? adminNavItems : userNavItems) as DockItem[];
  const allowedIds = new Set<string>(isOwner ? ADMIN_DOCK_IDS : USER_DOCK_IDS);

  const dockItems = source
    .filter((item) => allowedIds.has(toDockId(item)))
    .slice(0, 4);

  return (
    <nav
      className="bg-background/95 backdrop-blur"
      aria-label="PWA dock navigation"
    >
      <div className="grid grid-cols-4 gap-1 px-2 py-2">
        {dockItems.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.url !== '/' && pathname.startsWith(`${item.url}/`));

          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-xs transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon name={item.icon} variant="Bold" size={18} />
              <span className="truncate max-w-full">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
