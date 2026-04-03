/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import Link from 'next/link';
import { cn } from '../../utils';
import { Icon } from '@workspace/ui/lib/icons/icon';

export function NavProjects({
  title,
  projects,
}: {
  title?: string;
  projects: {
    name: string;
    url: string;
    icon?: any;
    isActive?: boolean;
  }[];
}) {
  const { state } = useSidebar();

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupLabel className={`font-light mb-2 ml-5`}>
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-5">
        {projects.map((item) => (
          <SidebarMenuItem
            className={cn(
              state === 'collapsed' && 'flex items-center justify-center'
            )}
            key={item.name}
          >
            <Link href={item.url}>
              <SidebarMenuButton
                className={cn(
                  'hover:bg-primary/10 w-full cursor-pointer p-6 transition-all duration-75',
                  item.isActive &&
                    'border-primary bg-primary/40 border-3 font-medium shadow-[0px_0px_0px_2px_#0266F333]'
                )}
              >
                <div>
                  {/*{item.icon && <item.icon className={cn("-ml-1 size-5!")} />}*/}
                  {item.icon && (
                    <Icon
                      variant={item.isActive ? `Bulk` : `Linear`}
                      name={item.icon}
                      size={18}
                      className={cn(
                        `text-background`,
                        item.isActive ? `-ml-1` : `-ml-0.5`
                      )}
                    />
                  )}
                </div>
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.name}
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
